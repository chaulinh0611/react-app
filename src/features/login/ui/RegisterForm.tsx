import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link } from "react-router-dom";
import { Loader2 } from "lucide-react";

import { cn } from "@/shared/lib/utils";
import { Button } from "@/shared/ui/button/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/shared/ui/card";
import { Input } from "@/shared/ui/input";
import { Label } from "@/shared/ui/label";
import { useRegister } from "../model/useRegister"; 
import { RegisterSchema, type RegisterFormValues } from "@/shared/lib/utils";

export function RegisterForm({ className, ...props }: React.ComponentProps<"div">) {
  const { register: registerAction } = useRegister();
  
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(RegisterSchema),
  });

  const onSubmit = async (data: RegisterFormValues) => {
    setIsLoading(true);
    setError(null);
    try {
      await registerAction({
        email: data.email,
        password: data.password,
        username: data.username,
      });
    } catch (err: any) {
      setError(err?.response?.data?.message || "Đăng ký thất bại");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader>
          <CardTitle>Đăng ký tài khoản</CardTitle>
          <CardDescription>Tạo tài khoản mới để quản lý công việc</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="flex flex-col gap-4">
              {/* Username */}
              <div className="grid gap-2">
                <Label htmlFor="username">Tên đăng nhập</Label>
                <Input id="username" placeholder="User123" {...register("username")} />
                {errors.username && <span className="text-xs text-red-500">{errors.username.message}</span>}
              </div>

              {/* Email */}
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" placeholder="m@example.com" {...register("email")} />
                {errors.email && <span className="text-xs text-red-500">{errors.email.message}</span>}
              </div>

              {/* Password */}
              <div className="grid gap-2">
                <Label htmlFor="password">Mật khẩu</Label>
                <Input id="password" type="password" {...register("password")} />
                {errors.password && <span className="text-xs text-red-500">{errors.password.message}</span>}
              </div>

              {/* Confirm Password */}
              <div className="grid gap-2">
                <Label htmlFor="confirmPassword">Nhập lại mật khẩu</Label>
                <Input id="confirmPassword" type="password" {...register("confirmPassword")} />
                {errors.confirmPassword && <span className="text-xs text-red-500">{errors.confirmPassword.message}</span>}
              </div>

              {/* Error Alert */}
              {error && <div className="text-sm text-red-500 text-center">{error}</div>}

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Đăng ký
              </Button>
            </div>
            <div className="mt-4 text-center text-sm">
              Đã có tài khoản?{" "}
              <Link to="/login" className="underline underline-offset-4">Đăng nhập</Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}