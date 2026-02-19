import { useEffect, useState, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2, MapPin, CheckCircle2, Pencil } from "lucide-react";

import { useUserStore } from "@/entities/users/model/user.store";
import { Button } from "@/shared/ui/button/button";
import { Input } from "@/shared/ui/input";
import { Label } from "@/shared/ui/label";
import { Card, CardContent } from "@/shared/ui/card";

const PasswordRegex = /(?=^.{8,}$)((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/;

const ProfileSchema = z.object({
    fullName: z.string().min(2, "Name must be at least 2 characters"),
    jobTitle: z.string().optional().or(z.literal('')),
    bio: z.string().max(500).optional().or(z.literal('')),
    email: z.string().email().optional().or(z.literal('')), 
    
    password: z.string()
        .optional()
        .or(z.literal(''))
        .superRefine((val, ctx) => {
            if (val && !PasswordRegex.test(val)) {
                ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    message: "Password must contain uppercase, lowercase, and number/special char",
                });
            }
            if (val && val.length < 8) {
                ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    message: "Password must be at least 8 characters long",
                });
            }
        }),
    confirmPassword: z.string().optional().or(z.literal('')),
}).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
});

type ProfileFormValues = z.infer<typeof ProfileSchema>;

export function ProfileForm() {
    const { user, fetchUser, updateUser, uploadAvatar, isLoading } = useUserStore();
    const [isUploading, setIsUploading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors, isSubmitting },
    } = useForm<ProfileFormValues>({
        resolver: zodResolver(ProfileSchema),
    });

    useEffect(() => {
        fetchUser();
    }, [fetchUser]);

    useEffect(() => {
        if (user) {
            reset({
                fullName: user.fullName || user.username || "",
                jobTitle: user.jobTitle || "",
                email: user.email || "",
                bio: user.bio || "",
                password: "",
                confirmPassword: "",
            });
        }
    }, [user, reset]);

    const handleUploadAvatar = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
    
        setIsUploading(true);
        try {
            await uploadAvatar(file); 
            alert("Avatar updated successfully!");
        } catch (error: any) {
            console.error("Upload failed", error);
            alert(error.message || "Server error occurred during upload.");
        } finally {
            setIsUploading(false);
        }
    };

    const onSubmit = async (data: ProfileFormValues) => {
        try {
            const { confirmPassword, ...payload } = data;
            
            const finalPayload: any = {
                fullName: payload.fullName
            };

            if (payload.jobTitle && payload.jobTitle.trim() !== "") finalPayload.jobTitle = payload.jobTitle;
            if (payload.bio && payload.bio.trim() !== "") finalPayload.bio = payload.bio;
            if (payload.password && payload.password.trim() !== "") finalPayload.password = payload.password;

            await updateUser(finalPayload);
            alert("Profile updated successfully!");
        } catch (error: any) {
            const backendError = error.response?.data?.message || error.message;
            console.error("Lỗi từ Backend:", error.response?.data || error);
            alert("Cập nhật thất bại. Lý do: " + backendError);
        }
    };

    if (!user && isLoading) return <div className="flex justify-center p-10"><Loader2 className="animate-spin" /></div>;

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            <Card className="border-none shadow-sm bg-white rounded-2xl">
                <CardContent className="p-6 flex flex-col sm:flex-row items-center gap-6">
                    <div className="relative">
                        <div className="w-24 h-24 rounded-full bg-[#EBC8A8] flex items-center justify-center border-4 border-white shadow-sm overflow-hidden">
                            {isUploading || (isLoading && !user) ? (
                                <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
                            ) : (
                                <img src={user?.avatarUrl || "https://api.dicebear.com/7.x/avataaars/svg?seed=Felix"} alt="Avatar" className="w-full h-full object-cover" />
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
                            disabled={isUploading}
                            onClick={() => fileInputRef.current?.click()}
                            className="absolute bottom-0 right-0 bg-blue-500 p-1.5 rounded-full text-white hover:bg-blue-600 shadow-md transition-colors disabled:bg-gray-400"
                        >
                            <Pencil className="w-3 h-3" />
                        </button>
                    </div>
                    <div className="text-center sm:text-left space-y-1">
                        <h2 className="text-2xl font-bold">{user?.fullName || user?.username || "User"}</h2>
                        <p className="text-gray-500">{user?.jobTitle || "Member"}</p>
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
                        <p className="text-sm text-gray-500">Update your personal details and security settings.</p>
                    </div>
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                        <div className="grid md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <Label>Full Name</Label>
                                <Input {...register("fullName")} placeholder="Your full name" />
                                {errors.fullName && <p className="text-red-500 text-xs">{errors.fullName.message}</p>}
                            </div>
                            <div className="space-y-2">
                                <Label>Email Address</Label>
                                <Input {...register("email")} disabled className="bg-gray-100 cursor-not-allowed" />
                                {/* Đã thêm dòng báo lỗi để dễ debug nếu bị kẹt */}
                                {errors.email && <p className="text-red-500 text-xs">{errors.email.message}</p>}
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label>Bio</Label>
                            <textarea
                                {...register("bio")}
                                rows={3}
                                className="flex w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                                placeholder="Tell us something about yourself..."
                            />
                        </div>

                        <div className="pt-4 border-t">
                            <h4 className="text-sm font-semibold mb-4 text-gray-700">Change Password</h4>
                            <div className="grid md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <Label>New Password</Label>
                                    <Input type="password" {...register("password")} placeholder="At least 8 characters" />
                                    {errors.password && <p className="text-red-500 text-xs">{errors.password.message}</p>}
                                </div>
                                <div className="space-y-2">
                                    <Label>Confirm New Password</Label>
                                    <Input type="password" {...register("confirmPassword")} placeholder="Confirm new password" />
                                    {errors.confirmPassword && <p className="text-red-500 text-xs">{errors.confirmPassword.message}</p>}
                                </div>
                            </div>
                        </div>

                        <div className="flex justify-end pt-4">
                            <Button type="submit" disabled={isSubmitting || isUploading} className="bg-black text-white px-8">
                                {(isSubmitting) && <Loader2 className="mr-2 h-4 w-4 animate-spin" />} 
                                Save Changes
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}