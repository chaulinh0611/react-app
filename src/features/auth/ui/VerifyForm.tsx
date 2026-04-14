import { RefreshCwIcon } from 'lucide-react';

import { Button } from '@/shared/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from '@/shared/ui/card';
import { Field, FieldDescription, FieldLabel } from '@/shared/ui/field';
import { InputOTP, InputOTPGroup, InputOTPSeparator, InputOTPSlot } from '@/shared/ui/input-otp';
import { Link, useSearchParams } from 'react-router-dom';
import { useEffect, useRef, useState } from 'react';
import { useVerifyEmail } from '@/entities/auth/model/useAuthQueries';
import { useSendVerifyEmail } from '@/entities/auth/model/useAuthQueries';
import { useAnimatedToast } from '@/shared/ui/animated-toast';

export function InputOTPForm() {
    const [searchParams] = useSearchParams();
    const email = searchParams.get('email') || '';
    const [otp, setOtp] = useState('');
    const { addToast } = useAnimatedToast();

    const { mutate: verifyEmail, isPending: isVerifying } = useVerifyEmail();
    const { mutate: sendVerifyEmail } = useSendVerifyEmail();

    const hasSent = useRef(false);

    const SendEmailHandle = () => {
        if (email && !hasSent.current) {
            hasSent.current = true;
            sendVerifyEmail(
                { email },
                {
                    onSuccess: () => {
                        addToast({
                            title: 'Verification email sent',
                            message: `A verification code has been sent to ${email}. Please check your inbox.`,
                            type: 'success',
                        });

                        hasSent.current = false;
                    },
                },
            );
        }
    };

    const VerifyEmailHandle = () => {
        verifyEmail(
            { email, token: otp },
            {
                onSuccess: () => {
                    addToast({
                        title: 'Email verified',
                        message: 'Your email has been successfully verified. You can now log in.',
                        type: 'success',
                    });
                },
                onError: (error) => {
                    const msg = error.message || 'Failed to verify email. Please try again.';
                    addToast({
                        title: 'Verification failed',
                        message: msg,
                        type: 'error',
                    });
                },
            },
        );
    };

    useEffect(() => {
        SendEmailHandle();
    }, [email]);
    return (
        <Card className="mx-auto max-w-md">
            <CardHeader>
                <CardTitle>Verify your login</CardTitle>
                <CardDescription>
                    Enter the verification code we sent to your email address:{' '}
                    <span className="font-medium">{email}</span>.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <Field>
                    <div className="flex items-center justify-between">
                        <FieldLabel htmlFor="otp-verification">Verification code</FieldLabel>
                        <Button
                            variant="outline"
                            size="xs"
                            onClick={() => SendEmailHandle()}
                            // disabled={isSending}
                        >
                            <RefreshCwIcon />
                            Resend email
                        </Button>
                    </div>
                    <InputOTP
                        maxLength={6}
                        id="otp-verification"
                        required
                        value={otp}
                        onChange={setOtp}
                    >
                        <InputOTPGroup className="*:data-[slot=input-otp-slot]:h-12 *:data-[slot=input-otp-slot]:w-11 *:data-[slot=input-otp-slot]:text-xl">
                            <InputOTPSlot index={0} />
                            <InputOTPSlot index={1} />
                            <InputOTPSlot index={2} />
                        </InputOTPGroup>
                        <InputOTPSeparator className="mx-2" />
                        <InputOTPGroup className="*:data-[slot=input-otp-slot]:h-12 *:data-[slot=input-otp-slot]:w-11 *:data-[slot=input-otp-slot]:text-xl">
                            <InputOTPSlot index={3} />
                            <InputOTPSlot index={4} />
                            <InputOTPSlot index={5} />
                        </InputOTPGroup>
                    </InputOTP>
                    <FieldDescription>
                        <a href="#">I no longer have access to this email address.</a>
                    </FieldDescription>
                </Field>
            </CardContent>
            <CardFooter>
                <Field>
                    <Button
                        type="submit"
                        className="w-full"
                        onClick={() => VerifyEmailHandle()}
                        disabled={isVerifying}
                    >
                        Verify
                    </Button>
                    <div className="text-sm text-muted-foreground">
                        Return logining to normal?{' '}
                        <Link to="/login" className="underline">
                            Click here
                        </Link>
                    </div>
                </Field>
            </CardFooter>
        </Card>
    );
}
