import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { cn } from '@/shared/lib/utils';
import { Button } from '@/shared/ui/button/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/ui/card';
import { Input } from '@/shared/ui/input';
import { useLogin as useLoginMutation } from '@/entities/auth/model/useAuthQueries';
import { LoginSchema, type LoginSchemaType } from '../model';
import { FormField, FormItem, FormLabel, FormControl, FormMessage, Form } from '@/shared/ui/form';
import { OAuthButton } from './OAuthButton';
import { Link } from 'react-router-dom';
import { useAnimatedToast } from '@/shared/ui/animated-toast';
import { validateHandle } from '@/shared/lib/validate_handle';
import { AuthErrorCode } from '@/shared/models/errorCode';
import { useNavigate } from 'react-router-dom';

export function LoginForm({ className, ...props }: React.ComponentProps<'div'>) {
    const { mutate: login, isPending: isLoading } = useLoginMutation();
    const { addToast } = useAnimatedToast();
    const navigator = useNavigate();

    const form = useForm<LoginSchemaType>({
        resolver: zodResolver(LoginSchema),
        defaultValues: {
            email: '',
            password: '',
        },
    });

    const onSubmit = async (data: LoginSchemaType) => {
        login(data, {
            onError: (err: any) => {
                const message: string =
                    (err.error_code === 'VALIDATE_ERROR' ? validateHandle(err) : err.message) ||
                    'Login failed. Please try again.';

                if (err.error_code === AuthErrorCode.EMAIL_NOT_VERIFIED) {
                    navigator('/verify-email?email=' + form.getValues('email'));
                    return;
                }
                addToast({
                    title: 'Login Failed',
                    message: message,
                    type: 'error',
                });
            },

            onSuccess: () => {
                addToast({
                    title: 'Login Successful',
                    message: 'You have successfully logged in.',
                    type: 'success',
                });
            },
        });
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
                                        <div className="flex justify-between items-center">
                                            <FormLabel>Password</FormLabel>
                                            <Link
                                                to="/forgot-password"
                                                className="font-semibold hover:underline text-sm block"
                                            >
                                                Forgot password?
                                            </Link>
                                        </div>
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
                                disabled={isLoading}
                                className="w-full cursor-pointer rounded-[3px]! mt-2"
                            >
                                Continue
                            </Button>
                        </form>
                    </Form>

                    <CardContent className="p-0!">
                        <p className="text-center my-4 text-sm">
                            Don't have an account?
                            <Link to="/register" className=" font-semibold hover:underline ml-1">
                                Sign up
                            </Link>
                        </p>
                    </CardContent>

                    <CardContent className="p-0! flex flex-col mt-4">
                        <OAuthButton />
                    </CardContent>
                </CardContent>
            </Card>
        </div>
    );
}
