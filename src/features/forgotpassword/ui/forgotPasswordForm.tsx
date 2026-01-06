import { cn } from "@/shared/lib/utils";
import { Button } from "@/shared/ui/button/button";
import { useState } from "react";
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
import { useNavigate } from "react-router-dom";
import { Input } from "@/shared/ui/input";
import { authApi } from "@/entities/auth/api/auth.api";

export function ForgotPasswordForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            setLoading(true);
            await authApi.forgotPassword(email);

            alert("OTP đã được gửi về email");
            navigate(`/reset-password?email=${encodeURIComponent(email)}`);
        } catch{
            alert("Không thể gửi OTP");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={cn("flex flex-col gap-6", className)} {...props}>
        <Card>
            <CardHeader>
            <CardTitle>Forgot password</CardTitle>
            <CardDescription>
                Enter your email to receive reset password link
            </CardDescription>
            </CardHeader>
            <CardContent>
            <form onSubmit={handleSubmit}>
                <FieldGroup>
                <Field>
                    <FieldLabel>Email</FieldLabel>
                    <Input
                    type="email"
                    placeholder="m@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    />
                </Field>

                <Field>
                    <Button type="submit" disabled={loading}>
                    {loading ? "Sending..." : "Send reset email"}
                    </Button>
                </Field>
                </FieldGroup>
            </form>
            </CardContent>
        </Card>
        </div>
    );
}
