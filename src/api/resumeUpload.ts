import { Resume } from "@/types/apitypes";
import api from "./api";

export const resumeApi = {
  uploadResume: (jobId: string, file: File) => {
    const formData = new FormData();
    formData.append("resume", file);
    return api
      .post(`/resume/upload/${jobId}`, formData)
      .then((res) => res.data);
  },

  getResumeByJobId: (jobId: string) =>
    api.get(`/resume/${jobId}`).then((res) => res.data),
};
