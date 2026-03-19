import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { MapPin, Building2, Hash } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const GEORGIAN_CITIES = [
  'თბილისი',
];

const addressSchema = z.object({
  city: z.string().min(1, 'გთხოვთ აირჩიოთ ქალაქი'),
  address: z
    .string()
    .min(5, 'მისამართი უნდა შეიცავდეს მინიმუმ 5 სიმბოლოს')
    .max(200, 'მისამართი ძალიან გრძელია'),
  postalCode: z
    .string()
    .regex(/^\d{4}$/, 'საფოსტო ინდექსი უნდა შედგებოდეს 4 ციფრისგან')
    .optional()
    .or(z.literal('')),
  apartment: z.string().optional(),
  floor: z.string().optional(),
});

export type AddressFormData = z.infer<typeof addressSchema>;

interface AddressFormProps {
  onSubmit: (data: AddressFormData) => void;
  initialData?: Partial<AddressFormData>;
  isSubmitting?: boolean;
  submitText?: string;
  onBack?: () => void;
}

const AddressForm: React.FC<AddressFormProps> = ({
  onSubmit,
  initialData,
  isSubmitting = false,
  submitText = 'გაგრძელება',
  onBack,
}) => {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<AddressFormData>({
    resolver: zodResolver(addressSchema),
    defaultValues: initialData,
  });

  const selectedCity = watch('city');

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      <div className="bg-muted/50 p-4 rounded-xl mb-4">
        <div className="flex items-start gap-3">
          <MapPin className="h-5 w-5 text-primary mt-0.5" />
          <p className="text-sm text-muted-foreground">
            თქვენი მისამართი გამოყენებული იქნება მხოლოდ მიწოდებისთვის.
            ჩვენ არ გავყიდით თქვენს ინფორმაციას მესამე პირებს.
          </p>
        </div>
      </div>

      {/* City Selection */}
      <div>
        <Label htmlFor="city">ქალაქი *</Label>
        <Select
          value={selectedCity}
          onValueChange={(value) => setValue('city', value, { shouldValidate: true })}
        >
          <SelectTrigger className={`mt-1 ${errors.city ? 'border-destructive' : ''}`}>
            <SelectValue placeholder="აირჩიეთ ქალაქი" />
          </SelectTrigger>
          <SelectContent>
            {GEORGIAN_CITIES.map((city) => (
              <SelectItem key={city} value={city}>
                {city}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors.city && (
          <p className="mt-1 text-sm text-destructive">{errors.city.message}</p>
        )}
      </div>

      {/* Street Address */}
      <div>
        <Label htmlFor="address">ქუჩა, შენობის №, ბინა *</Label>
        <div className="relative mt-1">
          <Building2 className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <textarea
            {...register('address')}
            rows={2}
            className={`w-full pl-10 pr-4 py-3 border rounded-xl focus:ring-2 focus:ring-primary focus:border-primary transition bg-background resize-none ${
              errors.address ? 'border-destructive' : 'border-input'
            }`}
            placeholder="მაგ: რუსთაველის გამზირი 12, მე-4 შესასვლელი, ბინა 24"
          />
        </div>
        {errors.address && (
          <p className="mt-1 text-sm text-destructive">{errors.address.message}</p>
        )}
      </div>

      {/* Additional Details Grid */}
      <div className="grid grid-cols-3 gap-3">
        <div>
          <Label htmlFor="postalCode">ინდექსი</Label>
          <div className="relative mt-1">
            <Hash className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              {...register('postalCode')}
              className={`pl-10 ${errors.postalCode ? 'border-destructive' : ''}`}
              placeholder="0179"
              maxLength={4}
            />
          </div>
          {errors.postalCode && (
            <p className="mt-1 text-xs text-destructive">{errors.postalCode.message}</p>
          )}
        </div>

        <div>
          <Label htmlFor="apartment">ბინა</Label>
          <Input
            {...register('apartment')}
            className="mt-1"
            placeholder="24"
          />
        </div>

        <div>
          <Label htmlFor="floor">სართული</Label>
          <Input
            {...register('floor')}
            className="mt-1"
            placeholder="4"
          />
        </div>
      </div>

      <div className="pt-2 space-y-3">
        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? 'მიმდინარეობს...' : submitText}
        </Button>

        {onBack && (
          <Button type="button" variant="outline" onClick={onBack} className="w-full">
            უკან დაბრუნება
          </Button>
        )}
      </div>
    </form>
  );
};

export default AddressForm;
