import axios from "axios";
import { auth } from "./firebase";

const client = axios.create({ baseURL: import.meta.env.VITE_API_URL || "http://localhost:8000/api/v1" });

client.interceptors.request.use(async (config) => {
  const token = auth?.currentUser ? await auth.currentUser.getIdToken() : null;
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export const startInterview = (payload) => client.post("/interviews/start", payload).then(({ data }) => data);
export const submitAnswer = (id, payload) => client.post(`/interviews/${id}/answers`, payload).then(({ data }) => data);
export const nextQuestion = (id) => client.post(`/interviews/${id}/next-question`).then(({ data }) => data);
export const finishInterview = (id) => client.post(`/interviews/${id}/finish`).then(({ data }) => data);
export const generateScorecard = (id) => client.post(`/interviews/${id}/scorecard`).then(({ data }) => data);
