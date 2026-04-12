import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { FileUp, Trash2, File, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useResume } from "@/hooks/useResume";

type Job = {
  id: string;
  resumeUrl?: string;
  resumeFileName?: string;
};

export function ResumePanel({ job }: { job: Job }) {
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const {
    uploadResume,
    isUploading,
    isError,
    resumePdf,
    isGettingResume,
    isGettingResumeError,
  } = useResume(job.id);

  const [resumeFileName, setResumeFileName] = useState<string | undefined>(
    job.resumeFileName,
  );
  const [isDeleting, setIsDeleting] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.type !== "application/pdf") {
      toast({ title: "Only PDF files are supported", variant: "destructive" });
      return;
    }
    uploadResume({ jobId: job.id, file });
  };

  const handleDelete = () => {};

  return (
    <div className="bg-card border border-border/50 rounded-xl p-6 shadow-sm h-full flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">Resume</h3>
        {resumePdf?.fileUrl && (
          <Button
            variant="ghost"
            size="sm"
            onClick={handleDelete}
            disabled={isDeleting}
            className="text-destructive hover:text-destructive hover:bg-destructive/10"
          >
            {isDeleting ? (
              <Loader2 className="w-4 h-4 animate-spin mr-2" />
            ) : (
              <Trash2 className="w-4 h-4 mr-2" />
            )}
            Delete
          </Button>
        )}
      </div>
      {isGettingResume && (
        <div className="flex-1 flex items-center justify-center">
          <Loader2 className="w-6 h-6 animate-spin text-primary" />
        </div>
      )}
      {resumePdf?.fileUrl ? (
        <div
          className={`flex-1 flex flex-col ${resumePdf?.fileUrl ? "min-h-[800px]" : " min-h-[400px]"}`}
        >
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4 bg-muted/50 p-2 rounded border border-border/50">
            <File className="w-4 h-4 text-primary" />
            <span className="font-medium">{"resume.pdf"}</span>
          </div>
          <iframe
            src={resumePdf?.fileUrl}
            className="w-full flex-1 border rounded-lg bg-muted/20"
            title="Resume PDF viewer"
          />
        </div>
      ) : (
        <div className="flex-1 flex flex-col items-center justify-center border-2 border-dashed border-border/60 rounded-xl p-8 text-center bg-muted/10 transition-colors hover:bg-muted/20">
          <div className="bg-primary/10 p-4 rounded-full mb-4">
            <FileUp className="w-6 h-6 text-primary" />
          </div>
          <h4 className="font-medium mb-1">Upload Resume</h4>
          <p className="text-sm text-muted-foreground mb-6 max-w-[250px]">
            Upload the PDF resume you used or plan to use for this application.
          </p>
          <input
            type="file"
            accept="application/pdf"
            className="hidden"
            ref={fileInputRef}
            onChange={handleFileChange}
          />
          <Button
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploading}
          >
            {isUploading ? (
              <Loader2 className="w-4 h-4 animate-spin mr-2" />
            ) : null}
            Select PDF File
          </Button>
        </div>
      )}
    </div>
  );
}
