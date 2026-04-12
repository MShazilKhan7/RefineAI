import { Button } from "@/components/ui/button";
import {
  Loader2,
  Sparkles,
  Check,
  X,
  AlertCircle,
  ArrowRight,
} from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useAISuggestions } from "@/hooks/useAISuggestions";
import { AISuggestion, JobApplication } from "@/types/apitypes";
import { useJobApplication } from "@/hooks/useJobApplication";
import { useParams } from "wouter";
import { useEffect, useState } from "react";

// const DUMMY_SUGGESTIONS = [
//   {
//     id: 1,
//     status: "pending",
//     originalText: "Responsible for managing team projects and deadlines.",
//     suggestedText:
//       "Led cross-functional teams to deliver 5+ projects on time, reducing delays by 30%.",
//     explanation:
//       "Use action verbs and quantify achievements to make your experience more impactful.",
//   },
//   {
//     id: 2,
//     status: "pending",
//     originalText: "Worked with React to build web apps.",
//     suggestedText:
//       "Architected and shipped 3 production React applications serving 10,000+ users.",
//     explanation:
//       "Specificity and scale show measurable impact to hiring managers.",
//   },
//   {
//     id: 3,
//     status: "accepted",
//     originalText: "Good communication skills.",
//     suggestedText:
//       "Presented technical roadmaps to C-suite stakeholders, aligning engineering with business goals.",
//     explanation:
//       "Replace vague soft skills with concrete examples that demonstrate the skill.",
//   },
// ];

