import { useState } from "react";
import { Link } from "wouter";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Eye, EyeOff, Loader2, Sparkles } from "lucide-react";

import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
  remember: z.boolean().optional(),
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function Login() {
  const { signIn, isSignInPending } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [shake, setShake] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
      remember: false,
    },
  });

  const remember = watch("remember");

  const onSubmit = (data: LoginFormData) => {
    signIn(
      { email: data.email, password: data.password },
      {
        onError: () => {
          setShake(true);
          setTimeout(() => setShake(false), 500);
        },
      },
    );
  };

  return (
    <div className="min-h-screen flex bg-background">
      {/* LEFT SIDE (Branding) */}
      <div className="hidden lg:flex flex-1 items-center justify-center p-12 border-r bg-muted/30">
        <div className="max-w-md space-y-6">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 flex items-center justify-center rounded-xl bg-primary/10">
              <Sparkles className="h-5 w-5 text-primary" />
            </div>
            <h1 className="text-2xl font-semibold">RefineAI</h1>
          </div>

          <h2 className="text-4xl font-bold leading-tight">
            Optimize every job application with AI
          </h2>

          <p className="text-muted-foreground text-lg">
            Tailor your resume, manage your applications, and prepare smarter
            for interviews — all in one place.
          </p>

          <div className="text-sm text-muted-foreground">
            <p>✔ AI-powered resume improvements</p>
            <p>✔ Smart keyword optimization suggestions</p>
            <p>✔ Personalized interview preparation</p>
          </div>
        </div>
      </div>

      {/* RIGHT SIDE (FORM) */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div
          className={cn("w-full max-w-md space-y-8", shake && "animate-shake")}
        >
          {/* Header */}
          <div className="space-y-2 text-center">
            <h2 className="text-3xl font-semibold">Welcome back</h2>
            <p className="text-muted-foreground">
              Sign in to your RefineAI workspace
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            {/* Email */}
            <div className="space-y-2">
              <Label>Email</Label>
              <Input placeholder="you@example.com" {...register("email")} />
              {errors.email && (
                <p className="text-sm text-destructive">
                  {errors.email.message}
                </p>
              )}
            </div>

            {/* Password */}
            <div className="space-y-2">
              <Label>Password</Label>
              <div className="relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  {...register("password")}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {errors.password && (
                <p className="text-sm text-destructive">
                  {errors.password.message}
                </p>
              )}
            </div>

            {/* Remember */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Checkbox
                  checked={remember}
                  onCheckedChange={(v) => setValue("remember", v === true)}
                />
                <Label className="text-sm font-normal">Remember me</Label>
              </div>

              <Link
                to="/forgot-password"
                className="text-sm text-primary hover:underline"
              >
                Forgot password?
              </Link>
            </div>

            {/* Button */}
            <Button type="submit" className="w-full" disabled={isSignInPending}>
              {isSignInPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Signing in...
                </>
              ) : (
                "Sign in"
              )}
            </Button>
          </form>

          {/* Footer */}
          <p className="text-center text-sm text-muted-foreground">
            Don&apos;t have an account?{" "}
            <Link
              to="/signup"
              className="text-primary font-medium hover:underline"
            >
              Create one
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
