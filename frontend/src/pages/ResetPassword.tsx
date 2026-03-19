import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Lock, Eye, EyeOff, CheckCircle2, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Layout } from '@/components/layout/Layout';
import { useToast } from '@/hooks/use-toast';
import { request } from '@/lib/apiClient';

const resetPasswordSchema = z.object({
  password: z.string().min(6, 'პაროლი უნდა შეიცავდეს მინიმუმ 6 სიმბოლოს'),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'პაროლები არ ემთხვევა',
  path: ['confirmPassword'],
});

type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;

const ResetPassword: React.FC = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isValidToken, setIsValidToken] = useState<boolean | null>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
  });

  useEffect(() => {
    const queryParams = new URLSearchParams(window.location.search);
    const token = queryParams.get('token');
    setIsValidToken(!!token);
    return () => undefined;
  }, []);

  const handleResetPassword = async (data: ResetPasswordFormData) => {
    setIsSubmitting(true);

    try {
      const queryParams = new URLSearchParams(window.location.search);
      const token = queryParams.get('token');
      if (!token) throw new Error('missing token');

      await request('/auth/reset-password', {
        method: 'POST',
        auth: false,
        body: { token, password: data.password },
      });
      setIsSuccess(true);
      toast({
        title: 'წარმატება',
        description: 'პაროლი წარმატებით შეიცვალა!',
      });
      setTimeout(() => {
        navigate('/auth');
      }, 2000);
    } catch (err) {
      toast({
        title: 'შეცდომა',
        description: 'დაფიქსირდა შეცდომა. გთხოვთ სცადოთ მოგვიანებით.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isValidToken === null) {
    return (
      <Layout>
        <div className="min-h-[80vh] flex items-center justify-center py-12 px-4">
          <div className="text-center">
            <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-muted-foreground mt-4">იტვირთება...</p>
          </div>
        </div>
      </Layout>
    );
  }

  if (isValidToken === false) {
    return (
      <Layout>
        <div className="min-h-[80vh] flex items-center justify-center py-12 px-4">
          <div className="w-full max-w-md">
            <div className="bg-card rounded-2xl shadow-xl p-8 text-center">
              <div className="w-16 h-16 bg-destructive/15 rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertTriangle className="w-8 h-8 text-destructive" />
              </div>
              <h2 className="text-2xl font-bold text-foreground mb-2">
                ბმული არასწორია ან ვადაგასულია
              </h2>
              <p className="text-muted-foreground mb-6">
                პაროლის აღდგენის ბმულს ვადა გაუვიდა ან უკვე გამოყენებულია.
                გთხოვთ მოითხოვოთ ახალი ბმული.
              </p>
              <Button onClick={() => navigate('/auth')} className="w-full">
                შესვლის გვერდზე დაბრუნება
              </Button>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  if (isSuccess) {
    return (
      <Layout>
        <div className="min-h-[80vh] flex items-center justify-center py-12 px-4">
          <div className="w-full max-w-md">
            <div className="bg-card rounded-2xl shadow-xl p-8 text-center">
              <div className="w-16 h-16 bg-success/15 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle2 className="w-8 h-8 text-success" />
              </div>
              <h2 className="text-2xl font-bold text-foreground mb-2">
                პაროლი წარმატებით შეიცვალა!
              </h2>
              <p className="text-muted-foreground mb-6">
                ახლა შეგიძლიათ შეხვიდეთ ახალი პაროლით.
              </p>
              <p className="text-sm text-muted-foreground">
                გადამისამართება შესვლის გვერდზე...
              </p>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="min-h-[80vh] flex items-center justify-center py-12 px-4">
        <div className="w-full max-w-md">
          <div className="bg-card rounded-2xl shadow-xl p-8">
            <div className="text-center mb-8">
              <div className="w-12 h-12 bg-primary/15 rounded-full flex items-center justify-center mx-auto mb-4">
                <Lock className="w-6 h-6 text-primary" />
              </div>
              <h1 className="text-2xl font-bold text-foreground">ახალი პაროლის დაყენება</h1>
              <p className="text-muted-foreground mt-2">
                შეიყვანეთ თქვენი ახალი პაროლი
              </p>
            </div>

            <form onSubmit={handleSubmit(handleResetPassword)} className="space-y-4">
              <div>
                <Label htmlFor="password">ახალი პაროლი</Label>
                <div className="relative mt-1">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    {...register('password')}
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="მინიმუმ 6 სიმბოლო"
                    className="pl-10 pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-sm text-destructive mt-1">{errors.password.message}</p>
                )}
              </div>

              <div>
                <Label htmlFor="confirmPassword">გაიმეორეთ პაროლი</Label>
                <div className="relative mt-1">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    {...register('confirmPassword')}
                    id="confirmPassword"
                    type="password"
                    placeholder="გაიმეორეთ პაროლი"
                    className="pl-10"
                  />
                </div>
                {errors.confirmPassword && (
                  <p className="text-sm text-destructive mt-1">{errors.confirmPassword.message}</p>
                )}
              </div>

              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? 'მიმდინარეობს...' : 'პაროლის შეცვლა'}
              </Button>
            </form>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ResetPassword;
