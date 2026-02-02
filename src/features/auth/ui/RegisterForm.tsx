import { cn } from '@/shared/lib/utils';
import { Button } from '@/shared/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/ui/card';
import { Field, FieldDescription, FieldGroup, FieldLabel } from '@/shared/ui/field';
import { Input } from '@/shared/ui/input';
import { useState } from 'react';
import { OAuthButton } from './OAuthButton';

export function RegisterForm({ className, ...props }: React.ComponentProps<'div'>) {
    const [registerForm, setRegisterForm] = useState({
        username: '',
        email: '',
        password: '',
        confirmPassword: '',
    });

    const handleSignup = (e: React.FormEvent) => {
        e.preventDefault();
    };

    return (
        <div className={cn('flex flex-col gap-6', className)} {...props}>
            <Card>
                <CardHeader className="text-center">
                    <CardTitle className="text-xl">Create your account</CardTitle>
                    <CardDescription>Enter your email below to create your account</CardDescription>
                </CardHeader>
                <CardContent>
                    <form>
                        <FieldGroup>
                            <Field>
                                <FieldLabel htmlFor="name">Username</FieldLabel>
                                <Input
                                    id="name"
                                    type="text"
                                    placeholder="Username"
                                    required
                                    value={registerForm.username}
                                    onChange={(e) =>
                                        setRegisterForm({
                                            ...registerForm,
                                            username: e.target.value,
                                        })
                                    }
                                />
                            </Field>
                            <Field>
                                <FieldLabel htmlFor="email">Email</FieldLabel>
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="m@example.com"
                                    required
                                    value={registerForm.email}
                                    onChange={(e) =>
                                        setRegisterForm({
                                            ...registerForm,
                                            email: e.target.value,
                                        })
                                    }
                                />
                            </Field>
                            <Field>
                                <Field className="grid grid-cols-2 gap-4">
                                    <Field>
                                        <FieldLabel htmlFor="password">Password</FieldLabel>
                                        <Input
                                            id="password"
                                            type="password"
                                            placeholder="Password"
                                            required
                                            value={registerForm.password}
                                            onChange={(e) =>
                                                setRegisterForm({
                                                    ...registerForm,
                                                    password: e.target.value,
                                                })
                                            }
                                        />
                                    </Field>
                                    <Field>
                                        <FieldLabel htmlFor="confirm-password">
                                            Confirm Password
                                        </FieldLabel>
                                        <Input
                                            id="confirm-password"
                                            type="password"
                                            placeholder="Confirm Password"
                                            required
                                            value={registerForm.confirmPassword}
                                            onChange={(e) =>
                                                setRegisterForm({
                                                    ...registerForm,
                                                    confirmPassword: e.target.value,
                                                })
                                            }
                                        />
                                    </Field>
                                </Field>
                            </Field>
                            <Field>
                                <Button type="submit" onClick={handleSignup}>
                                    Create Account
                                </Button>
                                <OAuthButton />
                                <FieldDescription className="text-center">
                                    Already have an account? <a href="#">Sign in</a>
                                </FieldDescription>
                            </Field>
                        </FieldGroup>
                    </form>
                </CardContent>
            </Card>
            <FieldDescription className="px-6 text-center">
                By clicking continue, you agree to our <a href="#">Terms of Service</a> and{' '}
                <a href="#">Privacy Policy</a>.
            </FieldDescription>
        </div>
    );
}
