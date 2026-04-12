import { AISuggestion } from "@/types/apitypes";
import api from "./api";

export const aiSuggestionsApi = {
    getSuggestions: (jobId: string) => api.get(`ai/suggestions/${jobId}`).then((res)=>res.data),
    generateSuggestions: (jobId: string) => api.post<AISuggestion>(`ai/generate/suggestions/${jobId}`).then((res)=>res.data),
    acceptSuggestions: (suggestionId: string) => api.post<AISuggestion>(`ai/accept/${suggestionId}`).then((res)=>res.data)
}