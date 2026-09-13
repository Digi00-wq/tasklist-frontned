import React, { useEffect, useState, useCallback, useMemo } from "react";
import { Box, CircularProgress, Alert, Button, Typography, Paper } from "@mui/material";
import FolderOutlinedIcon from "@mui/icons-material/FolderOutlined";
import AddIcon from "@mui/icons-material/Add";
import Sidebar from "../Molecules/Sidebar";
import TopBar from "../Molecules/TopBar";
import LabelColumn from "../Molecules/LabelColumn";
import TaskModal from "../Molecules/TaskModal";
import LabelModal from "../Molecules/LabelModal";
import TaskDetailModal from "../Molecules/TaskDetailModal";
import ColumnModal from "../Molecules/ColumnModal";

import GlobalSearchPage from "./GlobalSearchPage";
import TodayPage from "./TodayPage";
import LabelsPage from "./LabelsPage";

import {
  TaskService,
  getDefaultTabsForProject,
  type Task,
  type Label,
  type Project,
  type ProjectTab,
  type CreateTaskDTO,
} from "../../service/TaskService";

export const TasklistPage: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [activeProjectId, setActiveProjectId] = useState<number | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isBackendConnected, setIsBackendConnected] = useState<boolean>(false);

  // View Navigation ("board" | "today" | "labels" | "global-search")
  const [activeView, setActiveView] = useState<string>("board");
  const [searchQuery, setSearchQuery] = useState("");

  // Modal States
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [defaultStatusTabForNewTask, setDefaultStatusTabForNewTask] = useState<string | null>(null);
  const [isLabelModalOpen, setIsLabelModalOpen] = useState(false);
  const [selectedDetailTask, setSelectedDetailTask] = useState<Task | null>(null);

  // Active Project (strictly computed from state)
  const activeProject = useMemo(() => {
    if (projects.length === 0) return null;
    return projects.find((p) => p.id === activeProjectId) || projects[0];
  }, [projects, activeProjectId]);

  // Tasks belonging to active project
  const activeProjectTasks = useMemo(() => {
    if (!activeProject) return [];
    return tasks.filter((t) => Number(t.projectId) === Number(activeProject.id));
  }, [tasks, activeProject]);

  // Map of task count per project
  const tasksCountMap = useMemo(() => {
    const map: Record<number, number> = {};
    tasks.forEach((t) => {
      if (t.projectId) {
        map[t.projectId] = (map[t.projectId] || 0) + 1;
      }
    });
    return map;
  }, [tasks]);

  // Fetch Data from Backend
  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const service = TaskService();
      const [fetchedProjects, fetchedTasks] = await Promise.all([
        service.getProjects().catch((err) => {
          console.warn("Error fetching projects:", err);
          return null;
        }),
        service.getTasks().catch((err) => {
          console.warn("Error fetching tasks:", err);
          return null;
        }),
      ]);

      if (Array.isArray(fetchedProjects)) {
        setProjects(fetchedProjects);
        if (fetchedProjects.length > 0 && !activeProjectId) {
          setActiveProjectId(fetchedProjects[0].id);
        }
      }

      if (Array.isArray(fetchedTasks)) {
        setTasks(fetchedTasks);
      }

      setIsBackendConnected(true);
    } catch (err: any) {
      console.warn("Backend connection failed:", err);
      setIsBackendConnected(false);
      setError("Keine Verbindung zum Spring Boot Backend (http://192.168.1.169:8080/api/).");
    } finally {
      setLoading(false);
    }
  }, [activeProjectId]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Project Actions
  const handleSelectProject = (projId: number) => {
    setActiveProjectId(projId);
    setActiveView("board");
    setSearchQuery("");
  };

  const handleAddProject = async (name: string, color: string) => {
    const defaultTabs = getDefaultTabsForProject(color);
    const tempId = Date.now();
    const newProj: Project = {
      id: tempId,
      name,
      color,
      tabs: defaultTabs,
      labels: [],
    };

    setProjects((prev) => [...prev, newProj]);
    setActiveProjectId(tempId);
    setActiveView("board");

    if (isBackendConnected) {
      try {
        const created = await TaskService().createProject({ name, color, tabs: defaultTabs });
        if (created && created.id) {
          setProjects((prev) => prev.map((p) => (p.id === tempId ? created : p)));
          setActiveProjectId(created.id);
        }
      } catch (err) {
        console.error("Fehler beim Erstellen des Projekts:", err);
      }
    }
  };

  const handleEditProject = async (projId: number, name: string, color: string) => {
    setProjects((prev) =>
      prev.map((p) => (p.id === projId ? { ...p, name, color } : p))
    );

    if (isBackendConnected) {
      try {
        await TaskService().updateProject(projId, { name, color });
      } catch (err) {
        console.error("Fehler beim Bearbeiten des Projekts:", err);
      }
    }
  };

  const handleDeleteProject = async (projId: number) => {
    if (projects.length <= 1) {
      alert("Es muss mindestens 1 Projekt existieren.");
      return;
    }

    const nextProjects = projects.filter((p) => p.id !== projId);
    setProjects(nextProjects);

    if (activeProjectId === projId) {
      setActiveProjectId(nextProjects[0]?.id || null);
    }

    if (isBackendConnected) {
      try {
        await TaskService().deleteProject(projId);
      } catch (err) {
        console.error("Fehler beim Löschen des Projekts:", err);
      }
    }
  };

  // Task Actions
  const handleToggleTaskComplete = async (task: Task) => {
    const newCompleted = !task.completed;
    setTasks((prev) =>
      prev.map((t) => (t.id === task.id ? { ...t, completed: newCompleted } : t))
    );

    if (selectedDetailTask?.id === task.id) {
      setSelectedDetailTask((prev) => (prev ? { ...prev, completed: newCompleted } : null));
    }

    if (isBackendConnected) {
      try {
        await TaskService().toggleTask(task.id, newCompleted, task);
      } catch (err) {
        console.error("Fehler beim Aktualisieren:", err);
        setTasks((prev) =>
          prev.map((t) => (t.id === task.id ? { ...t, completed: task.completed } : t))
        );
      }
    }
  };

  const handleDeleteTask = async (taskId: number) => {
    const previous = [...tasks];
    setTasks((prev) => prev.filter((t) => t.id !== taskId));

    if (selectedDetailTask?.id === taskId) {
      setSelectedDetailTask(null);
    }

    if (isBackendConnected) {
      try {
        await TaskService().deleteTask(taskId);
      } catch (err) {
        console.error("Fehler beim Löschen:", err);
        setTasks(previous);
      }
    }
  };

  const handleUpdateTask = async (updated: Task) => {
    setTasks((prev) => prev.map((t) => (t.id === updated.id ? updated : t)));
    setSelectedDetailTask(updated);

    if (isBackendConnected) {
      try {
        await TaskService().updateTask(updated.id, updated);
      } catch (err) {
        console.error("Fehler beim Speichern:", err);
      }
    }
  };

  const handleSaveTask = async (dto: CreateTaskDTO, editingTaskId?: number) => {
    const targetProjId = activeProject ? activeProject.id : 1;

    if (editingTaskId) {
      const updatedTask: Task = {
        id: editingTaskId,
        name: dto.name,
        description: dto.description || null,
        completed: editingTask?.completed ?? false,
        timestamp: editingTask?.timestamp || new Date().toISOString(),
        projectId: editingTask?.projectId || targetProjId,
        statusTab: editingTask?.statusTab || "not_started",
        labels: dto.labels || [],
      };

      setTasks((prev) => prev.map((t) => (t.id === editingTaskId ? updatedTask : t)));

      if (isBackendConnected) {
        try {
          await TaskService().updateTask(editingTaskId, updatedTask);
        } catch (err) {
          console.error("Fehler beim Speichern:", err);
        }
      }
    } else {
      const tempId = Date.now();
      const newTask: Task = {
        id: tempId,
        name: dto.name,
        description: dto.description || null,
        completed: dto.completed ?? false,
        timestamp: new Date().toISOString(),
        projectId: targetProjId,
        statusTab: defaultStatusTabForNewTask || activeProject?.tabs[0]?.id || "not_started",
        labels: dto.labels || [],
      };

      setTasks((prev) => [newTask, ...prev]);

      if (isBackendConnected) {
        try {
          const created = await TaskService().createTask({ ...dto, projectId: targetProjId });
          if (created && created.id) {
            setTasks((prev) => prev.map((t) => (t.id === tempId ? created : t)));
          }
        } catch (err) {
          console.error("Fehler beim Erstellen:", err);
        }
      }
    }

    setEditingTask(null);
    setDefaultStatusTabForNewTask(null);
  };

  // Label Actions inside active project
  const handleCreateLabel = async (name: string, color: string) => {
    if (!activeProject) return;
    const tempLabel: Label = { id: Date.now(), name, color, projectId: activeProject.id };

    setProjects((prev) =>
      prev.map((p) =>
        p.id === activeProject.id ? { ...p, labels: [...(p.labels || []), tempLabel] } : p
      )
    );

    if (isBackendConnected) {
      try {
        await TaskService().createLabel({ name, color, projectId: activeProject.id });
      } catch (err) {
        console.error("Fehler beim Erstellen des Labels:", err);
      }
    }
  };

  const handleDeleteLabel = async (id: number) => {
    if (!activeProject) return;
    setProjects((prev) =>
      prev.map((p) =>
        p.id === activeProject.id
          ? { ...p, labels: p.labels.filter((l) => l.id !== id) }
          : p
      )
    );
    setTasks((prev) =>
      prev.map((t) => ({
        ...t,
        labels: t.labels.filter((l) => l.id !== id),
      }))
    );

    if (isBackendConnected) {
      try {
        await TaskService().deleteLabel(id);
      } catch (err) {
        console.error("Fehler beim Löschen des Labels:", err);
      }
    }
  };
  // Column Modal States
  const [isColumnModalOpen, setIsColumnModalOpen] = useState(false);
  const [editingColumn, setEditingColumn] = useState<ProjectTab | null>(null);

  // Drag & Drop Task Handler
  const handleDropTask = async (taskId: number, targetTabId: string) => {
    if (!activeProject) return;

    const projectTabs =
      activeProject.tabs && activeProject.tabs.length > 0
        ? activeProject.tabs
        : getDefaultTabsForProject(activeProject.color);

    const targetTab = projectTabs.find((t) => t.id === targetTabId);
    const isCompletedTab =
      targetTabId === "completed" ||
      targetTabId === "finished" ||
      targetTab?.name.toLowerCase().includes("completed") ||
      targetTab?.name.toLowerCase().includes("finished");

    setTasks((prev) =>
      prev.map((t) =>
        t.id === taskId
          ? {
              ...t,
              statusTab: targetTabId,
              completed: Boolean(isCompletedTab),
            }
          : t
      )
    );

    if (isBackendConnected) {
      try {
        await TaskService().updateTask(taskId, {
          statusTab: targetTabId,
          completed: Boolean(isCompletedTab),
        });
      } catch (err) {
        console.error("Fehler beim Verschieben des Tasks:", err);
      }
    }
  };

  // Column Actions
  const handleOpenAddColumn = () => {
    setEditingColumn(null);
    setIsColumnModalOpen(true);
  };

  const handleOpenEditColumn = (tab: ProjectTab) => {
    setEditingColumn(tab);
    setIsColumnModalOpen(true);
  };

  const handleSaveColumn = async (colData: { id?: string; name: string; subtitle?: string; color?: string }) => {
    if (!activeProject) return;

    const currentTabs =
      activeProject.tabs && activeProject.tabs.length > 0
        ? [...activeProject.tabs]
        : getDefaultTabsForProject(activeProject.color);

    let updatedTabs: ProjectTab[];

    if (colData.id) {
      updatedTabs = currentTabs.map((t) =>
        t.id === colData.id
          ? { ...t, name: colData.name, subtitle: colData.subtitle, color: colData.color }
          : t
      );
    } else {
      const newTabId = colData.name.toLowerCase().replace(/[^a-z0-9]/g, "_") + "_" + Date.now();
      const newTab: ProjectTab = {
        id: newTabId,
        name: colData.name,
        subtitle: colData.subtitle,
        color: colData.color || "#e44232",
      };
      updatedTabs = [...currentTabs, newTab];
    }

    setProjects((prev) =>
      prev.map((p) => (p.id === activeProject.id ? { ...p, tabs: updatedTabs } : p))
    );

    if (isBackendConnected) {
      try {
        await TaskService().updateProject(activeProject.id, { tabs: updatedTabs });
      } catch (err) {
        console.error("Fehler beim Speichern der Spalte:", err);
      }
    }
  };

  const handleMoveColumn = async (tabId: string, direction: "left" | "right") => {
    if (!activeProject) return;

    const currentTabs =
      activeProject.tabs && activeProject.tabs.length > 0
        ? [...activeProject.tabs]
        : getDefaultTabsForProject(activeProject.color);

    const index = currentTabs.findIndex((t) => t.id === tabId);
    if (index === -1) return;

    const newIndex = direction === "left" ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= currentTabs.length) return;

    const updatedTabs = [...currentTabs];
    const [movedTab] = updatedTabs.splice(index, 1);
    updatedTabs.splice(newIndex, 0, movedTab);

    setProjects((prev) =>
      prev.map((p) => (p.id === activeProject.id ? { ...p, tabs: updatedTabs } : p))
    );

    if (isBackendConnected) {
      try {
        await TaskService().updateProject(activeProject.id, { tabs: updatedTabs });
      } catch (err) {
        console.error("Fehler beim Reorganisieren der Spalten:", err);
      }
    }
  };

  const handleDeleteColumn = async (tabId: string) => {
    if (!activeProject) return;

    const currentTabs =
      activeProject.tabs && activeProject.tabs.length > 0
        ? [...activeProject.tabs]
        : getDefaultTabsForProject(activeProject.color);

    if (currentTabs.length <= 1) {
      alert("Ein Projekt muss mindestens 1 Spalte enthalten.");
      return;
    }

    const updatedTabs = currentTabs.filter((t) => t.id !== tabId);

    setProjects((prev) =>
      prev.map((p) => (p.id === activeProject.id ? { ...p, tabs: updatedTabs } : p))
    );

    if (isBackendConnected) {
      try {
        await TaskService().updateProject(activeProject.id, { tabs: updatedTabs });
      } catch (err) {
        console.error("Fehler beim Löschen der Spalte:", err);
      }
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        width: "100vw",
        height: "100vh",
        backgroundColor: "#161616",
        overflow: "hidden",
      }}
    >
      {/* Sidebar Navigation */}
      <Sidebar
        projects={projects}
        activeProjectId={activeProject ? activeProject.id : 0}
        onSelectProject={handleSelectProject}
        onOpenCreateTask={() => {
          setEditingTask(null);
          setDefaultStatusTabForNewTask(null);
          setIsTaskModalOpen(true);
        }}
        onOpenGlobalSearch={() => setActiveView("global-search")}
        onAddProject={handleAddProject}
        onEditProject={handleEditProject}
        onDeleteProject={handleDeleteProject}
        tasksCountMap={tasksCountMap}
      />

      {/* Main View Area */}
      <Box
        sx={{
          flexGrow: 1,
          display: "flex",
          flexDirection: "column",
          height: "100vh",
          overflow: "hidden",
        }}
      >
        {activeView === "global-search" ? (
          /* Global Search across ALL projects */
          <GlobalSearchPage
            projects={projects}
            tasks={tasks}
            onToggleComplete={handleToggleTaskComplete}
            onDeleteTask={handleDeleteTask}
            onOpenDetail={(t) => setSelectedDetailTask(t)}
          />
        ) : !activeProject ? (
          /* Empty State when no projects exist in Backend */
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              height: "100%",
              p: 4,
            }}
          >
            {loading ? (
              <CircularProgress sx={{ color: "#ffffff" }} />
            ) : (
              <Paper
                sx={{
                  p: 6,
                  textAlign: "center",
                  backgroundColor: "#222222",
                  border: "1px border #333333",
                  borderRadius: "16px",
                  maxWidth: 480,
                }}
              >
                <FolderOutlinedIcon sx={{ fontSize: 56, color: "#e44232", mb: 2 }} />
                <Typography variant="h5" sx={{ color: "#ffffff", fontWeight: 700, mb: 1 }}>
                  No Projects Available
                </Typography>
                <Typography variant="body2" sx={{ color: "#888888", mb: 3 }}>
                  Your backend currently has 0 projects. Create a project to start organizing tasks into board columns!
                </Typography>
                <Button
                  variant="contained"
                  startIcon={<AddIcon />}
                  onClick={() => handleAddProject("New Project", "#e44232")}
                  sx={{
                    backgroundColor: "#e44232",
                    color: "#ffffff",
                    fontWeight: 600,
                    textTransform: "none",
                    borderRadius: "8px",
                    px: 3,
                    py: 1,
                    "&:hover": { backgroundColor: "#d1453b" },
                  }}
                >
                  Create First Project
                </Button>
              </Paper>
            )}
          </Box>
        ) : (
          /* Views scoped inside Active Project */
          <>
            <TopBar
              projectName={activeProject.name}
              projectColor={activeProject.color}
              activeView={activeView}
              onSelectView={(v) => setActiveView(v)}
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
            />

            {error && !isBackendConnected && (
              <Box sx={{ px: 5, mb: 1 }}>
                <Alert
                  severity="warning"
                  sx={{
                    backgroundColor: "#222222",
                    color: "#f59e0b",
                    border: "1px solid #333333",
                    borderRadius: "8px",
                  }}
                >
                  {error}
                </Alert>
              </Box>
            )}

            {activeView === "today" ? (
              <TodayPage
                tasks={activeProjectTasks}
                onToggleComplete={handleToggleTaskComplete}
                onDeleteTask={handleDeleteTask}
                onOpenDetail={(t) => setSelectedDetailTask(t)}
              />
            ) : activeView === "labels" ? (
              <LabelsPage
                labels={activeProject.labels || []}
                tasks={activeProjectTasks}
                onToggleComplete={handleToggleTaskComplete}
                onDeleteTask={handleDeleteTask}
                onOpenDetail={(t) => setSelectedDetailTask(t)}
                onOpenManageLabels={() => setIsLabelModalOpen(true)}
              />
            ) : (
              /* Board View: Columns grouped by Project Tabs */
              <Box
                sx={{
                  flexGrow: 1,
                  px: 5,
                  pb: 4,
                  display: "flex",
                  gap: 4,
                  overflowX: "auto",
                  alignItems: "flex-start",
                  "&::-webkit-scrollbar": { height: 6 },
                  "&::-webkit-scrollbar-thumb": { backgroundColor: "#333333", borderRadius: 3 },
                }}
              >
                {loading ? (
                  <Box sx={{ display: "flex", justifyContent: "center", width: "100%", py: 10 }}>
                    <CircularProgress sx={{ color: "#ffffff" }} />
                  </Box>
                ) : (
                  (() => {
                    const projectTabs =
                      activeProject.tabs && activeProject.tabs.length > 0
                        ? activeProject.tabs
                        : getDefaultTabsForProject(activeProject.color);
                    const tabIds = projectTabs.map((t) => t.id);

                    return (
                      <>
                        {projectTabs.map((tab, idx) => {
                          const tabTasks = activeProjectTasks.filter((t) => {
                            let matchesTab = t.statusTab === tab.id;

                            if (!matchesTab && t.completed) {
                              matchesTab =
                                tab.id === "completed" ||
                                tab.id === "finished" ||
                                tab.name.toLowerCase().includes("completed") ||
                                tab.name.toLowerCase().includes("finished");
                            }

                            if (!matchesTab && !t.completed) {
                              const hasValidTab = t.statusTab && tabIds.includes(t.statusTab);
                              if (!hasValidTab && tab.id === projectTabs[0]?.id) {
                                matchesTab = true;
                              }
                            }

                            if (!matchesTab) return false;
                            if (searchQuery.trim()) {
                              const q = searchQuery.toLowerCase();
                              return (
                                t.name.toLowerCase().includes(q) ||
                                t.description?.toLowerCase().includes(q) ||
                                t.labels?.some((l) => l.name.toLowerCase().includes(q))
                              );
                            }
                            return true;
                          });

                          return (
                            <LabelColumn
                              key={tab.id}
                              tab={tab}
                              tasks={tabTasks}
                              onToggleComplete={handleToggleTaskComplete}
                              onDeleteTask={handleDeleteTask}
                              onEditTask={(t) => setSelectedDetailTask(t)}
                              onAddTaskToLabel={() => {
                                setEditingTask(null);
                                setDefaultStatusTabForNewTask(tab.id);
                                setIsTaskModalOpen(true);
                              }}
                              onDropTask={handleDropTask}
                              onEditColumn={handleOpenEditColumn}
                              onMoveColumn={handleMoveColumn}
                              onDeleteColumn={handleDeleteColumn}
                              isFirstColumn={idx === 0}
                              isLastColumn={idx === projectTabs.length - 1}
                            />
                          );
                        })}

                        {/* Add Column Button Card */}
                        <Box
                          onClick={handleOpenAddColumn}
                          sx={{
                            width: 240,
                            minWidth: 220,
                            height: 100,
                            borderRadius: "12px",
                            border: "2px dashed #333333",
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            justifyContent: "center",
                            cursor: "pointer",
                            color: "#888888",
                            transition: "all 0.15s ease",
                            mt: 0.5,
                            "&:hover": {
                              borderColor: "#e44232",
                              color: "#ffffff",
                              backgroundColor: "rgba(228, 66, 50, 0.05)",
                            },
                          }}
                        >
                          <AddIcon sx={{ fontSize: 28, mb: 0.5 }} />
                          <Typography variant="body2" sx={{ fontWeight: 600 }}>
                            Add Column
                          </Typography>
                        </Box>
                      </>
                    );
                  })()
                )}
              </Box>
            )}
          </>
        )}
      </Box>

      {/* Task Modal */}
      <TaskModal
        open={isTaskModalOpen}
        onClose={() => {
          setIsTaskModalOpen(false);
          setEditingTask(null);
          setDefaultStatusTabForNewTask(null);
        }}
        onSaveTask={handleSaveTask}
        availableLabels={activeProject?.labels || []}
        editingTask={editingTask}
      />

      {/* Label Modal */}
      <LabelModal
        open={isLabelModalOpen}
        onClose={() => setIsLabelModalOpen(false)}
        labels={activeProject?.labels || []}
        onCreateLabel={handleCreateLabel}
        onDeleteLabel={handleDeleteLabel}
      />

      {/* Column Modal */}
      <ColumnModal
        open={isColumnModalOpen}
        onClose={() => {
          setIsColumnModalOpen(false);
          setEditingColumn(null);
        }}
        onSaveColumn={handleSaveColumn}
        editingColumn={editingColumn}
      />

      {/* Task Detail Fullscreen Modal */}
      <TaskDetailModal
        open={Boolean(selectedDetailTask)}
        onClose={() => setSelectedDetailTask(null)}
        task={selectedDetailTask}
        onToggleComplete={handleToggleTaskComplete}
        onUpdateTask={handleUpdateTask}
        onDeleteTask={handleDeleteTask}
        availableLabels={activeProject?.labels || []}
        projectName={activeProject?.name}
      />
    </Box>
  );
};

export default TasklistPage;
