import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Mail, ArrowLeft, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { request } from '@/lib/apiClient';

const forgotPasswordSchema = z.object({
  email: z.string().email('გთხოვთ შეიყვანოთ სწორი ელფოსტა'),
});

type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;

interface ForgotPasswordProps {
  onBack: () => void;
}

const ForgotPassword: React.FC<ForgotPasswordProps> = ({ onBack }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [devResetUrl, setDevResetUrl] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    getValues,
  } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  const handleForgotPassword = async (data: ForgotPasswordFormData) => {
    setIsSubmitting(true);
    setError(null);

    try {
      const response = await request<{ ok: boolean; resetUrl?: string }>('/auth/forgot-password', {
        method: 'POST',
        auth: false,
        body: { email: data.email.toLowerCase().trim() },
      });
      setDevResetUrl(response.resetUrl || null);
      setIsSuccess(true);
    } catch (err) {
      setError('დაფიქსირდა შეცდომა. გთხოვთ სცადოთ მოგვიანებით.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="text-center py-4">
        <div className="w-16 h-16 bg-success/15 rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle2 className="w-8 h-8 text-success" />
        </div>
        <h3 className="text-xl font-semibold text-foreground mb-2">
          შეამოწმეთ თქვენი ელფოსტა
        </h3>
        <p className="text-muted-foreground mb-6">
          თუ ელფოსტა <strong>{getValues('email')}</strong> რეგისტრირებულია,
          გამოგეგზავნებათ პაროლის აღდგენის ბმული.
        </p>
        <p className="text-sm text-muted-foreground mb-4">
          ვერ იპოვეთ ელფოსტა? შეამოწმეთ სპამის საქაღალდე.
        </p>
        {devResetUrl && (
          <div className="mb-4 p-3 text-left rounded-lg bg-muted">
            <p className="text-xs text-muted-foreground mb-1">Dev reset link:</p>
            <a className="text-sm text-primary break-all hover:underline" href={devResetUrl}>
              {devResetUrl}
            </a>
          </div>
        )}
        <Button variant="outline" onClick={onBack} className="w-full">
          <ArrowLeft className="mr-2 h-4 w-4" />
          შესვლის გვერდზე დაბრუნება
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <div className="w-12 h-12 bg-primary/15 rounded-full flex items-center justify-center mx-auto mb-4">
          <Mail className="w-6 h-6 text-primary" />
        </div>
        <h2 className="text-2xl font-bold text-foreground">დაგავიწყდათ პაროლი?</h2>
        <p className="text-muted-foreground mt-2">
          შეიყვანეთ თქვენი ელფოსტა და გამოგიგზავნით პაროლის აღდგენის ბმულს.
        </p>
      </div>

      {error && (
        <div className="p-3 bg-destructive/10 border border-destructive/30 rounded-lg">
          <p className="text-destructive text-sm text-center">{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit(handleForgotPassword)} className="space-y-4">
        <div>
          <Label htmlFor="reset-email">ელფოსტა</Label>
          <div className="relative mt-1">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              {...register('email')}
              id="reset-email"
              type="email"
              placeholder="example@mail.com"
              className="pl-10"
            />
          </div>
          {errors.email && (
            <p className="text-sm text-destructive mt-1">{errors.email.message}</p>
          )}
        </div>

        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? 'იგზავნება...' : 'პაროლის აღდგენის ბმულის გაგზავნა'}
        </Button>
      </form>

      <Button variant="ghost" onClick={onBack} className="w-full">
        <ArrowLeft className="mr-2 h-4 w-4" />
        შესვლის გვერდზე დაბრუნება
      </Button>
    </div>
  );
};

export default ForgotPassword;
