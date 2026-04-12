import api from "./api";
import type { JobApplication } from "../types/apitypes";

export const JobAPI = {
  getJobs: () => api.get<JobApplication[]>("/jobs").then((res) => res.data),

  getJobById: (id: string) =>
    api.get<JobApplication>(`/jobs/${id}`).then((res) => res.data),

  createJob: (data: Partial<JobApplication>) =>
    api.post<JobApplication>("/jobs", data).then((res) => res.data),

  updateJob: (id: string, data: Partial<JobApplication>) =>
    api.put<JobApplication>(`/jobs/${id}`, data).then((res) => res.data),

  deleteJob: (id: string) =>
    api.delete<{ message: string }>(`/jobs/${id}`).then((res) => res.data),

  changeJobStatus: (id: string, status: string) =>
    api
      .patch<JobApplication>(`/jobs/${id}/status`, { status })
      .then((res) => res.data),
};

export default JobAPI;
