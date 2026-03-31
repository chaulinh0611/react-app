import { useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Loader2, MapPin, CheckCircle2, Pencil } from 'lucide-react';

import { useGetProfile, useUpdateProfile, useUploadAvatar } from '@/entities/auth/model/useAuthQueries';
import { Button } from '@/shared/ui/button/button';
import { Input } from '@/shared/ui/input';
import { Label } from '@/shared/ui/label';
import { Card, CardContent } from '@/shared/ui/card';
import { PasswordForm } from './PasswordForm';
import { useAnimatedToast } from '@/shared/ui/animated-toast';

const ProfileSchema = z.object({
    fullName: z
        .string()
        .min(2, 'Full name must be at least 2 characters')
        .max(50, 'Full name must not exceed 50 characters'),
    jobTitle: z.string().max(100, 'Job title must not exceed 100 characters').optional().or(z.literal('')),
    bio: z.string().max(500, 'Bio must not exceed 500 characters').optional().or(z.literal('')),
    email: z.string().email().optional().or(z.literal('')),
});

type ProfileFormValues = z.infer<typeof ProfileSchema>;

export function ProfileForm() {
    const { data: profileData, isLoading } = useGetProfile();
    const user = profileData?.data;
    const { mutateAsync: updateUser, isPending: isUpdatePending } = useUpdateProfile();
    const { mutateAsync: uploadAvatarFn, isPending: isUploadPending } = useUploadAvatar();
    const fileInputRef = useRef<HTMLInputElement>(null);
    const { addToast } = useAnimatedToast();
    const [passwordDialogOpen, setPasswordDialogOpen] = useState(false);

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<ProfileFormValues>({
        resolver: zodResolver(ProfileSchema),
    });

    useEffect(() => {
        if (user) {
            reset({
                fullName: user.fullName || user.username || '',
                jobTitle: user.jobTitle || '',
                email: user.email || '',
                bio: user.bio || '',
            });
        }
    }, [user, reset]);

    const handleUploadAvatar = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        try {
            const formData = new FormData();
            formData.append('avatar', file);
            await uploadAvatarFn(formData);
            addToast({ message: 'Avatar updated successfully!', type: 'success' });
        } catch (error: any) {
            console.error('Upload failed', error);
            const msg = error?.response?.data?.message || 'Avatar upload failed. Please use a smaller image and try again.';
            addToast({ message: msg, type: 'error' });
        }
    };

    const onSubmit = async (data: ProfileFormValues) => {
        try {
            const payload: any = {
                fullName: data.fullName,
                bio: data.bio || '',
            };

            await updateUser(payload);
            addToast({ message: 'Profile updated successfully!', type: 'success' });
        } catch (error: any) {
            console.error('Lỗi từ Backend:', error.response?.data || error);
            const msg = error?.response?.data?.message || 'Failed to update profile. Please try again.';
            addToast({ message: msg, type: 'error' });
        }
    };

    if (!user && isLoading)
        return (
            <div className="flex justify-center p-10">
                <Loader2 className="animate-spin" />
            </div>
        );

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            <Card className="border-none shadow-sm bg-white rounded-2xl">
                <CardContent className="p-6 flex flex-col sm:flex-row items-center gap-6">
                    <div className="relative">
                        <div className="w-24 h-24 rounded-full bg-[#EBC8A8] flex items-center justify-center border-4 border-white shadow-sm overflow-hidden">
                            {isUploadPending || (isLoading && !user) ? (
                                <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
                            ) : (
                                <img
                                    src={
                                        user?.avatarUrl ||
                                        'https://api.dicebear.com/7.x/avataaars/svg?seed=Felix'
                                    }
                                    alt="Avatar"
                                    className="w-full h-full object-cover"
                                />
                            )}
                        </div>
                        <input
                            type="file"
                            className="hidden"
                            ref={fileInputRef}
                            onChange={handleUploadAvatar}
                            accept="image/*"
                        />
                        <button
                            type="button"
                            disabled={isUploadPending}
                            onClick={() => fileInputRef.current?.click()}
                            className="absolute bottom-0 right-0 bg-blue-500 p-1.5 rounded-full text-white hover:bg-blue-600 shadow-md transition-colors disabled:bg-gray-400"
                        >
                            <Pencil className="w-3 h-3" />
                        </button>
                    </div>
                    <div className="text-center sm:text-left space-y-1">
                        <h2 className="text-2xl font-bold">
                            {user?.fullName || user?.username || 'User'}
                        </h2>
                        <p className="text-gray-500">{user?.jobTitle || 'Member'}</p>
                        <div className="flex items-center justify-center sm:justify-start gap-3 mt-2 text-sm">
                            <span className="flex items-center gap-1 px-2 py-0.5 bg-green-100 text-green-700 rounded-full font-medium">
                                <CheckCircle2 className="w-3 h-3" /> Active Now
                            </span>
                            <span className="flex items-center gap-1 text-gray-500">
                                <MapPin className="w-3 h-3" /> Viet Nam
                            </span>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <Card className="shadow-sm rounded-2xl">
                <CardContent className="p-8">
                    <div className="mb-6 border-b pb-4">
                        <h3 className="text-lg font-bold">Profile Information</h3>
                        <p className="text-sm text-gray-500">
                            Update your personal details and security settings.
                        </p>
                    </div>
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                        <div className="grid md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <Label>Full Name</Label>
                                <Input
                                    {...register('fullName')}
                                    placeholder="Your full name"
                                    maxLength={50}
                                />
                                {errors.fullName && (
                                    <p className="text-red-500 text-xs">
                                        {errors.fullName.message}
                                    </p>
                                )}
                            </div>
                            <div className="space-y-2">
                                <Label>Email Address</Label>
                                <Input
                                    {...register('email')}
                                    disabled
                                    className="bg-gray-100 cursor-not-allowed"
                                />
                                {/* Đã thêm dòng báo lỗi để dễ debug nếu bị kẹt */}
                                {errors.email && (
                                    <p className="text-red-500 text-xs">{errors.email.message}</p>
                                )}
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label>
                                Bio
                                <span className="text-xs text-gray-400 ml-2">(max 500 characters)</span>
                            </Label>
                            <textarea
                                {...register('bio')}
                                rows={3}
                                maxLength={500}
                                className="flex w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                                placeholder="Tell us something about yourself..."
                            />
                            {errors.bio && (
                                <p className="text-red-500 text-xs">{errors.bio.message}</p>
                            )}
                        </div>

                        <div className="flex justify-between pt-4 items-center">
                            <PasswordForm open={passwordDialogOpen} onOpenChange={setPasswordDialogOpen} />
                            <Button
                                type="submit"
                            disabled={isUpdatePending || isUploadPending || passwordDialogOpen}
                                className="bg-black text-white px-8"
                            >
                                {isUpdatePending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                Save Changes
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
