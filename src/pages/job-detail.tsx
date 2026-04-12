import { Layout } from "@/components/layout";
import { StatusBadge } from "@/components/status-badge";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Trash2, ExternalLink, Loader2 } from "lucide-react";
import { Link, useLocation, useParams } from "wouter";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { ResumePanel } from "@/components/job-detail/resume-panel";
import { SuggestionsPanel } from "@/components/job-detail/suggestions-panel";
import { InterviewPanel } from "@/components/job-detail/interview-panel";
import { useJobApplication } from "@/hooks/useJobApplication";
import { JobStatus } from "@/types/apitypes";

export function JobDetail() {
  const params = useParams();
  const jobId = params.id!;
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const {
    job,
    isJobLoading,
    isJobError,
    changeJobStatus,
    isChangingStatus,
    deleteJob,
    isDeleting,
  } = useJobApplication(jobId);

  if (isJobError) {
    return (
      <Layout>
        <div className="py-12 text-center space-y-4">
          <h2 className="text-2xl font-semibold">Job not found</h2>
          <p className="text-muted-foreground">
            The application you're looking for doesn't exist or was removed.
          </p>
          <Link href="/">
            <Button variant="outline">Return to Applications</Button>
          </Link>
        </div>
      </Layout>
    );
  }

  const handleStatusChange = (newStatus: JobStatus) => {
    changeJobStatus({ id: jobId, status: newStatus });
  };

  const handleDelete = () => {
    if (
      confirm(
        "Are you sure you want to delete this application? This cannot be undone.",
      )
    ) {
      deleteJob(jobId);
      setLocation("/"); // optional redirect after delete
    }
  };
  return (
    <Layout>
      <div className="space-y-5 pb-16 max-w-full">
        <Link
          href="/"
          className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-1" />
          Applications
        </Link>

        {isJobLoading || !job ? (
          <div className="space-y-3">
            <Skeleton className="h-9 w-2/3 max-w-md" />
            <div className="flex gap-2">
              <Skeleton className="h-6 w-24" />
              <Skeleton className="h-6 w-32" />
            </div>
          </div>
        ) : (
          <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
            <div className="space-y-1.5">
              <h1 className="text-2xl font-bold tracking-tight text-foreground">
                {job.jobTitle}
              </h1>
              <div className="flex flex-wrap items-center gap-2.5 text-muted-foreground">
                <span className="font-medium text-foreground/80">
                  {job.companyName}
                </span>
                <span className="w-1 h-1 rounded-full bg-border" />
                <StatusBadge status={job.status} />
                <span className="w-1 h-1 rounded-full bg-border" />
                <span className="text-sm">
                  Added {new Date(job.createdAt).toLocaleDateString()}
                </span>
                {job.jobUrl && (
                  <>
                    <span className="w-1 h-1 rounded-full bg-border" />
                    <a
                      href={job.jobUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:underline inline-flex items-center gap-1 text-sm font-medium"
                    >
                      View Posting <ExternalLink className="w-3 h-3" />
                    </a>
                  </>
                )}
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <Select
                value={job.status}
                onValueChange={(v) => handleStatusChange(v as JobStatus)}
              >
                <SelectTrigger className="w-[140px] h-9">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={JobStatus.APPLIED}>Applied</SelectItem>
                  <SelectItem value={JobStatus.INTERVIEWING}>
                    Interviewing
                  </SelectItem>
                  <SelectItem value={JobStatus.OFFER}>Offer</SelectItem>
                  <SelectItem value={JobStatus.REJECTED}>Rejected</SelectItem>
                </SelectContent>
              </Select>
              <Button
                variant="outline"
                size="icon"
                className="h-9 w-9 text-destructive hover:text-destructive hover:bg-destructive/10"
                onClick={handleDelete}
                title="Delete Application"
              >
                {isDeleting ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Trash2 className="w-4 h-4" />
                )}
              </Button>
            </div>
          </div>
        )}

        {job && (
          <Tabs defaultValue="resume" className="w-full">
            <TabsList className="w-full justify-start border-b rounded-none h-auto p-0 bg-transparent mb-5">
              <TabsTrigger
                value="overview"
                className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none px-4 py-2.5 font-medium text-sm"
              >
                Overview
              </TabsTrigger>
              <TabsTrigger
                value="resume"
                className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none px-4 py-2.5 font-medium text-sm"
              >
                Resume
              </TabsTrigger>
              <TabsTrigger
                value="suggestions"
                className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none px-4 py-2.5 font-medium text-sm"
              >
                AI Feedback
              </TabsTrigger>
              <TabsTrigger
                value="interview"
                className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none px-4 py-2.5 font-medium text-sm"
              >
                Interview Prep
              </TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="mt-0 outline-none">
              <div className="grid gap-5 md:grid-cols-3">
                <div className="md:col-span-2">
                  <div className="bg-card border border-border/50 rounded-xl p-5 shadow-sm">
                    <h3 className="text-base font-semibold mb-3">
                      Job Description
                    </h3>
                    {job.jobDescription ? (
                      <div className="prose prose-sm dark:prose-invert max-w-none text-muted-foreground whitespace-pre-wrap text-sm leading-relaxed">
                        {job.jobDescription}
                      </div>
                    ) : (
                      <p className="text-sm text-muted-foreground italic">
                        No job description provided.
                      </p>
                    )}
                  </div>
                </div>
                <div className="space-y-5">
                  <div className="bg-card border border-border/50 rounded-xl p-5 shadow-sm">
                    <h3 className="text-base font-semibold mb-3">
                      Personal Notes
                    </h3>
                    {job.notes ? (
                      <div className="prose prose-sm dark:prose-invert max-w-none text-muted-foreground whitespace-pre-wrap text-sm leading-relaxed">
                        {job.notes}
                      </div>
                    ) : (
                      <p className="text-sm text-muted-foreground italic">
                        No notes provided.
                      </p>
                    )}
                  </div>
                  {job.resume && (
                    <div className="bg-card border border-border/50 rounded-xl p-5 shadow-sm">
                      <h3 className="text-base font-semibold mb-1">
                        Resume Parsed
                      </h3>
                      <p className="text-xs text-muted-foreground mb-2">
                        PDF content extracted for AI analysis.
                      </p>
                      <div className="bg-muted/30 rounded p-3 text-xs text-muted-foreground max-h-32 overflow-y-auto border border-border/40">
                        {/* {job.resume.slice(0, 400)}{job.resumeText.length > 400 ? "…" : ""} */}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="resume" className="mt-0 outline-none">
              <ResumePanel job={job} />
            </TabsContent>

            <TabsContent value="suggestions" className="mt-0 outline-none">
              <div className="bg-card border border-border/50 rounded-xl p-5 shadow-sm">
                {job && <SuggestionsPanel jobDetails={job} />}
              </div>
            </TabsContent>

            <TabsContent value="interview" className="mt-0 outline-none">
              <div className="bg-card border border-border/50 rounded-xl p-5 shadow-sm">
                <InterviewPanel />
              </div>
            </TabsContent>
          </Tabs>
        )}
      </div>
    </Layout>
  );
}
