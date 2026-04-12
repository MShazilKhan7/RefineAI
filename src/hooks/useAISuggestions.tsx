import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { aiSuggestionsApi } from "@/api/aiSuggestions";
import { JobApplication } from "@/types/apitypes";
import { toast } from "./use-toast";
import { useLocation } from "wouter";

export const useAISuggestions = (jobId: string) => {
  const queryClient = useQueryClient();
  const [, setLocation] = useLocation();

  const {
    data: suggestions,
    isLoading: isLoadingSuggestions,
    isError,
  } = useQuery({
    queryKey: ["ai-suggestions", jobId],
    queryFn: () => aiSuggestionsApi.getSuggestions(jobId),
    enabled: !!jobId,
  });

  const {
    mutate: generateSuggestions,
    isPending: isGenerating,
    isError: isGenerateError,
  } = useMutation({
    mutationFn: () => aiSuggestionsApi.generateSuggestions(jobId),
    onSuccess: (newSuggestions) => {
      queryClient.invalidateQueries({ queryKey: ["ai-suggestions", jobId] });
      toast({ title: "Success", description: "AI suggestions generated." });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description:
          error?.data?.message || "Failed to generate AI suggestions.",
      });
    },
  });


  const { mutate: acceptSuggestions, isPending: isAccepting, isError: isAcceptError } = useMutation({
    mutationFn: (suggestionId: string) =>
      aiSuggestionsApi.acceptSuggestions(suggestionId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["ai-suggestions", jobId] });
      toast({ title: "Success", description: "AI suggestion accepted." });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error?.data?.message || "Failed to accept AI suggestion.",
      });
    },
  });

  return {
    suggestions,
    isLoadingSuggestions,
    isError,
    generateSuggestions,
    isGenerating,
    isGenerateError,
    acceptSuggestions,
    isAccepting,
    isAcceptError
  };
};
