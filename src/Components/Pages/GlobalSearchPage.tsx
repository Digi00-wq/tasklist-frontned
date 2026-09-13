import React, { useState, useMemo } from "react";
import { Box, Typography, TextField, InputAdornment } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import TagIcon from "@mui/icons-material/Tag";
import TaskCard from "../Atoms/TaskCard";
import type { Task, Project } from "../../service/TaskService";

interface GlobalSearchPageProps {
  projects: Project[];
  tasks: Task[];
  onToggleComplete: (task: Task) => void;
  onDeleteTask: (taskId: number) => void;
  onOpenDetail: (task: Task) => void;
}

export const GlobalSearchPage: React.FC<GlobalSearchPageProps> = ({
  projects,
  tasks,
  onToggleComplete,
  onDeleteTask,
  onOpenDetail,
}) => {
  const [query, setQuery] = useState("");

  const projectMap = useMemo(() => {
    const map = new Map<number, Project>();
    projects.forEach((p) => map.set(p.id, p));
    return map;
  }, [projects]);

  const searchResults = useMemo(() => {
    if (!query.trim()) return tasks;
    const q = query.toLowerCase();

    return tasks.filter((t) => {
      const proj = projectMap.get(t.projectId);
      const nameMatch = t.name.toLowerCase().includes(q);
      const descMatch = t.description?.toLowerCase().includes(q);
      const labelMatch = t.labels?.some((l) => l.name.toLowerCase().includes(q));
      const projMatch = proj?.name.toLowerCase().includes(q);

      return nameMatch || descMatch || labelMatch || projMatch;
    });
  }, [tasks, query, projectMap]);

  return (
    <Box sx={{ flexGrow: 1, p: 4, height: "100vh", overflowY: "auto" }}>
      <Typography variant="h4" sx={{ fontWeight: 700, color: "#ffffff", mb: 1 }}>
        Global Search
      </Typography>

      <Typography variant="body2" sx={{ color: "#888888", mb: 3 }}>
        Search across all {projects.length} projects by task names, descriptions, labels, or project titles.
      </Typography>

      <TextField
        autoFocus
        fullWidth
        placeholder="Type to search everything..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        slotProps={{
          input: {
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon sx={{ color: "#888888", fontSize: 22 }} />
              </InputAdornment>
            ),
          },
        }}
        sx={{
          mb: 4,
          maxWidth: 650,
          "& .MuiOutlinedInput-root": {
            color: "#ffffff",
            backgroundColor: "#222222",
            borderRadius: "12px",
            fontSize: "1rem",
            "& fieldset": { borderColor: "#333333" },
            "&:hover fieldset": { borderColor: "#555555" },
            "&.Mui-focused fieldset": { borderColor: "#e44232" },
          },
        }}
      />

      <Typography variant="body2" sx={{ color: "#888888", mb: 2, fontWeight: 600 }}>
        Matching Tasks ({searchResults.length})
      </Typography>

      <Box sx={{ maxWidth: 650, display: "flex", flexDirection: "column", gap: 1 }}>
        {searchResults.length === 0 ? (
          <Typography variant="body2" sx={{ color: "#666666", fontStyle: "italic", py: 4 }}>
            No matching tasks found across your projects.
          </Typography>
        ) : (
          searchResults.map((task) => {
            const proj = projectMap.get(task.projectId);
            return (
              <Box key={task.id} sx={{ mb: 1 }}>
                {proj && (
                  <Box sx={{ display: "flex", alignItems: "center", gap: 0.5, mb: 0.5, pl: 0.5 }}>
                    <TagIcon sx={{ color: proj.color || "#e44232", fontSize: 14 }} />
                    <Typography variant="caption" sx={{ color: "#888888", fontWeight: 600 }}>
                      {proj.name}
                    </Typography>
                  </Box>
                )}
                <TaskCard
                  task={task}
                  onToggleComplete={onToggleComplete}
                  onDelete={onDeleteTask}
                  onOpenDetail={onOpenDetail}
                />
              </Box>
            );
          })
        )}
      </Box>
    </Box>
  );
};

export default GlobalSearchPage;
