import api from "./api";

export const aiInterviewApi = {
  getQuestions: (jobId: string) =>
    api.get(`ai/interview/${jobId}`).then((res) => res.data),
  generateQuestions: (jobId: string, additionalTopics?: string[]) =>
    api
      .post(`ai/generate/questions/${jobId}`, { additionalTopics })
      .then((res) => res.data),
};
