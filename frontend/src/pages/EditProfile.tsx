import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Camera, ArrowLeft, User, Phone, MapPin, FileText, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Layout } from '@/components/layout/Layout';

const profileSchema = z.object({
  username: z.string()
    .min(3, 'მინიმუმ 3 სიმბოლო')
    .max(30, 'მაქსიმუმ 30 სიმბოლო')
    .regex(/^[a-zA-Z0-9_]+$/, 'მხოლოდ ასოები, ციფრები და ქვედა ტირე'),
  full_name: z.string().max(100, 'მაქსიმუმ 100 სიმბოლო').optional().or(z.literal('')),
  phone: z.string().max(20, 'მაქსიმუმ 20 სიმბოლო').optional().or(z.literal('')),
  bio: z.string().max(500, 'მაქსიმუმ 500 სიმბოლო').optional().or(z.literal('')),
  location: z.string().max(100, 'მაქსიმუმ 100 სიმბოლო').optional().or(z.literal('')),
});

type ProfileFormData = z.infer<typeof profileSchema>;

const EditProfile: React.FC = () => {
  const { user, profile, loading, updateProfile } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const form = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      username: '',
      full_name: '',
      phone: '',
      bio: '',
      location: '',
    },
  });

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;

    // Validate file
    if (!file.type.startsWith('image/')) {
      toast({
        title: 'შეცდომა',
        description: 'გთხოვთ აირჩიოთ სურათის ფაილი',
        variant: 'destructive',
      });
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: 'შეცდომა',
        description: 'ფაილის ზომა არ უნდა აღემატებოდეს 5MB-ს',
        variant: 'destructive',
      });
      return;
    }

    setIsUploadingAvatar(true);

    // Show preview
    const previewUrl = URL.createObjectURL(file);
    setAvatarPreview(previewUrl);

    try {
      const toDataUrl = (source: File) =>
        new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => resolve(String(reader.result || ''));
          reader.onerror = () => reject(new Error('Failed to read image'));
          reader.readAsDataURL(source);
        });
      const avatarDataUrl = await toDataUrl(file);

      // Update profile with new avatar URL
      const { error: updateError } = await updateProfile({ avatar_url: avatarDataUrl });

      if (updateError) throw updateError;

      toast({
        title: 'წარმატება',
        description: 'ფოტო წარმატებით განახლდა',
      });
    } catch (error: any) {
      console.error('Avatar upload error:', error);
      toast({
        title: 'შეცდომა',
        description: 'ფოტოს ატვირთვა ვერ მოხერხდა',
        variant: 'destructive',
      });
      setAvatarPreview(null);
    } finally {
      URL.revokeObjectURL(previewUrl);
      setIsUploadingAvatar(false);
    }
  };

  useEffect(() => {
    if (!loading && !user) {
      navigate('/auth');
    }
  }, [user, loading, navigate]);

  useEffect(() => {
    if (profile) {
      form.reset({
        username: profile.username || '',
        full_name: profile.full_name || '',
        phone: profile.phone || '',
        bio: profile.bio || '',
        location: profile.location || '',
      });
    }
  }, [profile, form]);

  const onSubmit = async (data: ProfileFormData) => {
    setIsSubmitting(true);
    const { error } = await updateProfile({
      username: data.username,
      full_name: data.full_name || null,
      phone: data.phone || null,
      bio: data.bio || null,
      location: data.location || null,
    });
    setIsSubmitting(false);

    if (error) {
      let message = 'პროფილის განახლება ვერ მოხერხდა';
      if (error.message?.includes('duplicate')) {
        message = 'ეს მომხმარებლის სახელი უკვე დაკავებულია';
      }
      toast({
        title: 'შეცდომა',
        description: message,
        variant: 'destructive',
      });
    } else {
      toast({
        title: 'წარმატება',
        description: 'პროფილი წარმატებით განახლდა',
      });
      navigate('/profile');
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </Layout>
    );
  }

  if (!user || !profile) {
    return null;
  }

  const initials = profile.full_name
    ? profile.full_name.split(' ').map(n => n[0]).join('').toUpperCase()
    : profile.username?.[0]?.toUpperCase() || 'U';

  return (
    <Layout>
      <div className="max-w-2xl mx-auto py-8 px-4">
        <Button
          variant="ghost"
          onClick={() => navigate('/profile')}
          className="mb-6"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          უკან
        </Button>

        <Card>
          <CardHeader>
            <CardTitle>პროფილის რედაქტირება</CardTitle>
          </CardHeader>
          <CardContent>
            {/* Avatar Section */}
            <div className="flex flex-col items-center mb-8">
              <div className="relative">
                <Avatar className="h-24 w-24">
                  <AvatarImage src={avatarPreview || profile.avatar_url || undefined} />
                  <AvatarFallback className="text-2xl bg-primary text-primary-foreground">
                    {initials}
                  </AvatarFallback>
                </Avatar>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleAvatarUpload}
                  accept="image/*"
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isUploadingAvatar}
                  className="absolute bottom-0 right-0 p-2 bg-primary text-primary-foreground rounded-full shadow-lg hover:bg-primary/90 transition-colors disabled:opacity-50"
                >
                  {isUploadingAvatar ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Camera className="h-4 w-4" />
                  )}
                </button>
              </div>
              <p className="text-sm text-muted-foreground mt-2">
                {isUploadingAvatar ? 'იტვირთება...' : 'დააჭირეთ კამერას ფოტოს შესაცვლელად'}
              </p>
            </div>

            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div>
                <Label htmlFor="username">მომხმარებლის სახელი *</Label>
                <div className="relative mt-1">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">@</span>
                  <Input
                    {...form.register('username')}
                    id="username"
                    className="pl-8"
                    placeholder="username"
                  />
                </div>
                {form.formState.errors.username && (
                  <p className="text-sm text-destructive mt-1">{form.formState.errors.username.message}</p>
                )}
              </div>

              <div>
                <Label htmlFor="full_name">სრული სახელი</Label>
                <div className="relative mt-1">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    {...form.register('full_name')}
                    id="full_name"
                    className="pl-10"
                    placeholder="სახელი გვარი"
                  />
                </div>
                {form.formState.errors.full_name && (
                  <p className="text-sm text-destructive mt-1">{form.formState.errors.full_name.message}</p>
                )}
              </div>

              <div>
                <Label htmlFor="phone">ტელეფონი</Label>
                <div className="relative mt-1">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    {...form.register('phone')}
                    id="phone"
                    className="pl-10"
                    placeholder="+995 5XX XXX XXX"
                  />
                </div>
                {form.formState.errors.phone && (
                  <p className="text-sm text-destructive mt-1">{form.formState.errors.phone.message}</p>
                )}
              </div>

              <div>
                <Label htmlFor="location">მდებარეობა</Label>
                <div className="relative mt-1">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    {...form.register('location')}
                    id="location"
                    className="pl-10"
                    placeholder="თბილისი"
                  />
                </div>
                {form.formState.errors.location && (
                  <p className="text-sm text-destructive mt-1">{form.formState.errors.location.message}</p>
                )}
              </div>

              <div>
                <Label htmlFor="bio">აღწერა</Label>
                <div className="relative mt-1">
                  <Textarea
                    {...form.register('bio')}
                    id="bio"
                    placeholder="მოგვიყევით თქვენს შესახებ..."
                    rows={4}
                  />
                </div>
                <p className="text-sm text-muted-foreground mt-1">
                  {form.watch('bio')?.length || 0}/500 სიმბოლო
                </p>
                {form.formState.errors.bio && (
                  <p className="text-sm text-destructive mt-1">{form.formState.errors.bio.message}</p>
                )}
              </div>

              <div className="flex gap-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate('/profile')}
                  className="flex-1"
                >
                  გაუქმება
                </Button>
                <Button type="submit" className="flex-1" disabled={isSubmitting}>
                  {isSubmitting ? 'ინახება...' : 'შენახვა'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default EditProfile;
