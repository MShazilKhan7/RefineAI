import { Layout } from "@/components/layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useLocation } from "wouter";
import { JobStatus } from "@/types/apitypes";
import { ArrowLeft, Loader2 } from "lucide-react";
import { Link } from "wouter";
import { useToast } from "@/hooks/use-toast";
import { useQueryClient } from "@tanstack/react-query";
import { useJobApplication } from "@/hooks/useJobApplication";

const formSchema = z.object({
  companyName: z.string().min(1, "Company name is required"),
  jobTitle: z.string().min(1, "Job title is required"),
  status: z.nativeEnum(JobStatus),
  jobUrl: z.string().url("Must be a valid URL").optional().or(z.literal("")),
  jobDescription: z.string().optional(),
  notes: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

export function CreateJob() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const { createJob, isCreating } = useJobApplication();
  const queryClient = useQueryClient();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      companyName: "",
      jobTitle: "",
      status: JobStatus.APPLIED,
      jobUrl: "",
      jobDescription: "",
      notes: "",
    },
  });

  const onSubmit = (data: FormValues) => {
    createJob(data);
  };

  return (
    <Layout>
      <div className="max-w-2xl mx-auto space-y-6">
        <div>
          <Link
            href="/"
            className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-4 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-1" />
            Back to applications
          </Link>
          <h1 className="text-3xl font-bold tracking-tight">New Application</h1>
          <p className="text-muted-foreground mt-1">
            Track a new job opportunity.
          </p>
        </div>

        <div className="bg-card border border-border/50 rounded-xl p-6 shadow-sm">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="companyName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Company Name</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g. Acme Corp" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="jobTitle"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Job Title</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="e.g. Senior Frontend Engineer"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="status"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Status</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select status" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value={JobStatus.APPLIED}>
                            Applied
                          </SelectItem>
                          <SelectItem value={JobStatus.INTERVIEWING}>
                            Interviewing
                          </SelectItem>
                          <SelectItem value={JobStatus.OFFER}>Offer</SelectItem>
                          <SelectItem value={JobStatus.REJECTED}>
                            Rejected
                          </SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="jobUrl"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Job Posting URL{" "}
                        <span className="text-muted-foreground font-normal">
                          (Optional)
                        </span>
                      </FormLabel>
                      <FormControl>
                        <Input placeholder="https://..." {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="jobDescription"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Job Description{" "}
                      <span className="text-muted-foreground font-normal">
                        (Optional)
                      </span>
                    </FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Paste the job description here. This helps the AI generate better suggestions and interview prep."
                        className="min-h-[150px] resize-y"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="notes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Personal Notes{" "}
                      <span className="text-muted-foreground font-normal">
                        (Optional)
                      </span>
                    </FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Any personal notes about the company, hiring manager, etc."
                        className="min-h-[100px] resize-y"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex justify-end pt-4">
                <Button type="submit" disabled={isCreating} className="w-full sm:w-auto">
                  {isCreating && (
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  )}
                  Save Application
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </div>
    </Layout>
  );
}
