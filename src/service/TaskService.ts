import type { AxiosInstance } from "axios";
import type { useNavigate } from "react-router-dom";
import { TaskApi } from "./Api";
import axios from "axios";

export interface Label {
  id: number;
  name: string;
}
export interface Task {
  id: number;
  name: string;
  labels: Label[];
}

export const TaskService = (
  //navigate: ReturnType<typeof useNavigate>,
  api: AxiosInstance = TaskApi,
) => ({
  getTasks: async () => {
    try {
      const data = await api.get("tasks");
      return data["data"];
    } catch (error) {
      handleUnauthorized(error /*, navigate*/);
      throw error;
    }
  },
});

function handleUnauthorized(
  error: unknown,
  //navigate: ReturnType<typeof useNavigate>,
) {
  if (
    axios.isAxiosError(error) &&
    error.response &&
    error.response.status === 401
  ) {
    //navigate("/");
  }
}
