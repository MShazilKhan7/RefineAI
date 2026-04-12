import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { JobAPI } from "../api/jobApplication";
import { JobApplication, Resume } from "@/types/apitypes";
import { toast } from "./use-toast";
import { useLocation } from "wouter";
import { resumeApi } from "@/api/resumeUpload";

export const useResume = (jobId: string) => {
  const queryClient = useQueryClient();
  const [, setLocation] = useLocation();

  const {
    data: resumePdf,
    isLoading: isGettingResume,
    isError: isGettingResumeError,
  } = useQuery({
    queryKey: ["resume", jobId],
    queryFn: () => resumeApi.getResumeByJobId(jobId),
    enabled: !!jobId,
  });

  const {
    mutate: uploadResume,
    isPending: isUploading,
    data: uploadedResume,
    isError,
  } = useMutation({
    mutationFn: ({ jobId, file }: { jobId: string; file: File }) =>
      resumeApi.uploadResume(jobId, file),
    onSuccess: (resume: Resume) => {
      queryClient.invalidateQueries({ queryKey: ["resume", jobId] });
      toast({ title: "Success", description: "resume uploaded successfully" });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error?.data?.message || "Failed to upload resume.",
      });
    },
  });

  return {
    uploadResume,
    isUploading,
    uploadedResume,
    isError,
    resumePdf,
    isGettingResume,
    isGettingResumeError,
  };
};
