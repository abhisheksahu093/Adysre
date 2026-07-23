'use client';

import { Suspense, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { resetPasswordSchema, type ResetPasswordInput } from '@adysre/validators';
import { ApiClientError } from '@adysre/sdk';
import { Button, Card, CardContent, CardHeader, CardTitle, CardDescription } from 'adysre';
import { Link, useRouter } from '@/i18n/navigation';
import { FormField } from '@/components/auth/form-field';
import { FormAlert } from '@/components/auth/form-alert';
import { resetPassword } from '@/lib/auth';

function ResetPasswordForm() {
  const router = useRouter();
  // Reading a query param, not a route - the plain hook is correct here.
  const token = useSearchParams().get('token') ?? '';
  const [done, setDone] = useState(false);
  const t = useTranslations('auth.resetPassword');
  const tf = useTranslations('auth.fields');
  const tc = useTranslations('common');

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<ResetPasswordInput>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: { token, password: '', confirmPassword: '' },
  });

  async function onSubmit(data: ResetPasswordInput) {
    try {
      await resetPassword(data);
      setDone(true);
    } catch (err) {
      // Only the API's own errors are safe to show; anything else (network,
      // parse) would leak a raw browser string like "Failed to fetch".
      setError('root', {
        message: err instanceof ApiClientError ? err.message : t('genericError'),
      });
    }
  }

  if (!token) {
    return (
      <CardContent className="space-y-4">
        <FormAlert>{t('invalidLink')}</FormAlert>
        <Button className="w-full" onClick={() => router.push('/forgot-password')}>
          {t('requestNew')}
        </Button>
      </CardContent>
    );
  }

  if (done) {
    return (
      <CardContent className="space-y-4">
        <FormAlert variant="success">{t('success')}</FormAlert>
        <Button className="w-full" onClick={() => router.push('/login')}>
          {t('continueToSignIn')}
        </Button>
      </CardContent>
    );
  }

  return (
    <CardContent className="space-y-4">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
        {errors.root && <FormAlert>{errors.root.message}</FormAlert>}
        <input type="hidden" {...register('token')} />
        <FormField
          label={t('newPassword')}
          type="password"
          autoComplete="new-password"
          placeholder={tf('passwordPlaceholder')}
          error={errors.password?.message}
          {...register('password')}
        />
        <FormField
          label={t('confirmPassword')}
          type="password"
          autoComplete="new-password"
          placeholder={tf('passwordPlaceholder')}
          error={errors.confirmPassword?.message}
          {...register('confirmPassword')}
        />
        <p className="text-xs text-muted-foreground">{t('hint')}</p>
        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? t('submitting') : t('submit')}
        </Button>
      </form>
      <p className="text-center text-sm text-muted-foreground">
        <Link href="/login" className="text-primary hover:underline">
          {tc('backToSignIn')}
        </Link>
      </p>
    </CardContent>
  );
}

export default function ResetPasswordPage() {
  const t = useTranslations('auth.resetPassword');
  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('title')}</CardTitle>
        <CardDescription>{t('description')}</CardDescription>
      </CardHeader>
      {/* useSearchParams needs a Suspense boundary to avoid opting the route into CSR bailout. */}
      <Suspense fallback={<CardContent className="h-56" />}>
        <ResetPasswordForm />
      </Suspense>
    </Card>
  );
}
