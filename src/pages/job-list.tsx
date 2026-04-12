import { Layout } from "@/components/layout";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import {
  Plus,
  Briefcase,
  FileText,
  CheckCircle2,
  ChevronRight,
  Activity,
} from "lucide-react";
import { StatusBadge } from "@/components/status-badge";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useJobApplication } from "@/hooks/useJobApplication";
import { JobApplication } from "@/types/apitypes";

export function JobList() {
  const { jobs, isJobsLoading } = useJobApplication();
  return (
    <Layout>
      <div className="space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-foreground">
              Applications
            </h1>
            <p className="text-muted-foreground mt-1">
              Track and optimize your job search pipeline.
            </p>
          </div>
          <Link href="/jobs/new">
            <Button className="gap-2 w-full sm:w-auto">
              <Plus className="w-4 h-4" />
              Add Application
            </Button>
          </Link>
        </div>

        {/* Stats Row */}
        {/* {isStatsLoading ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <Card key={i}>
                <CardContent className="p-6">
                  <Skeleton className="h-4 w-24 mb-2" />
                  <Skeleton className="h-8 w-16" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : stats ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card className="bg-card/50">
              <CardContent className="p-6 flex flex-col justify-center">
                <p className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                  <Briefcase className="w-4 h-4 text-primary" />
                  Total Applications
                </p>
                <p className="text-3xl font-bold mt-2">{stats.total}</p>
              </CardContent>
            </Card>
            <Card className="bg-card/50">
              <CardContent className="p-6 flex flex-col justify-center">
                <p className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                  <Activity className="w-4 h-4 text-amber-500" />
                  Active Pipeline
                </p>
                <p className="text-3xl font-bold mt-2">
                  {stats?.byStatus?.find((s) => s.status === "interviewing")
                    ?.count || 0}
                </p>
              </CardContent>
            </Card>
            <Card className="bg-card/50">
              <CardContent className="p-6 flex flex-col justify-center">
                <p className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                  <FileText className="w-4 h-4 text-blue-500" />
                  Resumes Uploaded
                </p>
                <p className="text-3xl font-bold mt-2">{stats.withResume}</p>
              </CardContent>
            </Card>
            <Card className="bg-card/50">
              <CardContent className="p-6 flex flex-col justify-center">
                <p className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  AI Improvements
                </p>
                <p className="text-3xl font-bold mt-2">
                  {stats.acceptedSuggestions}
                </p>
              </CardContent>
            </Card>
          </div>
        ) : null} */}

        {/* Jobs List */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Recent Applications</h2>

          {isJobsLoading ? (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-20 w-full rounded-xl" />
              ))}
            </div>
          ) : jobs && jobs.length > 0 ? (
            <div className="grid gap-3">
              {jobs.map((job:JobApplication) => (
                <Link key={job.id} href={`/jobs/${job.id}`}>
                  <div className="group block bg-card hover:bg-accent/40 border border-border/50 rounded-xl p-4 transition-all hover:shadow-md hover:-translate-y-0.5">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-3 mb-1">
                          <h3 className="font-semibold text-lg text-card-foreground truncate">
                            {job.jobTitle}
                          </h3>
                          <StatusBadge status={job.status} />
                        </div>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <span className="font-medium text-foreground/80">
                            {job.companyName}
                          </span>
                          <span className="flex items-center gap-1">
                            Applied{" "}
                            {new Date(job.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                      <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-foreground transition-colors hidden sm:block" />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <Card className="border-dashed bg-muted/30">
              <CardContent className="flex flex-col items-center justify-center py-12 text-center">
                <div className="bg-primary/10 p-4 rounded-full mb-4">
                  <Briefcase className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">
                  No applications yet
                </h3>
                <p className="text-muted-foreground max-w-sm mb-6">
                  Start tracking your job search by adding your first
                  application to the pipeline.
                </p>
                <Link href="/jobs/new">
                  <Button>Add First Application</Button>
                </Link>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </Layout>
  );
}
