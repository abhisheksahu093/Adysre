'use client';

import { Suspense } from 'react';
import { useTranslations } from 'next-intl';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { loginSchema, type LoginInput } from '@adysre/validators';
import { ApiClientError } from '@adysre/sdk';
import { Button, Card, CardContent, CardHeader, CardTitle, CardDescription } from '@adysre/ui';
import { Link, useRouter } from '@/i18n/navigation';
import { FormField } from '@/components/auth/form-field';
import { FormAlert } from '@/components/auth/form-alert';
import { OAuthButtons, AuthDivider } from '@/components/auth/oauth-buttons';
import { OAuthError } from '@/components/auth/oauth-error';
import { login } from '@/lib/auth';
import { APP_HOME } from '@/config/navigation';

export default function LoginPage() {
  const router = useRouter();
  const t = useTranslations('auth.signIn');
  const tf = useTranslations('auth.fields');
  const to = useTranslations('auth.oauth');
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<LoginInput>({ resolver: zodResolver(loginSchema) });

  async function onSubmit(data: LoginInput) {
    try {
      await login(data);
      router.push(APP_HOME);
    } catch (err) {
      // Only the API's own errors are safe to show; anything else would leak a
      // raw browser string like "Failed to fetch".
      setError('root', { message: err instanceof ApiClientError ? err.message : t('failed') });
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('title')}</CardTitle>
        <CardDescription>{t('description')}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Suspense fallback={null}>
          <OAuthError />
        </Suspense>
        <OAuthButtons />
        <AuthDivider label={to('dividerSignIn')} />
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
          {errors.root && <FormAlert>{errors.root.message}</FormAlert>}
          <FormField
            label={tf('email')}
            type="email"
            autoComplete="email"
            placeholder={tf('emailPlaceholder')}
            error={errors.email?.message}
            {...register('email')}
          />
          <div className="space-y-1.5">
            <FormField
              label={tf('password')}
              type="password"
              autoComplete="current-password"
              placeholder={tf('passwordPlaceholder')}
              error={errors.password?.message}
              {...register('password')}
            />
            <div className="text-right">
              <Link href="/forgot-password" className="text-xs text-primary hover:underline">
                {t('forgotPassword')}
              </Link>
            </div>
          </div>
          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? t('submitting') : t('submit')}
          </Button>
        </form>
        <p className="text-center text-sm text-muted-foreground">
          {t('noAccount')}{' '}
          <Link href="/register" className="text-primary hover:underline">
            {t('createOne')}
          </Link>
        </p>
      </CardContent>
    </Card>
  );
}
