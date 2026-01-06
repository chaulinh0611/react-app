import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link } from "react-router-dom"; // Sửa lại import Link nếu chưa đúng
import { cn } from "@/shared/lib/utils";
import { Button } from "@/shared/ui/button/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/shared/ui/card";
import { Input } from "@/shared/ui/input";
import { Label } from "@/shared/ui/label";
import { useLogin } from "../model/useLogin";
import { LoginSchema, type LoginFormValues } from "@/shared/lib/utils";

export function LoginForm({ className, ...props }: React.ComponentProps<"div">) {
  const { login, loginWithGoogle } = useLogin();
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(LoginSchema),
  });

  const onSubmit = async (data: LoginFormValues) => {
    setIsLoading(true);
    setError(null);
    try {
      await login(data.email, data.password);
    } catch (err: any) {
      setError(err?.response?.data?.message || "Đăng nhập thất bại");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader>
          <CardTitle>Đăng nhập</CardTitle>
          <CardDescription>Nhập email để truy cập hệ thống</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" placeholder="m@example.com" {...register("email")} />
              {errors.email && <span className="text-xs text-red-500">{errors.email.message}</span>}
            </div>

            <div className="grid gap-2">
              <div className="flex items-center">
                <Label htmlFor="password">Mật khẩu</Label>
                <a href="#" className="ml-auto text-sm underline-offset-4 hover:underline">Quên mật khẩu?</a>
              </div>
              <Input id="password" type="password" {...register("password")} />
              {errors.password && <span className="text-xs text-red-500">{errors.password.message}</span>}
            </div>

            {error && <div className="text-sm text-red-500 text-center">{error}</div>}

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Đang xử lý..." : "Đăng nhập"}
            </Button>

            <Button variant="outline" type="button" className="w-full" onClick={loginWithGoogle}>
              Đăng nhập bằng Google
            </Button>

            <div className="mt-4 text-center text-sm">
              Chưa có tài khoản? <Link to="/register" className="underline underline-offset-4">Đăng ký ngay</Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}