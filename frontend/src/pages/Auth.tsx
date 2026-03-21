import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate, useSearchParams, Link, useLocation } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Eye, EyeOff, Mail, Lock, User, Phone, ArrowRight, ArrowLeft, CheckCircle2, Loader2, XCircle } from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { Layout } from '@/components/layout/Layout';
import PhoneVerification from '@/components/auth/PhoneVerification';
import AddressForm, { AddressFormData } from '@/components/auth/AddressForm';
import ForgotPassword from '@/components/auth/ForgotPassword';
import { request } from '@/lib/apiClient';
import twistLogo from '@/assets/twist-logo.png';

const loginSchema = z.object({
  email: z.string().email('გთხოვთ შეიყვანოთ სწორი ელფოსტა'),
  password: z.string().min(1, 'პაროლი სავალდებულოა'),
});

const signupStep1Schema = z.object({
  firstName: z.string().min(1, 'სახელი სავალდებულოა').max(50, 'სახელი ძალიან გრძელია'),
  lastName: z.string().min(1, 'გვარი სავალდებულოა').max(50, 'გვარი ძალიან გრძელია'),
  email: z.string().email('გთხოვთ შეიყვანოთ სწორი ელფოსტა'),
  username: z.string()
    .min(3, 'მომხმარებლის სახელი უნდა შეიცავდეს მინიმუმ 3 სიმბოლოს')
    .max(30, 'მომხმარებლის სახელი ძალიან გრძელია')
    .regex(/^[a-zA-Z0-9_]+$/, 'მხოლოდ ასოები, ციფრები და ქვედა ტირე'),
  phone: z.string()
    .regex(/^\+995\s?\d{3}\s?\d{3}\s?\d{3}$|^\+995\d{9}$/, 'შეიყვანეთ ფორმატით: +995 5XX XXX XXX'),
  password: z.string().min(6, 'პაროლი უნდა შეიცავდეს მინიმუმ 6 სიმბოლოს'),
  confirmPassword: z.string(),
  termsAccepted: z.boolean().refine(val => val === true, {
    message: 'თქვენ უნდა დაეთანხმოთ პირობებს',
  }),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'პაროლები არ ემთხვევა',
  path: ['confirmPassword'],
});

type LoginFormData = z.infer<typeof loginSchema>;
type SignupStep1Data = z.infer<typeof signupStep1Schema>;

type SignupStep = 'info' | 'address' | 'phone-verify' | 'complete';
type AuthView = 'login' | 'signup' | 'forgot-password';

interface SignupData extends SignupStep1Data {
  address?: string;
  city?: string;
  postalCode?: string;
}

declare global {
  interface Window {
    google?: {
      accounts?: {
        id?: {
          initialize: (options: Record<string, unknown>) => void;
          renderButton: (element: HTMLElement, options: Record<string, unknown>) => void;
        };
      };
    };
  }
}

