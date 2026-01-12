import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { cn } from '@/shared/lib/utils';
import { Button } from '@/shared/ui/button/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/ui/card';
import { Input } from '@/shared/ui/input';
import { useLogin } from '../model/useLogin';
import { LoginSchema, type LoginFormValues } from '@/shared/lib/utils';
import { FormField, FormItem, FormLabel, FormControl, FormMessage, Form } from '@/shared/ui/form';
import { OAuthButton } from './oauth-login';

export function LoginForm({ className, ...props }: React.ComponentProps<'div'>) {
    const { login } = useLogin();
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const form = useForm<LoginFormValues>({
        resolver: zodResolver(LoginSchema),
        defaultValues: {
            email: '',
            password: '',
        },
    });

    const onSubmit = async (data: LoginFormValues) => {
        setIsLoading(true);
        setError(null);
        try {
            await login(data.email, data.password);
        } catch (err: any) {
            alert(err.response.data.message || 'Login failed. Please try again.');
            setError(err.response.data.message|| 'Login failed. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className={cn('flex flex-col gap-6', className)} {...props}>
            <Card>
                <CardHeader>
                    <CardTitle className="text-center">Welcome back</CardTitle>
                    <CardDescription className="text-center">
                        Login for connect to your account
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Form {...form}>
                        <form
                            onSubmit={form.handleSubmit(onSubmit)}
                            className="flex flex-col gap-4"
                        >
                            <FormField
                                control={form.control}
                                name="email"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Email</FormLabel>
                                        <FormControl>
                                            <Input
                                                className="rounded-[3px]!"
                                                placeholder="Enter your email"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="password"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Password</FormLabel>
                                        <FormControl>
                                            <Input
                                                className="rounded-[3px]!"
                                                type="password"
                                                placeholder="Enter your password"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <Button
                                type="submit"
                                className="w-full bg-blue-500! hover:bg-blue-700! cursor-pointer rounded-[3px]! mt-2"
                            >
                                Continue
                            </Button>
                        </form>
                    </Form>

                    <CardContent className="p-0! flex flex-col mt-4">
                        <div>
                            <p className="text-center my-4 text-[14px] font-semibold  text-gray-500">
                                Or continue with:
                            </p>
                        </div>
                        <OAuthButton />
                    </CardContent>
                </CardContent>
            </Card>
        </div>
    );
}
