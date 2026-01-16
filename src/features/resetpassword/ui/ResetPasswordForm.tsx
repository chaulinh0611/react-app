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
  const [otp, setOTP] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const email = searchParams.get("email");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!email) {
      setError("Email không hợp lệ!");
      return;
    }

    if (otp.length !== 6) {
      setError("OTP phải gồm 6 chữ số!");
      return;
    }

    if (password !== confirmPassword) {
      setError("Mật khẩu xác nhận không khớp!");
      return;
    }

    try {
      setLoading(true);
      await authApi.resetPassword({
        email,
        otp,
        newPassword: password,
      });

      navigate("/login");
    } catch (err: any) {
      console.error(err);

      const message =
        err?.response?.data?.message ||
        "OTP không đúng hoặc đã hết hạn!";

      setError(message);
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
                  value={otp}
                  onChange={(e) => {
                    setOTP(e.target.value.replace(/\D/g, ""));
                    setError(null);
                  }}
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
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setError(null);
                  }}
                  required
                />
              </Field>

              {/* Confirm password */}
              <Field>
                <FieldLabel>Confirm password</FieldLabel>
                <Input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => {
                    setConfirmPassword(e.target.value);
                    setError(null);
                  }}
                  required
                />
              </Field>

              {/* Error message */}
              {error && (
                <div className="text-sm text-red-500">
                  {error}
                </div>
              )}

              {/* Buttons */}
              <Field className="flex flex-col gap-2">
                <Button type="submit" disabled={loading}>
                  {loading ? "Resetting..." : "Reset password"}
                </Button>

                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate("/forgot-password")}
                >
                  Back to forgot password
                </Button>
              </Field>

            </FieldGroup>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
