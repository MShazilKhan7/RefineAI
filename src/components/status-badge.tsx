import { Badge } from "@/components/ui/badge";
import { JobStatus } from "@/types/apitypes";

const statusConfig: Record<string, { label: string; className: string }> = {
  [JobStatus.APPLIED]: { label: "Applied", className: "bg-blue-100 text-blue-800 hover:bg-blue-100/80 border-blue-200 dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-800" },
  [JobStatus.INTERVIEWING]: { label: "Interviewing", className: "bg-amber-100 text-amber-800 hover:bg-amber-100/80 border-amber-200 dark:bg-amber-900/30 dark:text-amber-300 dark:border-amber-800" },
  [JobStatus.OFFER]: { label: "Offer", className: "bg-emerald-100 text-emerald-800 hover:bg-emerald-100/80 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-300 dark:border-emerald-800" },
  [JobStatus.REJECTED]: { label: "Rejected", className: "bg-red-100 text-red-800 hover:bg-red-100/80 border-red-200 dark:bg-red-900/30 dark:text-red-300 dark:border-red-800" },
};

export function StatusBadge({ status }: { status: string }) {
  const config = statusConfig[status as keyof typeof statusConfig] || {
    label: status,
    className: "bg-muted text-muted-foreground",
  };

  return (
    <Badge variant="outline" className={`font-medium capitalize ${config.className}`}>
      {config.label}
    </Badge>
  );
}
