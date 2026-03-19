import React, { useState, useEffect, useRef } from 'react';
import { CheckCircle2, Phone, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { request } from '@/lib/apiClient';

interface PhoneVerificationProps {
  phone: string;
  userId?: string;
  onVerificationComplete: () => void;
  onBack?: () => void;
}

const PhoneVerification: React.FC<PhoneVerificationProps> = ({
  phone,
  userId,
  onVerificationComplete,
  onBack,
}) => {
  const [code, setCode] = useState<string[]>(Array(6).fill(''));
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [verificationSuccess, setVerificationSuccess] = useState(false);
  const [devCode, setDevCode] = useState<string | null>(null);
  
  
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const formatPhone = (phoneNumber: string) => {
    const clean = phoneNumber.replace(/\s/g, '');
    if (clean.startsWith('+995')) {
      return clean.replace(/(\+995)(\d{3})(\d{3})(\d{3})/, '$1 $2 $3 $4');
    }
    return phoneNumber;
  };

  useEffect(() => {
    // Send initial verification code
    handleResendCode();
  }, []);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (countdown > 0) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [countdown]);

  const handleCodeChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;
    
    const newCode = [...code];
    newCode[index] = value.slice(-1);
    setCode(newCode);
    setError(null);

    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }

    if (newCode.every(digit => digit !== '') && value) {
      handleSubmit(newCode.join(''));
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !code[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text');
    const digits = pastedData.replace(/\D/g, '').slice(0, 6);
    
    if (digits.length === 6) {
      const newCode = digits.split('');
      setCode(newCode);
      inputRefs.current[5]?.focus();
      handleSubmit(digits);
    }
  };

  const handleSubmit = async (fullCode?: string) => {
    const verificationCode = fullCode || code.join('');
    
    if (verificationCode.length !== 6) {
      setError('გთხოვთ შეიყვანოთ ყველა 6 ციფრი');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const data = await request<{ success: boolean; message?: string }>('/auth/phone/verify', {
        method: 'POST',
        auth: false,
        body: { phone, code: verificationCode },
      });

      if (data.success) {
        setVerificationSuccess(true);
        setTimeout(() => {
          onVerificationComplete();
        }, 1500);
      } else {
        setError(data.message || 'არასწორი კოდი');
        setCode(Array(6).fill(''));
        inputRefs.current[0]?.focus();
      }
    } catch (err: any) {
      setError(err.message || 'დაფიქსირდა შეცდომა');
      setCode(Array(6).fill(''));
      inputRefs.current[0]?.focus();
    } finally {
      setLoading(false);
    }
  };

  const handleResendCode = async () => {
    if (countdown > 0) return;
    
    setResendLoading(true);
    setError(null);

    try {
      const data = await request<{ success: boolean; message?: string; devCode?: string }>('/auth/phone/send', {
        method: 'POST',
        auth: false,
        body: { phone },
      });

      if (data.success) {
        setCountdown(120);
        setDevCode(data.devCode || null);
      } else {
        setError(data.message || 'ვერ გაიგზავნა SMS');
      }
    } catch (err: any) {
      setError(err.message || 'დაფიქსირდა შეცდომა');
    } finally {
      setResendLoading(false);
    }
  };

  if (verificationSuccess) {
    return (
      <div className="text-center py-8">
        <div className="w-16 h-16 bg-success/15 rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle2 className="w-8 h-8 text-success" />
        </div>
        <h3 className="text-xl font-semibold text-foreground mb-2">
          ტელეფონი წარმატებით დადასტურდა!
        </h3>
        <p className="text-muted-foreground">გადამისამართება...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <div className="w-12 h-12 bg-primary/15 rounded-full flex items-center justify-center mx-auto mb-4">
          <Phone className="w-6 h-6 text-primary" />
        </div>
        <h2 className="text-2xl font-bold text-foreground">ტელეფონის დადასტურება</h2>
        <p className="text-muted-foreground mt-2">
          გამოგეგზავნათ SMS კოდი ნომერზე:
        </p>
        <p className="text-lg font-semibold text-foreground mt-1">
          {formatPhone(phone)}
        </p>
      </div>


      {error && (
        <div className="p-3 bg-destructive/10 border border-destructive/30 rounded-lg">
          <p className="text-destructive text-sm text-center">{error}</p>
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-foreground mb-3 text-center">
          შეიყვანეთ 6-ციფრიანი კოდი:
        </label>
        
        <div className="flex justify-center gap-2" onPaste={handlePaste}>
          {code.map((digit, index) => (
            <input
              key={index}
              ref={(el) => { inputRefs.current[index] = el; }}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={digit}
              onChange={(e) => handleCodeChange(index, e.target.value)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              className={`w-12 h-14 text-center text-2xl font-bold border rounded-xl focus:ring-2 focus:ring-primary focus:border-primary transition bg-background ${
                error ? 'border-destructive' : 'border-input'
              }`}
              autoFocus={index === 0}
              disabled={loading}
            />
          ))}
        </div>
        
        <p className="text-center text-sm text-muted-foreground mt-3">
          კოდი ძალაში იქნება 5 წუთის განმავლობაში
        </p>
        {devCode && (
          <p className="text-center text-xs text-primary mt-2">
            Dev code: {devCode}
          </p>
        )}
      </div>

      <Button
        onClick={() => handleSubmit()}
        disabled={loading || code.some(digit => !digit)}
        className="w-full"
      >
        {loading ? (
          <span className="flex items-center justify-center">
            <RefreshCw className="animate-spin mr-2 h-4 w-4" />
            მიმდინარეობს დადასტურება...
          </span>
        ) : (
          'დაადასტურეთ ტელეფონი'
        )}
      </Button>

      <div className="text-center space-y-3">
        <p className="text-muted-foreground text-sm">
          არ მიიღეთ კოდი?
        </p>
        <Button
          variant="outline"
          onClick={handleResendCode}
          disabled={countdown > 0 || resendLoading}
          className="w-full"
        >
          {resendLoading ? (
            <span className="flex items-center justify-center">
              <RefreshCw className="animate-spin mr-2 h-4 w-4" />
              იგზავნება...
            </span>
          ) : countdown > 0 ? (
            `ხელახლა გაგზავნა (${Math.floor(countdown / 60)}:${(countdown % 60).toString().padStart(2, '0')})`
          ) : (
            'კოდის ხელახლა გაგზავნა'
          )}
        </Button>

        {onBack && (
          <Button variant="ghost" onClick={onBack} className="w-full">
            უკან დაბრუნება
          </Button>
        )}
      </div>
    </div>
  );
};

export default PhoneVerification;
