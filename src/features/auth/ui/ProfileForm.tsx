import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2, MapPin, CheckCircle2, Pencil } from "lucide-react";

import { useUserStore } from "@/entities/users/model/user.store";
import { Button } from "@/shared/ui/button/button";
import { Input } from "@/shared/ui/input";
import { Label } from "@/shared/ui/label";
import { Card, CardContent } from "@/shared/ui/card";

const ProfileSchema = z.object({
    fullName: z.string().min(2, "Name must be at least 2 characters"),
    jobTitle: z.string().optional(),
    bio: z.string().max(500).optional(),
    email: z.string().email().optional(),
});
type ProfileFormValues = z.infer<typeof ProfileSchema>;

export function ProfileForm() {
    const { user, fetchUser, updateUser, isLoading } = useUserStore();

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
            });
        }
    }, [user, reset]);

    const onSubmit = async (data: ProfileFormValues) => {
        try {
            await updateUser(data);
            alert("Profile updated successfully!");
        } catch (error) {
            console.error("Update failed", error);
        }
    };

    if (!user && isLoading) return <div className="flex justify-center p-10"><Loader2 className="animate-spin" /></div>;

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            {/* Header Card */}
            <Card className="border-none shadow-sm bg-white rounded-2xl">
                <CardContent className="p-6! flex flex-col sm:flex-row items-center gap-6">
                    <div className="relative">
                        <div className="w-24 h-24 rounded-full bg-[#EBC8A8] flex items-center justify-center border-4 border-white shadow-sm overflow-hidden">
                            <img src={user?.avatarUrl || "https://api.dicebear.com/7.x/avataaars/svg?seed=Felix"} alt="Avatar" className="w-full h-full object-cover" />
                        </div>
                        <button className="absolute bottom-0 right-0 bg-blue-500 p-1.5 rounded-full text-white hover:bg-blue-600 shadow-md">
                            <Pencil className="w-3 h-3" />
                        </button>
                    </div>
                    <div className="text-center sm:text-left space-y-1">
                        <h2 className="text-2xl font-bold">{user?.fullName || user?.username || "User"}</h2>
                        <p className="text-gray-500">{user?.jobTitle || "Product Designer"}</p>
                        <div className="flex items-center justify-center sm:justify-start gap-3 mt-2 text-sm">
                            <span className="flex items-center gap-1 px-2 py-0.5 bg-green-100 text-green-700 rounded-full font-medium">
                                <CheckCircle2 className="w-3 h-3" /> Active Now
                            </span>
                            <span className="flex items-center gap-1 text-gray-500">
                                <MapPin className="w-3 h-3" /> {user?.location || "Viet Nam"}
                            </span>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Form Card */}
            <Card className="shadow-sm rounded-2xl">
                <CardContent className="p-8!">
                    <div className="mb-6">
                        <h3 className="text-lg font-bold">Profile Information</h3>
                        <p className="text-sm text-gray-500">Update your personal details.</p>
                    </div>
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                        <div className=" md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <Label>Full Name</Label>
                                <Input {...register("fullName")} />
                                {errors.fullName && <p className="text-red-500 text-xs">{errors.fullName.message}</p>}
                            </div>

                        </div>
                        <div className="space-y-2">
                            <Label>Email Address</Label>
                            <Input {...register("email")} disabled className="bg-gray-100 cursor-not-allowed" />
                        </div>
                        <div className="space-y-2">
                            <Label>Bio</Label>
                            <textarea
                                {...register("bio")}
                                rows={4}
                                className="flex w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                            />
                        </div>
                        <div className="flex justify-end">
                            <Button type="submit" disabled={isSubmitting} className="bg-black text-white">
                                {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />} Save Changes
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}