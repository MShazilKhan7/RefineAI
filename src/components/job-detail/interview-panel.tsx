import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Loader2,
  MessageSquare,
  Plus,
  Lightbulb,
  ChevronDown,
  ChevronRight,
  BookOpen,
  X,
  Target,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";
import { InterviewQuestion } from "@/types/apitypes";
import { useAIInterviewQuestions } from "@/hooks/useAiInterview";
import { useParams } from "wouter";
import ReactMarkdown from "react-markdown";

function QuestionCard({ q, index }: { q: InterviewQuestion; index: number }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="border border-border/50 rounded-lg overflow-hidden bg-background shadow-sm">
      <button
        onClick={() => setOpen(!open)}
        className="w-full text-left flex items-start gap-3 p-4 hover:bg-muted/30 transition-colors"
      >
        <span className="font-bold text-xs text-primary/50 shrink-0 mt-0.5 w-5">
          Q{index + 1}
        </span>
        <span className="text-sm font-medium text-foreground/90 leading-relaxed flex-1">
          {q.question}
        </span>
        {open ? (
          <ChevronDown className="w-4 h-4 text-muted-foreground shrink-0 mt-0.5" />
        ) : (
          <ChevronRight className="w-4 h-4 text-muted-foreground shrink-0 mt-0.5" />
        )}
      </button>

      {open && (
        <div className="border-t border-border/40 bg-muted/10 divide-y divide-border/30">
          <div className="p-4 space-y-1.5">
            <div className="flex items-center gap-2 mb-2">
              <div className="bg-blue-50 dark:bg-blue-900/20 p-1 rounded">
                <BookOpen className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
              </div>
              <span className="text-xs font-semibold text-blue-700 dark:text-blue-400 uppercase tracking-wider">
                How to Answer
              </span>
            </div>
            <div className="prose prose-sm dark:prose-invert max-w-none text-muted-foreground">
              <ReactMarkdown>{q.answer}</ReactMarkdown>
            </div>
          </div>

          {q.keyPoints && q.keyPoints.length > 0 && (
            <div className="p-4">
              <div className="flex items-center gap-2 mb-2.5">
                <div className="bg-amber-50 dark:bg-amber-900/20 p-1 rounded">
                  <Target className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
                </div>
                <span className="text-xs font-semibold text-amber-700 dark:text-amber-400 uppercase tracking-wider">
                  Key Points to Cover
                </span>
              </div>
              <ul className="space-y-1.5">
                {q.keyPoints.map((point, i) => (
                  <li
                    key={i}
                    className="flex items-start gap-2 text-sm text-foreground/80"
                  >
                    <span className="text-amber-500 mt-1.5 shrink-0 w-1 h-1 rounded-full bg-amber-500 block"></span>
                    <span className="leading-relaxed">{point}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export function InterviewPanel() {
  const params = useParams();
  const jobId = params.id!;
  const [newTopic, setNewTopic] = useState("");
  const [topics, setTopics] = useState<string[]>([]);
  const [openTopics, setOpenTopics] = useState<Record<number, boolean>>({});

  const {
    questions,
    isGenerating,
    generateQuestions,
    isError,
    isLoadingQuestions,
    isGenerateError,
  } = useAIInterviewQuestions(jobId);

  const hasTopics = questions?.topics && questions.topics.length > 0;

  const handleAddTopic = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTopic.trim() || topics.includes(newTopic.trim())) return;
    setTopics([...topics, newTopic.trim()]);
    setNewTopic("");
  };

  const removeTopic = (t: string) =>
    setTopics(topics.filter((topic) => topic !== t));

  const toggleTopic = (i: number) =>
    setOpenTopics((prev) => ({ ...prev, [i]: !prev[i] }));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
        <div>
          <h3 className="text-base font-semibold flex items-center gap-2">
            <div className="bg-primary/10 p-1.5 rounded-md inline-flex">
              <MessageSquare className="w-4 h-4 text-primary" />
            </div>
            Interview Preparation
          </h3>
          <p className="text-sm text-muted-foreground mt-1">
            Questions tailored to this role, with guidance and key concepts per
            question.
          </p>
        </div>
        <Button
          onClick={() => generateQuestions(topics)}
          disabled={isGenerating}
          className="shrink-0"
        >
          {isGenerating ? (
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
          ) : (
            <Lightbulb className="w-4 h-4 mr-2" />
          )}
          {hasTopics ? "Regenerate" : "Generate Guide"}
        </Button>
      </div>

      {/* Custom Topics */}
      <div className="p-4 bg-muted/20 border border-border/60 rounded-xl">
        <h4 className="text-sm font-medium mb-1 text-foreground/80">
          Custom Focus Areas
        </h4>
        <p className="text-xs text-muted-foreground mb-3">
          Add specific topics for the AI to cover in your prep guide.
        </p>
        <form onSubmit={handleAddTopic} className="flex gap-2 mb-3">
          <Input
            placeholder="e.g. System Design, Behavioral, React Performance"
            value={newTopic}
            onChange={(e) => setNewTopic(e.target.value)}
            className="max-w-md bg-background text-sm h-8"
          />
          <Button
            type="submit"
            variant="secondary"
            size="sm"
            disabled={!newTopic.trim()}
          >
            <Plus className="w-3.5 h-3.5 mr-1" /> Add
          </Button>
        </form>
        {topics.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {topics.map((t) => (
              <span
                key={t}
                className="inline-flex items-center text-xs bg-primary/10 text-primary border border-primary/20 px-2.5 py-1 rounded-full font-medium gap-1"
              >
                {t}
                <button
                  type="button"
                  onClick={() => removeTopic(t)}
                  className="text-primary/60 hover:text-primary ml-0.5"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Questions */}
      {isGenerating || isLoadingQuestions ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="border border-border/50 rounded-xl p-4 space-y-3"
            >
              <Skeleton className="h-5 w-40" />
              <Skeleton className="h-16 w-full rounded-lg" />
              <Skeleton className="h-16 w-full rounded-lg" />
            </div>
          ))}
        </div>
      ) : hasTopics ? (
        <div className="space-y-4">
          {questions!.topics.map((topic, i) => (
            <div
              key={i}
              className="border border-border/60 rounded-xl overflow-hidden bg-card shadow-sm"
            >
              <button
                onClick={() => toggleTopic(i)}
                className="w-full flex items-center justify-between px-5 py-4 hover:bg-muted/30 transition-colors text-left"
              >
                <div className="flex items-center gap-2">
                  <span className="text-primary font-bold text-xs">
                    #{i + 1}
                  </span>
                  <span className="font-semibold text-base">{topic.topic}</span>
                  <span className="text-xs text-muted-foreground bg-muted/50 px-2 py-0.5 rounded-full">
                    {topic.questions.length} questions
                  </span>
                </div>
                {openTopics[i] ? (
                  <ChevronDown className="w-4 h-4 text-muted-foreground" />
                ) : (
                  <ChevronRight className="w-4 h-4 text-muted-foreground" />
                )}
              </button>

              {openTopics[i] && (
                <div className="px-5 pb-5 pt-1 space-y-3 border-t border-border/40 bg-muted/5">
                  {topic.questions.map((q, qIndex) => (
                    <QuestionCard key={qIndex} q={q} index={qIndex} />
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-16 px-4 text-muted-foreground border-2 border-dashed border-border/60 rounded-xl bg-muted/5">
          <div className="bg-background w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm border border-border/50">
            <MessageSquare className="w-7 h-7 text-muted-foreground/40" />
          </div>
          <h4 className="text-base font-medium text-foreground mb-1">
            No Prep Guide Yet
          </h4>
          <p className="max-w-sm mx-auto text-sm">
            Generate a customized interview prep guide with questions,
            how-to-answer guidance, and key concepts per topic.
          </p>
        </div>
      )}
    </div>
  );
}