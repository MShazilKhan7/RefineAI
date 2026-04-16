import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import {
  Briefcase,
  LayoutDashboard,
  Plus,
  ChevronLeft,
  ChevronRight,
  FileText,
  CheckCircle2,
  Activity,
  Settings,
  LogIn,
  X,
  Menu,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useJobApplication } from "@/hooks/useJobApplication";
import { LogOut } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

function SidebarLink({
  href,
  icon: Icon,
  label,
  collapsed,
  active,
  onClick,
}: {
  href: string;
  icon: React.ElementType;
  label: string;
  collapsed: boolean;
  active?: boolean;
  onClick?: () => void;
}) {
  const inner = (
    <Link href={href}>
      <div
        onClick={onClick}
        className={cn(
          "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all cursor-pointer select-none",
          active
            ? "bg-primary/10 text-primary"
            : "text-muted-foreground hover:bg-muted/60 hover:text-foreground",
        )}
      >
        <Icon className="w-4 h-4 shrink-0" />
        {!collapsed && <span className="truncate">{label}</span>}
      </div>
    </Link>
  );

  if (collapsed) {
    return (
      <Tooltip>
        <TooltipTrigger asChild>{inner}</TooltipTrigger>
        <TooltipContent side="right">{label}</TooltipContent>
      </Tooltip>
    );
  }

  return inner;
}

const stats = {
  total: 42,
  withResume: 30,
  acceptedSuggestions: 15,
};

