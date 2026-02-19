import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { VerifyEmailSchema, type VerifyEmailSchemaType } from "../model/schema";
import { authApi } from "@/entities/auth/api/auth.api";
import { Button } from "@/shared/ui/button/button";
import { Input } from "@/shared/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui/card";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Loader2 } from "lucide-react";

export function VerifyEmailForm() {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const emailFromQuery = searchParams.get("email") || "";

    const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<VerifyEmailSchemaType>({
        resolver: zodResolver(VerifyEmailSchema),
        defaultValues: { email: emailFromQuery, otp: "" }
    });

    const onSubmit = async (data: VerifyEmailSchemaType) => {
        try {
            await authApi.verifyEmail(data);
            alert("Xác thực thành công! Giờ bạn có thể đăng nhập.");
            navigate("/login");
        } catch (error: any) {
            alert(error.response?.data?.message || "Mã OTP không đúng");
        }
    };

    return (
        <Card className="w-full max-w-md">
            <CardHeader><CardTitle className="text-center">Xác thực Email</CardTitle></CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Email</label>
                        <Input {...register("email")} placeholder="Nhập email" />
                        {errors.email && <p className="text-red-500 text-xs">{errors.email.message}</p>}
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Mã OTP</label>
                        <Input {...register("otp")} placeholder="Nhập mã 554506" maxLength={6} />
                        {errors.otp && <p className="text-red-500 text-xs">{errors.otp.message}</p>}
                    </div>
                    <Button type="submit" className="w-full bg-black text-white" disabled={isSubmitting}>
                        {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />} Xác nhận
                    </Button>
                </form>
            </CardContent>
        </Card>
    );
}