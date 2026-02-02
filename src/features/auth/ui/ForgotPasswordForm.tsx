import { cn } from '@/shared/lib/utils';
import { Button } from '@/shared/ui/button/button';
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/ui/card';
import { Field, FieldGroup, FieldLabel } from '@/shared/ui/field';
import { useNavigate } from 'react-router-dom';
import { Input } from '@/shared/ui/input';
import { authApi } from '@/entities/auth/api/auth.api';

export function ForgotPasswordForm({ className, ...props }: React.ComponentProps<'div'>) {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);

    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setSuccess(null);

        try {
            setLoading(true);
            await authApi.forgotPassword(email);

            setSuccess('OTP đã được gửi về email.');
            setTimeout(() => {
                navigate(`/reset-password?email=${encodeURIComponent(email)}`);
            }, 1000);
        } catch (err: any) {
            setError('Không thể gửi OTP. Vui lòng kiểm tra email.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={cn('flex flex-col gap-6', className)} {...props}>
            <Card>
                <CardHeader>
                    <CardTitle>Forgot password</CardTitle>
                    <CardDescription>
                        Enter your email to receive reset password link
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit}>
                        <FieldGroup>
                            <Field>
                                <FieldLabel>Email</FieldLabel>
                                <Input
                                    type="email"
                                    placeholder="m@example.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                            </Field>

                            {/* ERROR MESSAGE */}
                            {error && <p className="text-sm text-red-500">{error}</p>}

                            {/* SUCCESS MESSAGE */}
                            {success && <p className="text-sm text-green-600">{success}</p>}

                            <Field>
                                <Button type="submit" disabled={loading} className="w-full">
                                    {loading ? 'Sending...' : 'Send reset email'}
                                </Button>
                            </Field>
                        </FieldGroup>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
