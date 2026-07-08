import { Link, Outlet } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/store/authStore";
import { dashboardPathFor } from "@/components/ProtectedRoute";

export default function PublicLayout() {
  const { user } = useAuthStore();

  return (
    <div className="relative flex min-h-screen flex-col overflow-x-clip">
      <header className="sticky top-0 z-30 bg-background/65 backdrop-blur-md">
        <div className="mx-auto flex h-22 w-full max-w-[1220px] items-center justify-between px-4 sm:px-8">
          <Link to="/" className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-xl bg-primary text-sm font-bold text-primary-foreground">
              LS
            </div>
            <span className="font-heading text-[1.75rem] leading-none font-semibold tracking-[-0.03em] sm:text-[1.9rem]">
              Lecture Scheduler
            </span>
          </Link>
          {user ? (
            <Button className="h-10 px-4" render={<Link to={dashboardPathFor(user.role)} />}>
              Go to dashboard
            </Button>
          ) : (
            <Button className="h-10 px-5" render={<Link to="/login" />}>Sign in</Button>
          )}
        </div>
      </header>
      <div className="flex-1">
        <Outlet />
      </div>
      <footer className="border-t border-border/60 py-8">
        <div className="mx-auto w-full max-w-[1220px] px-4 text-xs tracking-[0.08em] text-muted-foreground sm:px-8">
          Lecture Scheduler — clash-free lecture scheduling for teaching teams.
        </div>
      </footer>
    </div>
  );
}