export function Layout({ children }: { children: React.ReactNode }) {
  const [collapsed, setCollapsed] = useState(false);
  // Mobile: sidebar hidden by default
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [location] = useLocation();
  const { jobs } = useJobApplication();
  const { signout } = useAuth();

  const isHome = location === "/";
  const isNew = location === "/jobs/new";

  // Detect mobile breakpoint
  useEffect(() => {
    const check = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (mobile) {
        setCollapsed(false); // reset collapsed state on mobile
      }
    };
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  // Close mobile sidebar on route change
  useEffect(() => {
    setMobileOpen(false);
  }, [location]);

  const handleLogout = () => {
    signout();
  };

  const sidebarContent = (
    <>
      {/* Header */}
      <div
        className={cn(
          "flex items-center h-14 border-b border-border/40 px-3",
          collapsed && !isMobile ? "justify-center" : "gap-2 px-4",
        )}
      >
        <div className="bg-primary/10 p-1.5 rounded-md text-primary shrink-0">
          <Briefcase className="w-4 h-4" />
        </div>
        {(!collapsed || isMobile) && (
          <span className="font-semibold text-sm truncate">RefineAI</span>
        )}
        {/* Close button on mobile */}
        {isMobile && (
          <button
            onClick={() => setMobileOpen(false)}
            className="ml-auto p-1 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto px-2 py-3 space-y-1">
        <SidebarLink
          href="/"
          icon={LayoutDashboard}
          label="Applications"
          collapsed={collapsed && !isMobile}
          active={isHome}
          onClick={() => isMobile && setMobileOpen(false)}
        />
        <SidebarLink
          href="/jobs/new"
          icon={Plus}
          label="New Application"
          collapsed={collapsed && !isMobile}
          active={isNew}
          onClick={() => isMobile && setMobileOpen(false)}
        />

        {(!collapsed || isMobile) && stats && (
          <div className="pt-4 pb-1 px-3">
            <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/60 mb-2">
              Overview
            </p>
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span className="flex items-center gap-1.5">
                  <Briefcase className="w-3 h-3" />
                  Total
                </span>
                <span className="font-semibold text-foreground">
                  {stats.total}
                </span>
              </div>
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span className="flex items-center gap-1.5">
                  <Activity className="w-3 h-3 text-amber-500" />
                  Interviewing
                </span>
                <span className="font-semibold text-foreground">
                  {stats?.byStatus?.find((s) => s.status === "interviewing")
                    ?.count || 0}
                </span>
              </div>
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span className="flex items-center gap-1.5">
                  <FileText className="w-3 h-3 text-blue-500" />
                  With Resume
                </span>
                <span className="font-semibold text-foreground">
                  {stats.withResume}
                </span>
              </div>
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                  AI Improvements
                </span>
                <span className="font-semibold text-foreground">
                  {stats.acceptedSuggestions}
                </span>
              </div>
            </div>
          </div>
        )}

        {(!collapsed || isMobile) && jobs && jobs.length > 0 && (
          <div className="pt-4">
            <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/60 mb-2 px-3">
              Recent
            </p>
            <div className="space-y-0.5">
              {Array.isArray(jobs) &&
                jobs.slice(0, 8).map((job) => {
                  const isActive = location === `/jobs/${job.id}`;
                  return (
                    <Link key={job.id} href={`/jobs/${job.id}`}>
                      <div
                        onClick={() => isMobile && setMobileOpen(false)}
                        className={cn(
                          "px-3 py-2 rounded-lg cursor-pointer transition-colors",
                          isActive ? "bg-primary/10" : "hover:bg-muted/60",
                        )}
                      >
                        <p
                          className={cn(
                            "text-xs font-medium truncate",
                            isActive ? "text-primary" : "text-foreground/80",
                          )}
                        >
                          {job.jobTitle}
                        </p>
                        <p className="text-[11px] text-muted-foreground truncate">
                          {job.companyName}
                        </p>
                      </div>
                    </Link>
                  );
                })}
            </div>
          </div>
        )}
      </nav>

      {/* Logout */}
      <button
        onClick={handleLogout}
        className={cn(
          "flex w-full items-center gap-3 px-4 py-3 mt-auto text-sm font-medium text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive border-t border-border/40",
          collapsed && !isMobile && "justify-center px-0",
        )}
      >
        <LogOut size={18} strokeWidth={2} className="shrink-0" />
        {(!collapsed || isMobile) && <span className="capitalize">Logout</span>}
      </button>
    </>
  );

  return (
    <div className="min-h-[100dvh] flex bg-background text-foreground">
      {/* ── Desktop sidebar ── */}
      {!isMobile && (
        <aside
          className={cn(
            "relative flex flex-col border-r border-border/50 bg-card/40 transition-all duration-200 shrink-0 h-screen sticky top-0",
            collapsed ? "w-[60px]" : "w-[240px]",
          )}
        >
          {sidebarContent}

          {/* Collapse toggle */}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="absolute -right-3 top-[52px] z-20 bg-background border border-border rounded-full w-6 h-6 flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted transition-colors shadow-sm"
            title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {collapsed ? (
              <ChevronRight className="w-3.5 h-3.5" />
            ) : (
              <ChevronLeft className="w-3.5 h-3.5" />
            )}
          </button>
        </aside>
      )}

      {/* ── Mobile overlay backdrop ── */}
      {isMobile && mobileOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/40 backdrop-blur-sm"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* ── Mobile drawer ── */}
      {isMobile && (
        <aside
          className={cn(
            "fixed inset-y-0 left-0 z-40 flex flex-col w-[260px] border-r border-border/50 bg-card transition-transform duration-200 shadow-xl",
            mobileOpen ? "translate-x-0" : "-translate-x-full",
          )}
        >
          {sidebarContent}
        </aside>
      )}

      {/* ── Main content ── */}
      <div className="flex-1 flex flex-col min-w-0 overflow-auto">
        {/* Mobile top bar */}
        {isMobile && (
          <header className="sticky top-0 z-20 flex items-center h-14 px-4 border-b border-border/40 bg-background/80 backdrop-blur-sm gap-3">
            <button
              onClick={() => setMobileOpen(true)}
              className="p-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
            >
              <Menu className="w-5 h-5" />
            </button>
            <div className="bg-primary/10 p-1.5 rounded-md text-primary">
              <Briefcase className="w-4 h-4" />
            </div>
            <span className="font-semibold text-sm">RefineAI</span>
          </header>
        )}

        <main className="flex-1 px-4 py-4 md:px-6 md:py-6">{children}</main>
      </div>
    </div>
  );
}