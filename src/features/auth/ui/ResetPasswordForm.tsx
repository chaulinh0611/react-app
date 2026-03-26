import { cn } from '@/shared/lib/utils';
import { Button } from '@/shared/ui/button/button';
import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/ui/card';
import { Field, FieldGroup, FieldLabel } from '@/shared/ui/field';
import { Input } from '@/shared/ui/input';
import { useResetPassword } from '@/entities/auth/model/useAuthQueries';
import { useAnimatedToast } from '@/shared/ui/animated-toast';
export function ResetPasswordForm({ className, ...props }: React.ComponentProps<'div'>) {
    const { addToast } = useAnimatedToast();

    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState<string | null>(null);

    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const { mutate: resetPassword, isPending: loading } = useResetPassword();

    const email = searchParams.get('email');
    const otp = searchParams.get('otp');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        if (!email) {
            setError('Email không hợp lệ!');
            return;
        }

        if (!otp || otp.length !== 6) {
            setError('OTP phải gồm 6 chữ số!');
            return;
        }

        if (password !== confirmPassword) {
            setError('Mật khẩu xác nhận không khớp!');
            return;
        }

        resetPassword(
            {
                email,
                otp,
                newPassword: password,
            },
            {
                onError: (err: any) => {
                    const message =
                        err?.response?.data?.message || 'OTP không đúng hoặc đã hết hạn!';
                    setError(message);
                },

                onSuccess: () => {
                    addToast({
                        title: 'Reset password successful!',
                        message: 'You can now log in with your new password.',
                        type: 'success',
                    });
                },
            },
        );
    };

    return (
        <div className={cn('flex flex-col gap-6', className)} {...props}>
            <Card>
                <CardHeader>
                    <CardTitle>Reset password</CardTitle>
                    <CardDescription>Enter OTP and your new password</CardDescription>
                </CardHeader>

                <CardContent>
                    <form onSubmit={handleSubmit}>
                        <FieldGroup>
                            {/* New password */}
                            <Field>
                                <FieldLabel>New password</FieldLabel>
                                <Input
                                    type="password"
                                    value={password}
                                    onChange={(e) => {
                                        setPassword(e.target.value);
                                        setError(null);
                                    }}
                                    required
                                />
                            </Field>

                            {/* Confirm password */}
                            <Field>
                                <FieldLabel>Confirm password</FieldLabel>
                                <Input
                                    type="password"
                                    value={confirmPassword}
                                    onChange={(e) => {
                                        setConfirmPassword(e.target.value);
                                        setError(null);
                                    }}
                                    required
                                />
                            </Field>

                            {/* Error message */}
                            {error && <div className="text-sm text-red-500">{error}</div>}

                            {/* Buttons */}
                            <Field className="flex flex-col gap-2">
                                <Button type="submit" disabled={loading}>
                                    {loading ? 'Resetting...' : 'Reset password'}
                                </Button>

                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => navigate('/forgot-password')}
                                >
                                    Back to forgot password
                                </Button>
                            </Field>
                        </FieldGroup>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
