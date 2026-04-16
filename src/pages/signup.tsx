  import { useState } from "react";
  import { Link } from "wouter";
  import { useForm } from "react-hook-form";
  import { zodResolver } from "@hookform/resolvers/zod";
  import { z } from "zod";
  import { Eye, EyeOff, Loader2, CheckCircle2, Sparkles } from "lucide-react";

  import { useAuth } from "@/hooks/useAuth";
  import { Button } from "@/components/ui/button";
  import { Input } from "@/components/ui/input";
  import { Label } from "@/components/ui/label";
  import { PasswordStrengthIndicator } from "@/components/passwordstrengthindicator";
  import { cn } from "@/lib/utils";

  // ---------------- Schema ----------------
  const signupSchema = z
    .object({
      fullName: z.string().min(2, "Full name must be at least 2 characters"),
      email: z.string().email("Please enter a valid email address"),
      password: z
        .string()
        .min(8, "Password must be at least 8 characters")
        .regex(/[a-z]/, "Must include a lowercase letter")
        .regex(/[A-Z]/, "Must include an uppercase letter")
        .regex(/[0-9]/, "Must include a number"),
      confirmPassword: z.string(),
    })
    .refine((data) => data.password === data.confirmPassword, {
      message: "Passwords don't match",
      path: ["confirmPassword"],
    });

  type SignupFormData = z.infer<typeof signupSchema>;

  // ---------------- Component ----------------
  export default function Signup() {
    const { signUp, isSignUpPending } = useAuth();

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [success, setSuccess] = useState(false);

    const {
      register,
      handleSubmit,
      formState: { errors },
      watch,
    } = useForm<SignupFormData>({
      resolver: zodResolver(signupSchema),
      defaultValues: {
        fullName: "",
        email: "",
        password: "",
        confirmPassword: "",
      },
    });

    const password = watch("password");

    const onSubmit = (data: SignupFormData) => {
      signUp(
        {
          name: data.fullName,
          email: data.email,
          password: data.password,
        },
        {
          onSuccess: () => setSuccess(true),
        },
      );
    };

    // ---------------- Success Screen ----------------
    if (success) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-background">
          <div className="text-center animate-scale-in max-w-md">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-green-100 mx-auto mb-6">
              <CheckCircle2 className="h-10 w-10 text-green-600" />
            </div>

            <h2 className="text-2xl font-bold mb-2">You're all set 🚀</h2>

            <p className="text-muted-foreground">
              Start optimizing your resume and preparing for interviews.
            </p>
          </div>
        </div>
      );
    }

    // ---------------- Main UI ----------------
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
              Tailor your resume, manage your applications, and prepare smarter for
              interviews — all in one place.
            </p>

            <div className="text-sm text-muted-foreground">
              <p>✔ AI-powered resume improvements</p>
              <p>✔ Smart keyword optimization suggestions</p>
              <p>✔ Personalized interview preparation</p>
            </div>
          </div>
        </div>

        {/* Right Form */}
        <div className="flex-1 flex items-center justify-center p-8">
          <div className="w-full max-w-md space-y-8">
            {/* Heading */}
            <div className="text-center">
              <h2 className="text-3xl font-bold">Create your account</h2>
              <p className="text-muted-foreground">
                {/* Start optimizing your job applications with RefineAI */}
                Make every application stronger
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              {/* Full Name */}
              <div>
                <Label>Full Name</Label>
                <Input placeholder="John Doe" {...register("fullName")} />
                {errors.fullName && (
                  <p className="text-sm text-destructive">
                    {errors.fullName.message}
                  </p>
                )}
              </div>

              {/* Email */}
              <div>
                <Label>Email</Label>
                <Input placeholder="john@example.com" {...register("email")} />
                {errors.email && (
                  <p className="text-sm text-destructive">
                    {errors.email.message}
                  </p>
                )}
              </div>

              {/* Password */}
              <div>
                <Label>Password</Label>
                <div className="relative">
                  <Input
                    type={showPassword ? "text" : "password"}
                    placeholder="Create a strong password"
                    {...register("password")}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2"
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>

                <PasswordStrengthIndicator password={password} />

                {errors.password && (
                  <p className="text-sm text-destructive">
                    {errors.password.message}
                  </p>
                )}
              </div>

              {/* Confirm Password */}
              <div>
                <Label>Confirm Password</Label>
                <div className="relative">
                  <Input
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Re-enter password"
                    {...register("confirmPassword")}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword((v) => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2"
                  >
                    {showConfirmPassword ? (
                      <EyeOff size={16} />
                    ) : (
                      <Eye size={16} />
                    )}
                  </button>
                </div>

                {errors.confirmPassword && (
                  <p className="text-sm text-destructive">
                    {errors.confirmPassword.message}
                  </p>
                )}
              </div>

              {/* CTA */}
              <Button
                type="submit"
                className="w-full hover:opacity-90"
                disabled={isSignUpPending}
              >
                {isSignUpPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating your workspace…
                  </>
                ) : (
                  "Get Started with RefineAI"
                )}
              </Button>
            </form>

            {/* Footer */}
            <p className="text-center text-muted-foreground">
              Already have an account?{" "}
              <Link to="/login" className="text-primary font-medium">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    );
  }
