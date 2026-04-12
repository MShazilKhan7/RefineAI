import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { aiSuggestionsApi } from "@/api/aiSuggestions";
import { JobApplication } from "@/types/apitypes";
import { toast } from "./use-toast";
import { useLocation } from "wouter";
import { aiInterviewApi } from "@/api/aiInterview";

export const useAIInterviewQuestions = (jobId: string) => {
  const queryClient = useQueryClient();
  const [, setLocation] = useLocation();

  const {
    data: questions,
    isLoading: isLoadingQuestions,
    isError,
  } = useQuery({
    queryKey: ["ai-interview-questions", jobId],
    queryFn: () => aiInterviewApi.getQuestions(jobId),
    enabled: !!jobId,
  });

  const {
    mutate: generateQuestions,
    isPending: isGenerating,
    isError: isGenerateError,
  } = useMutation({
    mutationFn: (additionalTopics?: string[]) => aiInterviewApi.generateQuestions(jobId, additionalTopics),
    onSuccess: (newQuestions) => {
      queryClient.invalidateQueries({ queryKey: ["ai-interview-questions", jobId] });
      toast({ title: "Success", description: "AI interview questions generated." });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description:
          error?.data?.message || "Failed to generate AI interview questions.",
      });
    },
  });



  return {
    questions,
    isLoadingQuestions,
    isError,
    generateQuestions,
    isGenerating,
    isGenerateError
  };
};
