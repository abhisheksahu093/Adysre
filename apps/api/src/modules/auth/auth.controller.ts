import {
  BadRequestException,
  Body,
  Controller,
  Headers,
  Post,
  Req,
  Res,
  UnauthorizedException,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import type { Request, Response } from 'express';
import {
  loginSchema,
  registerSchema,
  type LoginInput,
  type RegisterInput,
} from '@adysre/validators';
import type { AuthContext } from '@adysre/types';
import { AuthService } from './auth.service.js';
import { AuthRepository } from './auth.repository.js';
import { setAuthCookies, clearAuthCookies, REFRESH_COOKIE } from './auth-cookies.js';
import { Public, CurrentUser } from '../../common/decorators/index.js';
import { ZodValidationPipe } from '../../common/pipes/zod-validation.pipe.js';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly auth: AuthService,
    private readonly repo: AuthRepository,
  ) {}

  @Public()
  @Post('register')
  async register(
    @Body(new ZodValidationPipe(registerSchema)) dto: RegisterInput,
    @Res({ passthrough: true }) res: Response,
  ) {
    const result = await this.auth.register(dto);
    setAuthCookies(res, result);
    return { data: { userId: result.auth.userId, tenantId: result.auth.tenantId } };
  }

  @Public()
  @Post('login')
  async login(
    @Headers('x-tenant-slug') slug: string | undefined,
    @Body(new ZodValidationPipe(loginSchema)) dto: LoginInput,
    @Res({ passthrough: true }) res: Response,
  ) {
    const tenantId = await this.resolveTenant(slug);
    const result = await this.auth.login(tenantId, dto);
    setAuthCookies(res, result);
    return { data: { userId: result.auth.userId, tenantId } };
  }

  @Public()
  @Post('refresh')
  async refresh(
    @Headers('x-tenant-slug') slug: string | undefined,
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    const token = req.cookies?.[REFRESH_COOKIE];
    if (!token) throw new UnauthorizedException('Missing refresh token');
    const tenantId = await this.resolveTenant(slug);
    const result = await this.auth.refresh(tenantId, token);
    setAuthCookies(res, result);
    return { data: { ok: true } };
  }

  @Post('logout')
  async logout(
    @CurrentUser() user: AuthContext,
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    const token = req.cookies?.[REFRESH_COOKIE];
    if (token) await this.auth.logout(user.tenantId, token);
    clearAuthCookies(res);
    return { data: { ok: true } };
  }

  private async resolveTenant(slug: string | undefined): Promise<string> {
    if (!slug) throw new BadRequestException('x-tenant-slug header is required');
    const tenantId = await this.repo.findTenantIdBySlug(slug);
    if (!tenantId) throw new UnauthorizedException('Unknown organization');
    return tenantId;
  }
}
