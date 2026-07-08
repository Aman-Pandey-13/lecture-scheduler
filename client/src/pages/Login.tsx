import { useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { motion } from "motion/react";
import { ChevronRight, Loader2, Shield, UserRound } from "lucide-react";
import { toast } from "sonner";
import { login as loginRequest } from "@/api/auth";
import { getApiErrorMessage } from "@/api/axios";
import { useAuthStore } from "@/store/authStore";
import { dashboardPathFor } from "@/components/ProtectedRoute";
import { loginSchema, type LoginValues } from "@/lib/validators";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const DEMO_INSTRUCTORS = [
  "aisha.kapoor@northwind.edu",
  "marcus.bell@northwind.edu",
  "rahul.verma@northwind.edu",
  "lena.ortiz@northwind.edu",
  "daniel.cho@northwind.edu",
  "priya.nair@northwind.edu",
];

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const { token, user, login } = useAuthStore();

  const from = (location.state as { from?: { pathname?: string } } | null)?.from
    ?.pathname;

  // Already signed in → skip the form.
  useEffect(() => {
    if (token && user) {
      navigate(dashboardPathFor(user.role), { replace: true });
    }
  }, [token, user, navigate]);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  const mutation = useMutation({
    mutationFn: (values: LoginValues) =>
      loginRequest(values.email, values.password),
    onSuccess: (data) => {
      login(data.token, data.user);
      toast.success(`Welcome back, ${data.user.name.split(" ")[0]}`);
      const target =
        from && from !== "/login" ? from : dashboardPathFor(data.user.role);
      navigate(target, { replace: true });
    },
    onError: (error) => {
      toast.error(getApiErrorMessage(error, "Unable to sign in"));
    },
  });

  const selectedEmail = watch("email");

  return (
    <div className="min-h-screen px-4 py-7 sm:px-8 sm:py-10">
      <div className="mx-auto w-full max-w-[930px]">
        <Link to="/" className="mb-10 inline-flex items-center gap-3">
          <div className="flex size-10 items-center justify-center rounded-xl bg-primary text-sm font-bold text-primary-foreground">
            LS
          </div>
          <span className="font-heading text-[1.85rem] leading-none font-semibold tracking-[-0.03em]">
            Lecture Scheduler
          </span>
        </Link>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, ease: "easeOut" }}
          className="mx-auto w-full max-w-[760px]"
        >
          <p className="text-xs font-medium tracking-[0.17em] text-primary uppercase">
            Choose a role
          </p>
          <h1 className="mt-3 font-heading text-5xl leading-[1.03] font-semibold tracking-[-0.03em] sm:text-6xl">
            Sign in to continue
          </h1>
          <p className="mt-4 text-lg text-muted-foreground">
            Pick how you want to enter the workspace, then provide the
            account password.
          </p>

          <div className="mt-8 space-y-4">
            <button
              type="button"
              onClick={() => setValue("email", "admin@gmail.com")}
              className="flex w-full items-center gap-4 rounded-2xl border border-border bg-[linear-gradient(180deg,rgb(18_26_18_/_68%),rgb(10_16_11_/_92%))] px-5 py-5 text-left transition-colors hover:bg-[#172016]"
            >
              <span className="flex size-14 items-center justify-center rounded-2xl bg-primary text-primary-foreground">
                <Shield className="size-6" />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block font-heading text-3xl font-semibold tracking-[-0.02em]">
                  Administrator
                </span>
                <span className="block text-base text-muted-foreground">
                  Manage instructors, build courses, and assign lecture batches.
                </span>
              </span>
              <ChevronRight className="size-5 text-muted-foreground" />
            </button>

            <p className="pt-3 text-xs tracking-[0.16em] text-muted-foreground uppercase">
              Or sign in as an instructor
            </p>

            <div className="space-y-2">
              {DEMO_INSTRUCTORS.map((email) => {
                const active = selectedEmail === email;
                return (
                  <button
                    key={email}
                    type="button"
                    onClick={() => setValue("email", email)}
                    className={`flex w-full items-center gap-4 rounded-2xl border px-4 py-3 text-left transition-colors ${
                      active
                        ? "border-primary/50 bg-[#182115]"
                        : "border-border bg-[rgb(14_20_14_/_80%)] hover:bg-[#162016]"
                    }`}
                  >
                    <span className="flex size-10 items-center justify-center rounded-full bg-[#1a231b] text-sm font-semibold text-[#9ca896]">
                      {email.slice(0, 2).toUpperCase()}
                    </span>
                    <span className="min-w-0 flex-1 truncate text-lg text-foreground">
                      {email}
                    </span>
                    {active && <ChevronRight className="size-4 text-primary" />}
                  </button>
                );
              })}
            </div>
          </div>

          <form
            onSubmit={handleSubmit((values) => mutation.mutate(values))}
            className="mt-7 rounded-2xl border border-border bg-[#0f160f]/85 p-5"
            noValidate
          >
            <div className="grid gap-4 sm:grid-cols-[1fr_1fr_auto] sm:items-end">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-xs tracking-[0.14em] uppercase">
                  Email
                </Label>
                <div className="relative">
                  <UserRound className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    autoComplete="email"
                    placeholder="admin@gmail.com"
                    aria-invalid={Boolean(errors.email)}
                    className="pl-10"
                    {...register("email")}
                  />
                </div>
                {errors.email && (
                  <p className="text-xs text-destructive">
                    {errors.email.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-xs tracking-[0.14em] uppercase">
                  Password
                </Label>
                <Input
                  id="password"
                  type="password"
                  autoComplete="current-password"
                  placeholder="••••••••"
                  aria-invalid={Boolean(errors.password)}
                  {...register("password")}
                />
                {errors.password && (
                  <p className="text-xs text-destructive">
                    {errors.password.message}
                  </p>
                )}
              </div>

              <Button
                type="submit"
                size="lg"
                className="w-full sm:w-auto"
                disabled={mutation.isPending}
              >
                {mutation.isPending && (
                  <Loader2 className="size-4 animate-spin" />
                )}
                {mutation.isPending ? "Signing in…" : "Sign in"}
              </Button>
            </div>

            <p className="mt-4 text-xs text-muted-foreground">
              Select a role above to auto-fill email, then enter the account
              password.
            </p>
          </form>

          <p className="mt-5 text-center text-xs text-muted-foreground">
            Trouble signing in? Contact your administrator.
          </p>
        </motion.div>
      </div>
    </div>
  );
}