export function SuggestionsPanel({
  jobDetails,
}: {
  jobDetails: JobApplication;
}) {
  const params = useParams();
  const jobId = params.id!;
  const {
    suggestions,
    generateSuggestions,
    isGenerating,
    isError,
    isGenerateError,
    isLoadingSuggestions,
    acceptSuggestions,
    isAccepting,
    isAcceptError,
  } = useAISuggestions(jobId);

  const [pending, setPending] = useState<AISuggestion[]>([]);
  const [accepted, setAccepted] = useState<AISuggestion[]>([]);

  const handleGenerateSuggestion = () => {
    generateSuggestions();
  };

  const handleAcceptSuggestion = (suggestionId: string) => {
    acceptSuggestions(suggestionId);
  };

  useEffect(() => {
    if (suggestions?.length > 0) {
      setPending(suggestions.filter((s) => s.status === "pending"));
      setAccepted(suggestions.filter((s) => s.status === "accepted"));
    }
  }, [suggestions]);

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="bg-primary/10 p-1.5 rounded-md">
            <Sparkles className="w-4 h-4 text-primary" />
          </div>
          <h3 className="text-base font-semibold">AI Resume Feedback</h3>
        </div>
        <Button
          size="sm"
          variant="secondary"
          onClick={handleGenerateSuggestion}
        >
          <Sparkles className="w-4 h-4 mr-1.5" />
          Analyze Resume
        </Button>
      </div>

      <div className="grid grid-cols-2 gap-4 min-h-0">
        {/* Pending Suggestions */}
        <div className="flex flex-col min-h-0">
          <div className="flex items-center gap-2 mb-2">
            <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              AI Suggestions
            </h4>
            {pending.length > 0 && (
              <span className="text-[10px] bg-primary/10 text-primary px-1.5 py-0.5 rounded-full font-medium">
                {pending.length}
              </span>
            )}
          </div>
          {/* Replace the pending ScrollArea section */}
          <ScrollArea className="flex-1 max-h-[480px] pr-1">
            {isGenerating ? (
              <div className="space-y-3 pb-2">
                {[...Array(3)].map((_, i) => (
                  <div
                    key={i}
                    className="border border-border/50 rounded-lg p-3 bg-background space-y-2.5"
                  >
                    <div className="space-y-2">
                      <Skeleton className="h-3 w-16" />
                      <Skeleton className="h-8 w-full" />
                      <Skeleton className="h-3 w-20 mt-1" />
                      <Skeleton className="h-8 w-full" />
                    </div>
                    <Skeleton className="h-10 w-full rounded-md" />
                    <div className="flex gap-2">
                      <Skeleton className="h-7 flex-1 rounded-md" />
                      <Skeleton className="h-7 flex-1 rounded-md" />
                    </div>
                  </div>
                ))}
                <div className="flex items-center justify-center gap-2 py-2 text-xs text-muted-foreground">
                  <Loader2 className="w-3 h-3 animate-spin" />
                  Analyzing your resume...
                </div>
              </div>
            ) : (
              <>
                {pending.length === 0 && (
                  <div className="border border-dashed border-border rounded-lg p-6 flex flex-col items-center gap-2.5 text-center">
                    <div className="w-9 h-9 rounded-full bg-muted/50 flex items-center justify-center">
                      <Sparkles className="w-4 h-4 text-muted-foreground" />
                    </div>
                    <p className="text-sm font-medium text-foreground">
                      No suggestions yet
                    </p>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      Click <span className="font-medium">Analyze Resume</span>{" "}
                      to get AI-powered feedback tailored to this job.
                    </p>
                  </div>
                )}
                <div className="space-y-3 pb-2">
                  {pending.map((s) => (
                    <div
                      key={s.id}
                      className="border border-border/50 rounded-lg p-3 bg-background shadow-sm space-y-2.5"
                    >
                      <div className="space-y-2 text-sm">
                        <div>
                          <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider block mb-0.5">
                            Original
                          </span>
                          <p className="line-through text-destructive/70 bg-destructive/5 px-1.5 py-0.5 rounded text-xs leading-relaxed">
                            {s.originalText}
                          </p>
                        </div>
                        <div className="flex items-start gap-1.5">
                          <ArrowRight className="w-3 h-3 text-emerald-500 mt-1 shrink-0" />
                          <div>
                            <span className="text-[10px] font-semibold text-emerald-600 dark:text-emerald-500 uppercase tracking-wider block mb-0.5">
                              Suggested
                            </span>
                            <p className="text-emerald-700 dark:text-emerald-300 font-medium bg-emerald-50 dark:bg-emerald-900/30 px-1.5 py-0.5 rounded text-xs leading-relaxed">
                              {s.suggestedText}
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="bg-muted/30 rounded p-2 text-xs text-muted-foreground border border-border/40 flex items-start gap-1.5">
                        <Sparkles className="w-3 h-3 text-primary shrink-0 mt-0.5" />
                        <span>{s.explanation}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          size="sm"
                          className="flex-1 h-7 text-xs bg-emerald-600 hover:bg-emerald-700 text-white"
                          onClick={() => handleAcceptSuggestion(s.id)}
                        >
                          <Check className="w-3 h-3 mr-1" /> Accept
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="flex-1 h-7 text-xs hover:bg-destructive/10 hover:text-destructive hover:border-destructive"
                        >
                          <X className="w-3 h-3 mr-1" /> Dismiss
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </ScrollArea>
        </div>

        {/* Accepted Suggestions */}
        <div className="flex flex-col min-h-0 border-l border-border/40 pl-4">
          <div className="flex items-center gap-2 mb-2">
            <h4 className="text-xs font-semibold text-emerald-600 dark:text-emerald-500 uppercase tracking-wider">
              Accepted Changes
            </h4>
            {accepted.length > 0 && (
              <span className="text-[10px] bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-400 px-1.5 py-0.5 rounded-full font-medium">
                {accepted.length}
              </span>
            )}
          </div>

          {accepted.length > 0 && (
            <p className="text-[11px] text-muted-foreground mb-2 flex items-center gap-1">
              <AlertCircle className="w-3 h-3 shrink-0" />
              Apply these changes to your actual resume document.
            </p>
          )}

          <ScrollArea className="flex-1 max-h-[480px] pr-1">
            {accepted.length === 0 && (
              <div className="border border-dashed border-border rounded-lg p-6 flex flex-col items-center gap-2.5 text-center">
                <div className="w-9 h-9 rounded-full bg-muted/50 flex items-center justify-content-center">
                  <Check className="w-4 h-4 text-muted-foreground" />
                </div>
                <p className="text-sm font-medium text-foreground">
                  No accepted changes
                </p>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Suggestions you accept will appear here, ready to apply to
                  your resume.
                </p>
              </div>
            )}
            <div className="space-y-3 pb-2">
              {accepted.map((s) => (
                <div
                  key={s.id}
                  className="border border-emerald-200/70 dark:border-emerald-900/50 rounded-lg p-3 bg-emerald-50/40 dark:bg-emerald-900/10 space-y-2"
                >
                  <div className="flex items-center gap-1.5 mb-1">
                    <Check className="w-3 h-3 text-emerald-500 shrink-0" />
                    <span className="text-[10px] font-semibold text-emerald-600 uppercase tracking-wider">
                      Accepted
                    </span>
                  </div>
                  <div className="space-y-1.5">
                    <div>
                      <span className="text-[10px] font-medium text-muted-foreground block mb-0.5">
                        Was
                      </span>
                      <p className="text-xs line-through text-muted-foreground/70 bg-muted/40 px-1.5 py-1 rounded leading-relaxed">
                        {s.originalText}
                      </p>
                    </div>
                    <div className="flex items-start gap-1">
                      <ArrowRight className="w-3 h-3 text-emerald-500 mt-1 shrink-0" />
                      <div className="flex-1">
                        <span className="text-[10px] font-medium text-emerald-600 block mb-0.5">
                          Now
                        </span>
                        <p className="text-xs text-emerald-800 dark:text-emerald-300 font-medium bg-emerald-50 dark:bg-emerald-900/30 px-1.5 py-1 rounded leading-relaxed border border-emerald-200/60 dark:border-emerald-800/40">
                          {s.suggestedText}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        </div>
      </div>
    </div>
  );
}
