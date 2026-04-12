import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { JobAPI } from "../api/jobApplication";
import { JobApplication } from "@/types/apitypes";
import { toast } from "./use-toast";
import { useLocation } from "wouter";

export const useJobApplication = (id?: string) => {
  const queryClient = useQueryClient();
  const [, setLocation] = useLocation();

  const { data: jobs, isLoading: isJobsLoading } = useQuery({
    queryKey: ["jobs"],
    queryFn: JobAPI.getJobs,
  });

  const { data: job, isLoading: isJobLoading, isError: isJobError } = useQuery({
    queryKey: ["jobs", id],
    queryFn: () => JobAPI.getJobById(id!),
    enabled: !!id,
  });

  const { mutate: createJob, isPending: isCreating } = useMutation({
    mutationFn: (data: Partial<JobApplication>) => JobAPI.createJob(data),
    onSuccess: (newJob: JobApplication) => {
      queryClient.invalidateQueries({ queryKey: ["jobs"] });
      toast({ title: "Success", description: "Job application created." });
      setLocation(`/jobs/${newJob.id}`);
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error?.data?.message || "Failed to create job.",
      });
    },
  });

  const { mutate: updateJob, isPending: isUpdating } = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<JobApplication> }) =>
      JobAPI.updateJob(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["jobs"] });
      toast({ title: "Success", description: "Job application updated." });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error?.data?.message || "Failed to update job.",
      });
    },
  });

  const { mutate: deleteJob, isPending: isDeleting } = useMutation({
    mutationFn: (id: string) => JobAPI.deleteJob(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["jobs"] });
      toast({ title: "Success", description: "Job application deleted." });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error?.data?.message || "Failed to delete job.",
      });
    },
  });

  const { mutate: changeJobStatus, isPending: isChangingStatus } = useMutation({
  mutationFn: ({ id, status }: { id: string; status: string }) =>
    JobAPI.changeJobStatus(id, status),
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ['jobs'] });
    if (id) queryClient.invalidateQueries({ queryKey: ['jobs', id] });
    toast({ title: 'Success', description: 'Job status updated.' });
  },
  onError: (error: any) => {
    toast({
      title: 'Error',
      description: error?.data?.message || 'Failed to update status.',
    });
  },
});

  return {
    jobs,
    job,
    isJobsLoading,
    isJobLoading,
    isJobError,

    createJob,
    updateJob,
    deleteJob,
    changeJobStatus,

    isCreating, 
    isUpdating,
    isDeleting,
    isChangingStatus,

  };
};
