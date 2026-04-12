import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Briefcase, LayoutDashboard, Plus, ChevronLeft, ChevronRight, FileText, CheckCircle2, Activity, Settings } from "lucide-react";
import { StatusBadge } from "@/components/status-badge";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { useJobApplication } from "@/hooks/useJobApplication";

function SidebarLink({
  href,
  icon: Icon,
  label,
  collapsed,
  active,
}: {
  href: string;
  icon: React.ElementType;
  label: string;
  collapsed: boolean;
  active?: boolean;
}) {
  const inner = (
    <Link href={href}>
      <div
        className={cn(
          "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all cursor-pointer select-none",
          active
            ? "bg-primary/10 text-primary"
            : "text-muted-foreground hover:bg-muted/60 hover:text-foreground"
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
}

export function Layout({ children }: { children: React.ReactNode }) {
  const [collapsed, setCollapsed] = useState(false);
  const [location] = useLocation();
  const { jobs } = useJobApplication();

  const isHome = location === "/";
  const isNew = location === "/jobs/new";



  return (
    <div className="min-h-[100dvh] flex bg-background text-foreground">
      <aside
        className={cn(
          "relative flex flex-col border-r border-border/50 bg-card/40 transition-all duration-200 shrink-0 h-screen sticky top-0",
          collapsed ? "w-[60px]" : "w-[240px]"
        )}
      >
        <div className={cn("flex items-center h-14 border-b border-border/40 px-3", collapsed ? "justify-center" : "gap-2 px-4")}>
          <div className="bg-primary/10 p-1.5 rounded-md text-primary shrink-0">
            <Briefcase className="w-4 h-4" />
          </div>
          {!collapsed && (
            <span className="font-semibold text-sm truncate">Career Command</span>
          )}
        </div>

        <button
          onClick={() => setCollapsed(!collapsed)}
          className="absolute -right-3 top-[52px] z-20 bg-background border border-border rounded-full w-6 h-6 flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted transition-colors shadow-sm"
          title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {collapsed ? <ChevronRight className="w-3.5 h-3.5" /> : <ChevronLeft className="w-3.5 h-3.5" />}
        </button>

        <nav className="flex-1 overflow-y-auto px-2 py-3 space-y-1">
          <SidebarLink href="/" icon={LayoutDashboard} label="Applications" collapsed={collapsed} active={isHome} />
          <SidebarLink href="/jobs/new" icon={Plus} label="New Application" collapsed={collapsed} active={isNew} />

          {!collapsed && stats && (
            <div className="pt-4 pb-1 px-3">
              <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/60 mb-2">Overview</p>
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span className="flex items-center gap-1.5"><Briefcase className="w-3 h-3" />Total</span>
                  <span className="font-semibold text-foreground">{stats.total}</span>
                </div>
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span className="flex items-center gap-1.5"><Activity className="w-3 h-3 text-amber-500" />Interviewing</span>
                  <span className="font-semibold text-foreground">{stats?.byStatus?.find(s => s.status === "interviewing")?.count || 0}</span>
                </div>
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span className="flex items-center gap-1.5"><FileText className="w-3 h-3 text-blue-500" />With Resume</span>
                  <span className="font-semibold text-foreground">{stats.withResume}</span>
                </div>
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span className="flex items-center gap-1.5"><CheckCircle2 className="w-3 h-3 text-emerald-500" />AI Improvements</span>
                  <span className="font-semibold text-foreground">{stats.acceptedSuggestions}</span>
                </div>
              </div>
            </div>
          )}

          {!collapsed && jobs && jobs.length > 0 && (
            <div className="pt-4">
              <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/60 mb-2 px-3">Recent</p>
              <div className="space-y-0.5">
                {Array.isArray(jobs) && jobs.slice(0, 8).map(job => {
                  const isActive = location === `/jobs/${job.id}`;
                  return (
                    <Link key={job.id} href={`/jobs/${job.id}`}>
                      <div className={cn(
                        "px-3 py-2 rounded-lg cursor-pointer transition-colors",
                        isActive ? "bg-primary/10" : "hover:bg-muted/60"
                      )}>
                        <p className={cn("text-xs font-medium truncate", isActive ? "text-primary" : "text-foreground/80")}>{job.jobTitle}</p>
                        <p className="text-[11px] text-muted-foreground truncate">{job.companyName}</p>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>
          )}
        </nav>
      </aside>

      <div className="flex-1 flex flex-col min-w-0 overflow-auto">
        <main className="flex-1 px-6 py-6">
          {children}
        </main>
      </div>
    </div>
  );
}
