import { cn } from "@/shared/lib/utils";
import { Button } from "@/shared/ui/button/button";
import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/shared/ui/card";
import {
  Field,
  FieldGroup,
  FieldLabel,
} from "@/shared/ui/field";
import { Input } from "@/shared/ui/input";
import { authApi } from "@/entities/auth/api/auth.api";

export function ResetPasswordForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const [token, setToken] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const email = searchParams.get("email");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email) {
      alert("Email không hợp lệ!");
      return;
    }

    if (token.length !== 6) {
      alert("OTP phải gồm 6 chữ số!");
      return;
    }

    if (password !== confirmPassword) {
      alert("Mật khẩu xác nhận không khớp!");
      return;
    }

    try {
      setLoading(true);
      await authApi.resetPassword({
        email,
        token,
        newPassword: password,
      });

      alert("Đặt lại mật khẩu thành công!");
      navigate("/login");
    } catch (err) {
      console.error(err);
      alert("OTP không đúng hoặc đã hết hạn!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader>
          <CardTitle>Reset password</CardTitle>
          <CardDescription>
            Enter OTP and your new password
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <FieldGroup>

              {/* OTP */}
              <Field>
                <FieldLabel>OTP (6 digits)</FieldLabel>
                <Input
                  type="text"
                  maxLength={6}
                  value={token}
                  onChange={(e) =>
                    setToken(e.target.value.replace(/\D/g, ""))
                  }
                  placeholder="Enter OTP"
                  required
                />
              </Field>

              {/* New password */}
              <Field>
                <FieldLabel>New password</FieldLabel>
                <Input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </Field>

              {/* Confirm password */}
              <Field>
                <FieldLabel>Confirm password</FieldLabel>
                <Input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
              </Field>

              <Field>
                <Button type="submit" disabled={loading}>
                  {loading ? "Resetting..." : "Reset password"}
                </Button>
              </Field>

            </FieldGroup>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
