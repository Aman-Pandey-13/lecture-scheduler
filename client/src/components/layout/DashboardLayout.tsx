import { useState } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import {
  BookOpen,
  CalendarDays,
  LayoutDashboard,
  LogOut,
  Menu,
  Users,
  X,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { useAuthStore } from "@/store/authStore";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";

interface NavItem {
  to: string;
  label: string;
  icon: LucideIcon;
  end?: boolean;
}

const ADMIN_NAV: NavItem[] = [
  { to: "/admin", label: "Overview", icon: LayoutDashboard, end: true },
  { to: "/admin/instructors", label: "Instructors", icon: Users },
  { to: "/admin/courses", label: "Courses", icon: BookOpen },
];

const INSTRUCTOR_NAV: NavItem[] = [
  { to: "/instructor", label: "My Lectures", icon: CalendarDays, end: true },
];

function initials(name: string): string {
  return name
    .split(" ")
    .map((part) => part[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

function SidebarContent({
  nav,
  onNavigate,
}: {
  nav: NavItem[];
  onNavigate?: () => void;
}) {
  return (
    <div className="flex h-full flex-col bg-sidebar/95">
      <div className="flex h-20 items-center gap-3 px-6">
        <div className="flex size-10 items-center justify-center rounded-xl bg-primary text-sm font-bold text-primary-foreground">
          LS
        </div>
        <span className="font-heading text-[1.22rem] leading-none font-semibold tracking-[-0.03em]">
          Lecture Scheduler
        </span>
      </div>
      <nav className="flex-1 space-y-1 px-3 py-5">
        {nav.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            onClick={onNavigate}
            className={({ isActive }) =>
              cn(
                "flex items-center gap-3 rounded-2xl px-4 py-3 text-[1rem] font-semibold tracking-[-0.01em] transition-colors",
                isActive
                  ? "bg-[linear-gradient(90deg,rgb(184_244_51_/_24%),rgb(184_244_51_/_12%))] text-sidebar-accent-foreground"
                  : "text-sidebar-foreground/76 hover:bg-sidebar-accent/60 hover:text-sidebar-foreground",
              )
            }
          >
            <item.icon className="size-4" />
            {item.label}
          </NavLink>
        ))}
      </nav>
      <div className="flex items-center gap-2 px-6 py-5 text-sm tracking-[0.06em] text-muted-foreground">
        <span className="size-2 rounded-full bg-primary" />
        Clash-free scheduling
      </div>
    </div>
  );
}

export default function DashboardLayout() {
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();
  const [mobileOpen, setMobileOpen] = useState(false);

  const nav = user?.role === "Admin" ? ADMIN_NAV : INSTRUCTOR_NAV;

  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true });
  };

  return (
    <div className="min-h-screen bg-transparent">
      {/* Desktop sidebar */}
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-72 border-r border-sidebar-border bg-sidebar md:block">
        <SidebarContent nav={nav} />
      </aside>

      {/* Mobile sidebar */}
      {mobileOpen && (
        <div className="md:hidden">
          <div
            className="fixed inset-0 z-40 bg-black/40"
            onClick={() => setMobileOpen(false)}
          />
          <aside className="fixed inset-y-0 left-0 z-50 w-72 border-r border-sidebar-border bg-sidebar">
            <Button
              variant="ghost"
              size="icon-sm"
              className="absolute right-3 top-4"
              onClick={() => setMobileOpen(false)}
            >
              <X className="size-4" />
            </Button>
            <SidebarContent nav={nav} onNavigate={() => setMobileOpen(false)} />
          </aside>
        </div>
      )}

      <div className="md:pl-72">
        {/* Topbar */}
        <header className="sticky top-0 z-20 flex h-20 items-center justify-between border-b border-border/70 bg-background/76 px-4 backdrop-blur-md sm:px-8">
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon-sm"
              className="md:hidden"
              onClick={() => setMobileOpen(true)}
            >
              <Menu className="size-5" />
            </Button>
            <span className="text-[1.05rem] leading-none font-medium tracking-[0.08em] text-muted-foreground">
              {user?.role} workspace
            </span>
          </div>

          <div className="flex items-center gap-3">
            <Button variant="outline" size="sm" onClick={handleLogout}>
              Switch role
            </Button>

            <DropdownMenu>
              <DropdownMenuTrigger
                render={
                  <button className="flex items-center gap-2 rounded-full outline-none focus-visible:ring-2 focus-visible:ring-ring">
                    <Avatar size="sm">
                      <AvatarFallback>
                        {user ? initials(user.name) : "?"}
                      </AvatarFallback>
                    </Avatar>
                    <span className="hidden text-[1rem] leading-none font-semibold tracking-[-0.02em] sm:inline">
                      {user?.name}
                    </span>
                  </button>
                }
              />
            <DropdownMenuContent align="end" className="w-64">
              {/* Profile header */}
              <div className="flex items-center gap-3 p-2">
                <Avatar>
                  <AvatarFallback>
                    {user ? initials(user.name) : "?"}
                  </AvatarFallback>
                </Avatar>
                <div className="flex min-w-0 flex-col">
                  <span className="truncate text-sm font-medium text-foreground">
                    {user?.name}
                  </span>
                  <span className="truncate text-xs text-muted-foreground">
                    {user?.email}
                  </span>
                </div>
              </div>
              <div className="px-2 pb-1.5">
                <Badge variant="secondary" className="font-medium">
                  {user?.role}
                </Badge>
              </div>
              <DropdownMenuSeparator />
              <DropdownMenuItem variant="destructive" onClick={handleLogout}>
                <LogOut className="size-4" />
                Sign out
              </DropdownMenuItem>
            </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        <main className="mx-auto w-full max-w-[1260px] px-4 py-8 sm:px-8 sm:py-10">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
