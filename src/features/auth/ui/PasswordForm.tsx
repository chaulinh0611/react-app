import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Loader2 } from 'lucide-react';
import { useUpdateProfile } from '@/entities/auth/model/useAuthQueries';
import { Button } from '@/shared/ui/button/button';
import { Input } from '@/shared/ui/input';
import { Label } from '@/shared/ui/label';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogTrigger,
} from '@/shared/ui/dialog';
import { useAnimatedToast } from '@/shared/ui/animated-toast';

const PasswordRegex = /(?=^.{8,}$)((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/;

const PasswordSchema = z
    .object({
        password: z
            .string()
            .min(1, 'Password is required')
            .superRefine((val, ctx) => {
                if (val && !PasswordRegex.test(val)) {
                    ctx.addIssue({
                        code: z.ZodIssueCode.custom,
                        message:
                            'Password must contain uppercase, lowercase, and number/special char',
                    });
                }
                if (val && val.length < 8) {
                    ctx.addIssue({
                        code: z.ZodIssueCode.custom,
                        message: 'Password must be at least 8 characters long',
                    });
                }
            }),
        confirmPassword: z.string().min(1, 'Confirm Password is required'),
    })
    .refine((data) => data.password === data.confirmPassword, {
        message: 'Passwords do not match',
        path: ['confirmPassword'],
    });

type PasswordFormValues = z.infer<typeof PasswordSchema>;

interface PasswordFormProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export function PasswordForm({ open, onOpenChange }: PasswordFormProps) {
    const { mutateAsync: updateProfile, isPending } = useUpdateProfile();
    const { addToast } = useAnimatedToast();

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<PasswordFormValues>({
        resolver: zodResolver(PasswordSchema),
        defaultValues: { password: '', confirmPassword: '' },
    });

    const onSubmit = async (data: PasswordFormValues) => {
        try {
            await updateProfile({ password: data.password } as any);
            addToast({ message: 'Password changed successfully!', type: 'success' });
            reset();
            onOpenChange(false);
        } catch (error: any) {
            const backendError = error.response?.data?.message || 'Password change failed. Please try again.';
            reset();
            onOpenChange(false);
            addToast({ message: backendError, type: 'error' });

        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogTrigger asChild>
                <Button variant="outline" className="w-fit">
                    Change Password
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Change Password</DialogTitle>
                    <DialogDescription>
                        Ensure your account is using a long, random password to stay secure.
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={(e) => { e.stopPropagation(); handleSubmit(onSubmit)(e); }} className="space-y-4 pt-4">
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <Label>New Password</Label>
                            <Input
                                type="password"
                                {...register('password')}
                                placeholder="At least 8 characters"
                            />
                            {errors.password && (
                                <p className="text-red-500 text-xs">{errors.password.message}</p>
                            )}
                        </div>
                        <div className="space-y-2">
                            <Label>Confirm New Password</Label>
                            <Input
                                type="password"
                                {...register('confirmPassword')}
                                placeholder="Confirm new password"
                            />
                            {errors.confirmPassword && (
                                <p className="text-red-500 text-xs">
                                    {errors.confirmPassword.message}
                                </p>
                            )}
                        </div>
                    </div>

                    <div className="flex justify-end pt-2">
                        <Button
                            type="submit"
                            disabled={isPending}
                            className="bg-black text-white px-8 w-full sm:w-auto"
                        >
                            {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Change Password
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}