const Auth: React.FC = () => {
  const [searchParams] = useSearchParams();
  const location = useLocation();
  const [view, setView] = useState<AuthView>('login');
  const [signupStep, setSignupStep] = useState<SignupStep>('info');
  const [signupData, setSignupData] = useState<SignupData | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [createdUserId, setCreatedUserId] = useState<string | null>(null);
  const [emailCheckState, setEmailCheckState] = useState<'idle' | 'checking' | 'available' | 'taken'>('idle');
  const [googleReady, setGoogleReady] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const googleButtonRef = useRef<HTMLDivElement | null>(null);
  const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID as string | undefined;
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user, signIn, signInWithGoogle, signUp } = useAuth();

  const handleGoogleCredential = useCallback(
    async (response: { credential?: string }) => {
      if (!response?.credential) return;

      setIsGoogleLoading(true);
      const { error } = await signInWithGoogle(response.credential);
      setIsGoogleLoading(false);

      if (error) {
        toast({
          title: 'შეცდომა',
          description: 'Google ავტორიზაცია ვერ შესრულდა',
          variant: 'destructive',
        });
        return;
      }

      toast({
        title: 'წარმატება',
        description: 'თქვენ წარმატებით შეხვედით სისტემაში',
      });
      navigate('/');
    },
    [navigate, signInWithGoogle, toast]
  );

  // Debounced email check
  const checkEmailExists = useCallback(async (email: string) => {
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setEmailCheckState('idle');
      return;
    }
    
    setEmailCheckState('checking');
    try {
      const result = await request<{ available: boolean }>(
        `/auth/check-email?email=${encodeURIComponent(email.toLowerCase().trim())}`,
        { auth: false }
      );
      setEmailCheckState(result.available ? 'available' : 'taken');
    } catch {
      setEmailCheckState('idle');
    }
  }, []);

  // Check if redirected for phone verification
  useEffect(() => {
    const viewParam = searchParams.get('view');
    if (viewParam === 'forgot-password') {
      setView('forgot-password');
      return;
    }
    if (viewParam === 'signup') {
      setView('signup');
      setSignupStep('info');
      return;
    }
    if (location.pathname === '/forgot-password') {
      setView('forgot-password');
      return;
    }

    const verifyPhone = searchParams.get('verify-phone');
    if (verifyPhone === 'true') {
      setView('signup');
      setSignupStep('phone-verify');
    }
  }, [searchParams, location.pathname]);

  useEffect(() => {
    if (!googleClientId) return;

    const intervalId = window.setInterval(() => {
      if (window.google?.accounts?.id) {
        setGoogleReady(true);
        window.clearInterval(intervalId);
      }
    }, 300);

    return () => window.clearInterval(intervalId);
  }, [googleClientId]);

  useEffect(() => {
    if (view !== 'login' || !googleClientId || !googleReady || !googleButtonRef.current) return;

    window.google?.accounts?.id?.initialize({
      client_id: googleClientId,
      callback: handleGoogleCredential,
    });

    googleButtonRef.current.innerHTML = '';
    window.google?.accounts?.id?.renderButton(googleButtonRef.current, {
      theme: 'outline',
      size: 'large',
      text: 'continue_with',
      shape: 'pill',
      width: 320,
    });
  }, [view, googleClientId, googleReady, handleGoogleCredential]);

  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      navigate('/');
    }
  }, [user, navigate]);

  const loginForm = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const signupForm = useForm<SignupStep1Data>({
    resolver: zodResolver(signupStep1Schema),
    defaultValues: {
      phone: '+995 ',
      termsAccepted: false,
    },
  });

  const handleLogin = async (data: LoginFormData) => {
    setIsSubmitting(true);
    const { error } = await signIn(data.email.toLowerCase().trim(), data.password);
    setIsSubmitting(false);

    if (error) {
      let message = 'დაფიქსირდა შეცდომა';
      let errorCode = '';
      
      if (error.message.includes('Invalid login credentials')) {
        // Check if email exists first
        message = 'არასწორი ელფოსტა ან პაროლი';
        errorCode = 'INVALID_CREDENTIALS';
      } else if (error.message.includes('Email not confirmed')) {
        message = 'გთხოვთ დაადასტუროთ თქვენი ელფოსტა';
        errorCode = 'EMAIL_NOT_CONFIRMED';
      }
      
      toast({
        title: 'შეცდომა',
        description: message,
        variant: 'destructive',
      });
    } else {
      toast({
        title: 'წარმატება',
        description: 'თქვენ წარმატებით შეხვედით სისტემაში',
      });
      navigate('/');
    }
  };

  const handleSignupStep1 = async (data: SignupStep1Data) => {
    // Block submission if email is taken
    if (emailCheckState === 'taken') {
      toast({
        title: 'შეცდომა',
        description: 'ეს ელფოსტა უკვე რეგისტრირებულია',
        variant: 'destructive',
      });
      return;
    }
    setSignupData(data);
    setSignupStep('address');
  };

  const handleAddressSubmit = async (addressData: AddressFormData) => {
    if (!signupData) return;

    const fullData: SignupData = {
      ...signupData,
      address: addressData.address,
      city: addressData.city,
      postalCode: addressData.postalCode,
    };

    setSignupData(fullData);
    setIsSubmitting(true);

    // Create the account
    const { error, userId } = await signUp(
      fullData.email.toLowerCase().trim(),
      fullData.password,
      {
        username: fullData.username,
        full_name: `${fullData.firstName} ${fullData.lastName}`,
        first_name: fullData.firstName,
        last_name: fullData.lastName,
        phone: fullData.phone.replace(/\s/g, ''),
        city: fullData.city,
        address: fullData.address,
      }
    );

    setIsSubmitting(false);

    if (error) {
      let message = 'დაფიქსირდა შეცდომა';
      if (error.message.includes('User already registered')) {
        message = 'ეს ელფოსტა უკვე რეგისტრირებულია';
      } else if (error.message.includes('Password should be')) {
        message = 'პაროლი უნდა იყოს მინიმუმ 6 სიმბოლო';
      }
      toast({
        title: 'შეცდომა',
        description: message,
        variant: 'destructive',
      });
    } else {
      if (userId) {
        setCreatedUserId(userId);
      }
      setSignupStep('phone-verify');
    }
  };

  const handlePhoneVerificationComplete = () => {
    setSignupStep('complete');
    toast({
      title: 'წარმატება',
      description: 'ანგარიში წარმატებით შეიქმნა!',
    });
    setTimeout(() => {
      navigate('/');
    }, 2000);
  };

  const renderSignupStep = () => {
    switch (signupStep) {
      case 'info':
        return (
          <form onSubmit={signupForm.handleSubmit(handleSignupStep1)} className="space-y-4">
            {/* Progress indicator */}
            <div className="flex items-center justify-center mb-6">
              <div className="flex items-center">
                <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-medium">1</div>
                <div className="w-12 h-1 bg-muted mx-1" />
                <div className="w-8 h-8 rounded-full bg-muted text-muted-foreground flex items-center justify-center text-sm font-medium">2</div>
                <div className="w-12 h-1 bg-muted mx-1" />
                <div className="w-8 h-8 rounded-full bg-muted text-muted-foreground flex items-center justify-center text-sm font-medium">3</div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label htmlFor="firstName">სახელი *</Label>
                <Input
                  {...signupForm.register('firstName')}
                  id="firstName"
                  placeholder="სახელი"
                  className="mt-1"
                />
                {signupForm.formState.errors.firstName && (
                  <p className="text-xs text-destructive mt-1">{signupForm.formState.errors.firstName.message}</p>
                )}
              </div>
              <div>
                <Label htmlFor="lastName">გვარი *</Label>
                <Input
                  {...signupForm.register('lastName')}
                  id="lastName"
                  placeholder="გვარი"
                  className="mt-1"
                />
                {signupForm.formState.errors.lastName && (
                  <p className="text-xs text-destructive mt-1">{signupForm.formState.errors.lastName.message}</p>
                )}
              </div>
            </div>

            <div>
              <Label htmlFor="signup-email">ელფოსტა *</Label>
              <div className="relative mt-1">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  {...signupForm.register('email', {
                    onBlur: (e) => checkEmailExists(e.target.value)
                  })}
                  id="signup-email"
                  type="email"
                  placeholder="example@mail.com"
                  className={`pl-10 pr-10 ${emailCheckState === 'taken' ? 'border-destructive focus-visible:ring-destructive' : ''}`}
                />
                <div className="absolute right-3 top-1/2 -translate-y-1/2">
                  {emailCheckState === 'checking' && (
                    <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                  )}
                  {emailCheckState === 'available' && (
                    <CheckCircle2 className="h-4 w-4 text-success" />
                  )}
                  {emailCheckState === 'taken' && (
                    <XCircle className="h-4 w-4 text-destructive" />
                  )}
                </div>
              </div>
              {signupForm.formState.errors.email && (
                <p className="text-sm text-destructive mt-1">{signupForm.formState.errors.email.message}</p>
              )}
              {emailCheckState === 'taken' && (
                <p className="text-sm text-destructive mt-1">ეს ელფოსტა უკვე რეგისტრირებულია</p>
              )}
            </div>

            <div>
              <Label htmlFor="username">მომხმარებლის სახელი *</Label>
              <div className="relative mt-1">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  {...signupForm.register('username')}
                  id="username"
                  placeholder="მაგ: nika123"
                  className="pl-10"
                />
              </div>
              {signupForm.formState.errors.username && (
                <p className="text-sm text-destructive mt-1">{signupForm.formState.errors.username.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor="phone">ტელეფონი *</Label>
              <div className="relative mt-1">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  {...signupForm.register('phone')}
                  id="phone"
                  placeholder="+995 5XX XXX XXX"
                  className="pl-10"
                />
              </div>
              {signupForm.formState.errors.phone && (
                <p className="text-sm text-destructive mt-1">{signupForm.formState.errors.phone.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor="signup-password">პაროლი *</Label>
              <div className="relative mt-1">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  {...signupForm.register('password')}
                  id="signup-password"
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
              {signupForm.formState.errors.password && (
                <p className="text-sm text-destructive mt-1">{signupForm.formState.errors.password.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor="confirmPassword">გაიმეორეთ პაროლი *</Label>
              <div className="relative mt-1">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  {...signupForm.register('confirmPassword')}
                  id="confirmPassword"
                  type="password"
                  placeholder="გაიმეორეთ პაროლი"
                  className="pl-10"
                />
              </div>
              {signupForm.formState.errors.confirmPassword && (
                <p className="text-sm text-destructive mt-1">{signupForm.formState.errors.confirmPassword.message}</p>
              )}
            </div>

            {/* Terms checkbox */}
            <div className="flex items-start gap-3">
              <Checkbox
                id="termsAccepted"
                checked={signupForm.watch('termsAccepted')}
                onCheckedChange={(checked) => signupForm.setValue('termsAccepted', checked === true, { shouldValidate: true })}
                className="mt-0.5"
              />
              <label htmlFor="termsAccepted" className="text-sm text-muted-foreground leading-relaxed">
                ვეთანხმები{' '}
                <Link to="/terms" className="text-primary hover:underline" target="_blank">მომსახურების პირობებს</Link>
                {' '}და{' '}
                <Link to="/privacy" className="text-primary hover:underline" target="_blank">კონფიდენციალურობის პოლიტიკას</Link>
              </label>
            </div>
            {signupForm.formState.errors.termsAccepted && (
              <p className="text-sm text-destructive">{signupForm.formState.errors.termsAccepted.message}</p>
            )}

            <Button 
              type="submit" 
              className="w-full"
              disabled={emailCheckState === 'taken' || emailCheckState === 'checking'}
            >
              გაგრძელება
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </form>
        );

      case 'address':
        return (
          <>
            {/* Progress indicator */}
            <div className="flex items-center justify-center mb-6">
              <div className="flex items-center">
                <div className="w-8 h-8 rounded-full bg-success text-success-foreground flex items-center justify-center text-sm font-medium">
                  <CheckCircle2 className="h-4 w-4" />
                </div>
                <div className="w-12 h-1 bg-primary mx-1" />
                <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-medium">2</div>
                <div className="w-12 h-1 bg-muted mx-1" />
                <div className="w-8 h-8 rounded-full bg-muted text-muted-foreground flex items-center justify-center text-sm font-medium">3</div>
              </div>
            </div>

            <div className="text-center mb-6">
              <h2 className="text-xl font-semibold text-foreground">თქვენი მისამართი</h2>
              <p className="text-sm text-muted-foreground mt-1">საჭიროა მიწოდებისთვის</p>
            </div>

            <AddressForm
              onSubmit={handleAddressSubmit}
              isSubmitting={isSubmitting}
              submitText="გაგრძელება"
              onBack={() => setSignupStep('info')}
            />
          </>
        );

      case 'phone-verify':
        return (
          <>
            {/* Progress indicator */}
            <div className="flex items-center justify-center mb-6">
              <div className="flex items-center">
                <div className="w-8 h-8 rounded-full bg-success text-success-foreground flex items-center justify-center text-sm font-medium">
                  <CheckCircle2 className="h-4 w-4" />
                </div>
                <div className="w-12 h-1 bg-success mx-1" />
                <div className="w-8 h-8 rounded-full bg-success text-success-foreground flex items-center justify-center text-sm font-medium">
                  <CheckCircle2 className="h-4 w-4" />
                </div>
                <div className="w-12 h-1 bg-primary mx-1" />
                <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-medium">3</div>
              </div>
            </div>

            <PhoneVerification
              phone={signupData?.phone || ''}
              userId={createdUserId || undefined}
              onVerificationComplete={handlePhoneVerificationComplete}
            />
          </>
        );

      case 'complete':
        return (
          <div className="text-center py-8">
            <div className="w-20 h-20 bg-success/15 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle2 className="w-10 h-10 text-success" />
            </div>
            <h2 className="text-2xl font-bold text-foreground mb-2">
              კეთილი იყოს თქვენი მობრძანება!
            </h2>
            <p className="text-muted-foreground mb-6">
              თქვენი ანგარიში წარმატებით შეიქმნა.
            </p>
            <p className="text-sm text-muted-foreground">
              გადამისამართება მთავარ გვერდზე...
            </p>
          </div>
        );
    }
  };

  if (view === 'forgot-password') {
    return (
      <Layout>
        <div className="min-h-[80vh] flex items-center justify-center py-12 px-4">
          <div className="w-full max-w-md">
            <div className="bg-card rounded-2xl shadow-xl p-8">
              <ForgotPassword onBack={() => setView('login')} />
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
            {/* Logo */}
            <div className="text-center mb-8">
              <div className="flex items-center justify-center mb-4">
                <img
                  src={twistLogo}
                  alt="Twist"
                  className="h-10 w-auto object-contain group-hover:scale-105 transition-transform"
                />
              </div>
              <h1 className="text-2xl font-bold text-foreground">
                {view === 'login' ? 'კეთილი იყოს თქვენი მობრძანება' : 'შექმენით ანგარიში'}
              </h1>
              <p className="text-muted-foreground mt-2">
                {view === 'login' ? 'შედით თქვენს ანგარიშში' : 'შეუერთდით Twist საზოგადოებას'}
              </p>
            </div>

            {view === 'signup' && signupStep !== 'info' ? null : (
              /* Tabs */
              <div className="flex mb-6 bg-muted rounded-lg p-1">
                <button
                  onClick={() => {
                    setView('login');
                    setSignupStep('info');
                  }}
                  className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                    view === 'login'
                      ? 'bg-background text-foreground shadow'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  შესვლა
                </button>
                <button
                  onClick={() => {
                    setView('signup');
                    setSignupStep('info');
                  }}
                  className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                    view === 'signup'
                      ? 'bg-background text-foreground shadow'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  რეგისტრაცია
                </button>
              </div>
            )}

            {view === 'login' ? (
              <>
                <form onSubmit={loginForm.handleSubmit(handleLogin)} className="space-y-4">
                  <div>
                    <Label htmlFor="email">ელფოსტა</Label>
                    <div className="relative mt-1">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        {...loginForm.register('email')}
                        id="email"
                        type="email"
                        placeholder="example@mail.com"
                        className="pl-10"
                      />
                    </div>
                    {loginForm.formState.errors.email && (
                      <p className="text-sm text-destructive mt-1">{loginForm.formState.errors.email.message}</p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="password">პაროლი</Label>
                    <div className="relative mt-1">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        {...loginForm.register('password')}
                        id="password"
                        type={showPassword ? 'text' : 'password'}
                        placeholder="••••••••"
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
                    {loginForm.formState.errors.password && (
                      <p className="text-sm text-destructive mt-1">{loginForm.formState.errors.password.message}</p>
                    )}
                  </div>

                  <div className="text-right">
                    <button
                      type="button"
                      onClick={() => setView('forgot-password')}
                      className="text-sm text-primary hover:underline"
                    >
                      დაგავიწყდათ პაროლი?
                    </button>
                  </div>

                  <Button type="submit" className="w-full" disabled={isSubmitting}>
                    {isSubmitting ? 'იტვირთება...' : 'შესვლა'}
                  </Button>
                </form>

                {googleClientId && (
                  <>
                    <div className="my-4 flex items-center gap-2 text-xs text-muted-foreground">
                      <div className="h-px flex-1 bg-border" />
                      <span>ან</span>
                      <div className="h-px flex-1 bg-border" />
                    </div>

                    <div className="flex justify-center">
                      <div ref={googleButtonRef} />
                    </div>
                    {isGoogleLoading && (
                      <p className="mt-2 text-center text-sm text-muted-foreground">იტვირთება...</p>
                    )}
                  </>
                )}
              </>
            ) : (
              renderSignupStep()
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Auth;
