import { cn } from '@/shared/lib/utils';
import { Button } from '@/shared/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/ui/card';
import { Field, FieldDescription, FieldGroup, FieldLabel } from '@/shared/ui/field';
import { Input } from '@/shared/ui/input';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRegister as useRegisterMutation } from '@/entities/auth/model/useAuthQueries';
import { RegisterSchema, RegisterSchemaType } from '../model';
import { OAuthButton } from './OAuthButton';
import { FormField, FormItem, FormControl, FormMessage } from '@/shared/ui/form';
import { Form } from '@/shared/ui/form';
import { Link } from 'react-router-dom';

export function RegisterForm({ className, ...props }: React.ComponentProps<'div'>) {
    const { mutate: register, isPending: isLoading } = useRegisterMutation();
    const [error, setError] = useState<string | null>(null);

    const form = useForm<RegisterSchemaType>({
        resolver: zodResolver(RegisterSchema),
        defaultValues: {
            username: '',
            email: '',
            password: '',
            confirmPassword: '',
        },
    });

    const onSubmit = (data: RegisterSchemaType) => {
        setError(null);
        register(
            {
                username: data.username,
                email: data.email,
                password: data.password,
            },
            {
                onError: (err: any) => {
                    const message =
                        err.response?.data?.message || 'Registration failed. Please try again.';
                    alert(message);
                    setError(message);
                },
            },
        );
    };

    return (
        <div className={cn('flex flex-col gap-6', className)} {...props}>
            <Card>
                <CardHeader className="text-center">
                    <CardTitle className="text-xl">Create your account</CardTitle>
                    <CardDescription>Enter your email below to create your account</CardDescription>
                </CardHeader>
                <CardContent>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                            <FormField
                                control={form.control}
                                name="username"
                                render={({ field }) => (
                                    <FormItem>
                                        <FieldLabel htmlFor="username">Username</FieldLabel>
                                        <FormControl>
                                            <Input
                                                {...field}
                                                id="username"
                                                type="text"
                                                placeholder="Username"
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="email"
                                render={({ field }) => (
                                    <FormItem>
                                        <FieldLabel htmlFor="email">Email</FieldLabel>
                                        <FormControl>
                                            <Input
                                                {...field}
                                                id="email"
                                                type="email"
                                                placeholder="m@example.com"
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <div className="grid grid-cols-2 gap-4">
                                <FormField
                                    control={form.control}
                                    name="password"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FieldLabel htmlFor="password">Password</FieldLabel>
                                            <FormControl>
                                                <Input
                                                    {...field}
                                                    id="password"
                                                    type="password"
                                                    placeholder="Password"
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="confirmPassword"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FieldLabel htmlFor="confirm-password">
                                                Confirm Password
                                            </FieldLabel>
                                            <FormControl>
                                                <Input
                                                    {...field}
                                                    id="confirm-password"
                                                    type="password"
                                                    placeholder="Confirm Password"
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                            <Button type="submit" disabled={isLoading} className="w-full">
                                {isLoading ? 'Creating Account...' : 'Create Account'}
                            </Button>
                            <OAuthButton />
                            <FieldDescription className="text-center">
                                Already have an account?{' '}
                                <Link to="/login" className="font-semibold hover:underline">
                                    Sign in
                                </Link>
                            </FieldDescription>
                        </form>
                    </Form>
                </CardContent>
            </Card>
            <FieldDescription className="px-6 text-center">
                By clicking continue, you agree to our <a href="#">Terms of Service</a> and{' '}
                <a href="#">Privacy Policy</a>.
            </FieldDescription>
        </div>
    );
}
