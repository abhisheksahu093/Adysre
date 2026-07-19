'use client';

import { Suspense } from 'react';
import { useTranslations } from 'next-intl';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { registerSchema, type RegisterInput } from '@adysre/validators';
import { ApiClientError } from '@adysre/sdk';
import { Button, Card, CardContent, CardHeader, CardTitle, CardDescription } from '@adysre/ui';
import { Link, useRouter } from '@/i18n/navigation';
import { FormField } from '@/components/auth/form-field';
import { FormAlert } from '@/components/auth/form-alert';
import { OAuthButtons, AuthDivider } from '@/components/auth/oauth-buttons';
import { OAuthError } from '@/components/auth/oauth-error';
import { register as registerAccount } from '@/lib/auth';
import { APP_HOME } from '@/config/navigation';

function slugify(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 63);
}

export default function RegisterPage() {
  const router = useRouter();
  const t = useTranslations('auth.register');
  const tf = useTranslations('auth.fields');
  const to = useTranslations('auth.oauth');
  const {
    register,
    handleSubmit,
    setValue,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<RegisterInput>({ resolver: zodResolver(registerSchema) });

  async function onSubmit(data: RegisterInput) {
    try {
      await registerAccount(data);
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
        <AuthDivider label={to('dividerSignUp')} />
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
          {errors.root && <FormAlert>{errors.root.message}</FormAlert>}
          <FormField
            label={t('organizationName')}
            placeholder="Adysre Inc."
            error={errors.organizationName?.message}
            {...register('organizationName', {
              onChange: (e) => setValue('organizationSlug', slugify(e.target.value)),
            })}
          />
          <FormField
            label={t('organizationSlug')}
            placeholder="adysre"
            error={errors.organizationSlug?.message}
            {...register('organizationSlug')}
          />
          <FormField
            label={t('yourName')}
            autoComplete="name"
            placeholder="Jane Doe"
            error={errors.name?.message}
            {...register('name')}
          />
          <FormField
            label={tf('email')}
            type="email"
            autoComplete="email"
            placeholder={tf('emailPlaceholder')}
            error={errors.email?.message}
            {...register('email')}
          />
          <FormField
            label={tf('password')}
            type="password"
            autoComplete="new-password"
            placeholder={tf('passwordPlaceholder')}
            error={errors.password?.message}
            {...register('password')}
          />
          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? t('submitting') : t('submit')}
          </Button>
        </form>
        <p className="text-center text-sm text-muted-foreground">
          {t('haveAccount')}{' '}
          <Link href="/login" className="text-primary hover:underline">
            {t('signIn')}
          </Link>
        </p>
      </CardContent>
    </Card>
  );
}
