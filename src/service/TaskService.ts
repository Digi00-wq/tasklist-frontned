import type { AxiosInstance } from "axios";
import { TaskApi } from "./Api";
import axios from "axios";

export interface Label {
  id: number;
  name: string;
  color?: string;
  projectId?: number;
}

export interface ProjectTab {
  id: string;
  name: string;
  color?: string;
  subtitle?: string;
}

export interface Project {
  id: number;
  name: string;
  color?: string;
  tabs: ProjectTab[];
  labels: Label[];
}

export interface Task {
  id: number;
  name: string;
  description: string | null;
  completed: boolean;
  timestamp: string;
  projectId: number;
  statusTab: string;
  labels: Label[];
}

export interface CreateTaskDTO {
  name: string;
  description?: string | null;
  completed?: boolean;
  projectId?: number;
  statusTab?: string;
  labels?: Label[];
}

export interface CreateLabelDTO {
  name: string;
  color: string;
  projectId?: number;
}

export interface CreateProjectDTO {
  name: string;
  color?: string;
  tabs?: ProjectTab[];
}

// Default tabs generator for projects that have no custom tabs configured
export const getDefaultTabsForProject = (projectColor?: string): ProjectTab[] => [
  { id: "not_started", name: "Not begun", color: projectColor || "#e5484d", subtitle: "General ideas and tasks" },
  { id: "started", name: "Started", color: "#3b82f6", subtitle: "In progress tasks" },
  { id: "completed", name: "Finished", color: "#777777", subtitle: "Finished tasks" },
];

export const TaskService = (api: AxiosInstance = TaskApi) => ({
  // Projects API
  getProjects: async (): Promise<Project[]> => {
    try {
      const response = await api.get("projects");
      const data = response.data;
      if (Array.isArray(data)) {
        return data.map((p: any) => ({
          ...p,
          tabs: p.tabs && p.tabs.length > 0 ? p.tabs : getDefaultTabsForProject(p.color),
          labels: p.labels || [],
        }));
      }
      return [];
    } catch (error) {
      handleUnauthorized(error);
      throw error;
    }
  },

  createProject: async (dto: CreateProjectDTO): Promise<Project> => {
    try {
      const payload = {
        ...dto,
        tabs: dto.tabs && dto.tabs.length > 0 ? dto.tabs : getDefaultTabsForProject(dto.color),
      };
      const response = await api.post("projects", payload);
      const data = response.data;
      return {
        ...data,
        tabs: data.tabs && data.tabs.length > 0 ? data.tabs : getDefaultTabsForProject(data.color),
        labels: data.labels || [],
      };
    } catch (error) {
      handleUnauthorized(error);
      throw error;
    }
  },

  deleteProject: async (id: number): Promise<void> => {
    try {
      await api.delete(`projects/${id}`);
    } catch (error) {
      handleUnauthorized(error);
      throw error;
    }
  },

  updateProject: async (id: number, dto: Partial<CreateProjectDTO>): Promise<Project> => {
    try {
      const response = await api.put(`projects/${id}`, dto);
      const data = response.data;
      return {
        ...data,
        tabs: data.tabs && data.tabs.length > 0 ? data.tabs : getDefaultTabsForProject(data.color),
        labels: data.labels || [],
      };
    } catch (error) {
      handleUnauthorized(error);
      throw error;
    }
  },

  // Tasks API
  getTasks: async (projectId?: number): Promise<Task[]> => {
    try {
      const url = projectId ? `tasks?projectId=${projectId}` : "tasks";
      const response = await api.get(url);
      return Array.isArray(response.data) ? response.data : [];
    } catch (error) {
      handleUnauthorized(error);
      throw error;
    }
  },

  createTask: async (task: CreateTaskDTO): Promise<Task> => {
    try {
      const payload = {
        name: task.name,
        description: task.description || null,
        completed: task.completed ?? false,
        timestamp: new Date().toISOString(),
        projectId: task.projectId || 1,
        statusTab: task.statusTab || "not_started",
        labels: task.labels || [],
      };
      const response = await api.post("tasks", payload);
      return response.data;
    } catch (error) {
      handleUnauthorized(error);
      throw error;
    }
  },

  updateTask: async (id: number, task: Partial<Task>): Promise<Task> => {
    try {
      const response = await api.put(`tasks/${id}`, task).catch(async (err) => {
        if (err.response?.status === 405) {
          return await api.patch(`tasks/${id}`, task);
        }
        throw err;
      });
      return response.data;
    } catch (error) {
      handleUnauthorized(error);
      throw error;
    }
  },

  toggleTask: async (id: number, completed: boolean, currentTask?: Task): Promise<Task> => {
    try {
      const response = await api.patch(`tasks/${id}/complete?completed=${completed}`).catch(async () => {
        if (currentTask) {
          return { data: await TaskService(api).updateTask(id, { ...currentTask, completed }) };
        }
        return await api.patch(`tasks/${id}`, { completed });
      });
      return response.data;
    } catch (error) {
      handleUnauthorized(error);
      throw error;
    }
  },

  deleteTask: async (id: number): Promise<void> => {
    try {
      await api.delete(`tasks/${id}`);
    } catch (error) {
      handleUnauthorized(error);
      throw error;
    }
  },

  // Labels API
  getLabels: async (projectId?: number): Promise<Label[]> => {
    try {
      const url = projectId ? `labels?projectId=${projectId}` : "labels";
      const response = await api.get(url);
      return Array.isArray(response.data) ? response.data : [];
    } catch (error) {
      handleUnauthorized(error);
      throw error;
    }
  },

  createLabel: async (label: CreateLabelDTO): Promise<Label> => {
    try {
      const response = await api.post("labels", label);
      return response.data;
    } catch (error) {
      handleUnauthorized(error);
      throw error;
    }
  },

  deleteLabel: async (id: number): Promise<void> => {
    try {
      await api.delete(`labels/${id}`);
    } catch (error) {
      handleUnauthorized(error);
      throw error;
    }
  },
});

function handleUnauthorized(error: unknown) {
  if (
    axios.isAxiosError(error) &&
    error.response &&
    error.response.status === 401
  ) {
    console.warn("Unauthorized request (401)");
  }
}
