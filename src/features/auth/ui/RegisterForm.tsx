import { useState } from 'react';
import { cn } from '@/shared/lib/utils';
import { Button } from '@/shared/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/ui/card';
import { Field, FieldGroup, FieldLabel } from '@/shared/ui/field';
import { Input } from '@/shared/ui/input';
import { Loader2 } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { RegisterSchema, type RegisterSchemaType, VerifyEmailSchema, type VerifyEmailSchemaType } from '../model/schema';
import { authApi } from "@/entities/auth/api/auth.api";
import { useNavigate } from 'react-router-dom';
import { OAuthButton } from './OAuthButton';

export function RegisterForm({ className, ...props }: React.ComponentProps<'div'>) {
    const navigate = useNavigate();
    
    const [step, setStep] = useState<'register' | 'verify'>('register');
    const [registeredEmail, setRegisteredEmail] = useState('');

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<RegisterSchemaType>({
        resolver: zodResolver(RegisterSchema),
        defaultValues: {
            username: '',
            email: '',
            password: '',
            confirmPassword: '',
        }
    });

    const handleSignup = async (data: RegisterSchemaType) => {
        try {
            await authApi.register(data);
            
            setRegisteredEmail(data.email);
            setStep('verify');
            
        } catch (error: any) {
            console.error("Registration failed", error);
            alert(error?.response?.data?.message || "Something went wrong during registration.");
        }
    };

    const { 
        register: registerVerify, 
        handleSubmit: handleVerifySubmit, 
        formState: { errors: verifyErrors, isSubmitting: isVerifying } 
    } = useForm<VerifyEmailSchemaType>({
        resolver: zodResolver(VerifyEmailSchema),
        values: { email: registeredEmail, otp: "" } 
    });

    const handleVerifyOtp = async (data: VerifyEmailSchemaType) => {
        try {
            await authApi.verifyEmail({ 
                email: data.email, 
                token: data.otp
            });
            alert("Xác thực thành công! Đang chuyển hướng tới trang đăng nhập...");
            navigate("/login");
        } catch (error: any) {
            alert(error.response?.data?.message || "Mã OTP không đúng hoặc đã hết hạn.");
        }
    };


    return (
        <div className={cn('flex flex-col gap-6', className)} {...props}>
            <Card className="shadow-lg border-none">
                
                {/* --- HIỂN THỊ DỰA TRÊN STATE 'step' --- */}
                {step === 'register' ? (
                    <>
                        <CardHeader className="text-center space-y-1">
                            <CardTitle className="text-2xl font-bold">Create an account</CardTitle>
                            <CardDescription>Enter your details below to get started</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleSubmit(handleSignup)}>
                                <FieldGroup className="space-y-4">
                                    <Field>
                                        <FieldLabel htmlFor="username">Username</FieldLabel>
                                        <Input
                                            id="username"
                                            type="text"
                                            placeholder="johndoe"
                                            {...register("username")}
                                        />
                                        {errors.username && <p className="text-red-500 text-xs">{errors.username.message}</p>}
                                    </Field>

                                    <Field>
                                        <FieldLabel htmlFor="email">Email</FieldLabel>
                                        <Input
                                            id="email"
                                            type="email"
                                            placeholder="name@example.com"
                                            {...register("email")}
                                        />
                                        {errors.email && <p className="text-red-500 text-xs">{errors.email.message}</p>}
                                    </Field>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <Field>
                                            <FieldLabel htmlFor="password">Password</FieldLabel>
                                            <Input
                                                id="password"
                                                type="password"
                                                placeholder="••••••••"
                                                {...register("password")}
                                            />
                                            {errors.password && <p className="text-red-500 text-xs">{errors.password.message}</p>}
                                        </Field>
                                        <Field>
                                            <FieldLabel htmlFor="confirm-password">Confirm</FieldLabel>
                                            <Input
                                                id="confirm-password"
                                                type="password"
                                                placeholder="••••••••"
                                                {...register("confirmPassword")}
                                            />
                                            {errors.confirmPassword && <p className="text-red-500 text-xs">{errors.confirmPassword.message}</p>}
                                        </Field>
                                    </div>

                                    <Button type="submit" className="w-full bg-black text-white hover:bg-gray-800" disabled={isSubmitting}>
                                        {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                        Create Account
                                    </Button>

                                    <div className="relative my-4">
                                        <div className="absolute inset-0 flex items-center">
                                            <span className="w-full border-t" />
                                        </div>
                                        <div className="relative flex justify-center text-xs uppercase">
                                            <span className="bg-white px-2 text-muted-foreground">Or continue with</span>
                                        </div>
                                    </div>

                                    <OAuthButton />

                                    <p className="text-center text-sm text-muted-foreground">
                                        Already have an account?{' '}
                                        <a href="/login" className="font-semibold text-black hover:underline underline-offset-4">
                                            Sign in
                                        </a>
                                    </p>
                                </FieldGroup>
                            </form>
                        </CardContent>
                    </>
                ) : (
                    <>
                        <CardHeader className="text-center space-y-1">
                            <CardTitle className="text-2xl font-bold">Xác thực Email</CardTitle>
                            <CardDescription>
                                Chúng tôi đã gửi một mã OTP gồm 6 chữ số đến email <br/>
                                <span className="font-semibold text-black">{registeredEmail}</span>
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleVerifySubmit(handleVerifyOtp)}>
                                <FieldGroup className="space-y-4">
                                    <Field>
                                        <FieldLabel htmlFor="otp">Mã OTP</FieldLabel>
                                        <Input
                                            id="otp"
                                            type="text"
                                            placeholder="Nhập mã 6 chữ số..."
                                            maxLength={6}
                                            className="text-center text-lg tracking-widest"
                                            {...registerVerify("otp")}
                                        />
                                        {verifyErrors.otp && <p className="text-red-500 text-xs">{verifyErrors.otp.message}</p>}
                                    </Field>

                                    <Button type="submit" className="w-full bg-black text-white hover:bg-gray-800" disabled={isVerifying}>
                                        {isVerifying && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                        Xác nhận
                                    </Button>

                                    <p className="text-center text-sm text-muted-foreground mt-4">
                                        Chưa nhận được mã?{' '}
                                        <button 
                                            type="button" 
                                            onClick={() => setStep('register')} 
                                            className="font-semibold text-black hover:underline underline-offset-4"
                                        >
                                            Quay lại đăng ký
                                        </button>
                                    </p>
                                </FieldGroup>
                            </form>
                        </CardContent>
                    </>
                )}
            </Card>
        </div>
    );
}