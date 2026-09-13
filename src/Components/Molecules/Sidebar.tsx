import React, { useState } from "react";
import { Box, Typography, Button, IconButton, Dialog, DialogTitle, DialogContent, DialogActions, TextField } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import SearchIcon from "@mui/icons-material/Search";
import TagIcon from "@mui/icons-material/Tag";
import FolderOutlinedIcon from "@mui/icons-material/FolderOutlined";
import type { Project } from "../../service/TaskService";

interface SidebarProps {
  projects: Project[];
  activeProjectId: number;
  onSelectProject: (projectId: number) => void;
  onOpenCreateTask: () => void;
  onOpenGlobalSearch: () => void;
  onAddProject: (name: string, color: string) => void;
  tasksCountMap: Record<number, number>;
}

const PROJECT_COLOR_PRESETS = [
  "#e44232", // Todoist Red
  "#3b82f6", // Blue
  "#f59e0b", // Amber
  "#10b981", // Green
  "#8b5cf6", // Purple
  "#ec4899", // Pink
];

export const Sidebar: React.FC<SidebarProps> = ({
  projects,
  activeProjectId,
  onSelectProject,
  onOpenCreateTask,
  onOpenGlobalSearch,
  onAddProject,
  tasksCountMap,
}) => {
  const [isAddProjectOpen, setIsAddProjectOpen] = useState(false);
  const [newProjectName, setNewProjectName] = useState("");
  const [newProjectColor, setNewProjectColor] = useState("#e44232");

  const handleCreateProjectSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProjectName.trim()) return;
    onAddProject(newProjectName.trim(), newProjectColor);
    setNewProjectName("");
    setIsAddProjectOpen(false);
  };

  return (
    <Box
      sx={{
        width: 240,
        minWidth: 240,
        height: "100vh",
        backgroundColor: "#212121",
        borderRight: "1px solid #2e2e2e",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        p: 1.5,
        boxSizing: "border-box",
      }}
    >
      <Box>
        {/* Main Brand Title */}
        <Box sx={{ mb: 2, pt: 1, px: 1, display: "flex", alignItems: "center", gap: 1 }}>
          <FolderOutlinedIcon sx={{ color: "#e44232", fontSize: 22 }} />
          <Typography
            variant="h6"
            sx={{ fontWeight: 800, color: "#ffffff", fontSize: "1.1rem", letterSpacing: "-0.02em" }}
          >
            Todoist Projects
          </Typography>
        </Box>

        {/* Add task button */}
        <Button
          fullWidth
          startIcon={<AddIcon sx={{ color: "#e44232", fontSize: 20 }} />}
          onClick={onOpenCreateTask}
          sx={{
            mb: 1.5,
            color: "#e44232",
            backgroundColor: "transparent",
            borderRadius: "8px",
            textTransform: "none",
            fontWeight: 600,
            fontSize: "0.9rem",
            justifyContent: "flex-start",
            py: 0.8,
            px: 1.5,
            "&:hover": {
              backgroundColor: "rgba(228, 66, 50, 0.1)",
            },
          }}
        >
          Add task
        </Button>

        {/* Global Search across all projects */}
        <Button
          fullWidth
          startIcon={<SearchIcon sx={{ color: "#888888", fontSize: 18 }} />}
          onClick={onOpenGlobalSearch}
          sx={{
            mb: 2,
            justifyContent: "flex-start",
            textTransform: "none",
            color: "#d0d0d0",
            borderRadius: "6px",
            px: 1.5,
            py: 0.7,
            fontSize: "0.875rem",
            fontWeight: 400,
            "&:hover": { backgroundColor: "rgba(255, 255, 255, 0.08)", color: "#ffffff" },
          }}
        >
          Global Search
        </Button>

        {/* My Projects Section */}
        <Box sx={{ mt: 1 }}>
          <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", px: 1.5, mb: 1 }}>
            <Typography
              variant="caption"
              sx={{ color: "#888888", fontWeight: 700, fontSize: "0.75rem", letterSpacing: "0.02em" }}
            >
              My Projects ({projects.length})
            </Typography>
            <IconButton
              size="small"
              onClick={() => setIsAddProjectOpen(true)}
              sx={{ color: "#888888", p: 0.2, "&:hover": { color: "#ffffff" } }}
            >
              <AddIcon fontSize="small" />
            </IconButton>
          </Box>

          {/* List of Projects */}
          <Box sx={{ display: "flex", flexDirection: "column", gap: 0.3 }}>
            {projects.map((proj) => {
              const isSelected = activeProjectId === proj.id;
              const count = tasksCountMap[proj.id] || 0;
              const color = proj.color || "#e44232";

              return (
                <Button
                  key={proj.id}
                  fullWidth
                  onClick={() => onSelectProject(proj.id)}
                  sx={{
                    justifyContent: "space-between",
                    textTransform: "none",
                    color: isSelected ? "#ffffff" : "#d0d0d0",
                    backgroundColor: isSelected ? "rgba(255, 255, 255, 0.08)" : "transparent",
                    borderRadius: "6px",
                    px: 1.5,
                    py: 0.8,
                    fontSize: "0.875rem",
                    fontWeight: isSelected ? 600 : 400,
                    "&:hover": { backgroundColor: "rgba(255, 255, 255, 0.08)", color: "#ffffff" },
                  }}
                >
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <TagIcon sx={{ color, fontSize: 16 }} />
                    <span>{proj.name}</span>
                  </Box>
                  <Typography variant="caption" sx={{ color: "#888888" }}>
                    {count}
                  </Typography>
                </Button>
              );
            })}
          </Box>
        </Box>
      </Box>

      {/* Add Project Modal */}
      <Dialog
        open={isAddProjectOpen}
        onClose={() => setIsAddProjectOpen(false)}
        fullWidth
        maxWidth="xs"
        slotProps={{
          paper: {
            sx: {
              backgroundColor: "#1c1c1c",
              color: "#ffffff",
              borderRadius: "14px",
              border: "1px solid #333333",
            },
          },
        }}
      >
        <form onSubmit={handleCreateProjectSubmit}>
          <DialogTitle sx={{ fontWeight: 700 }}>New Project</DialogTitle>
          <DialogContent sx={{ display: "flex", flexDirection: "column", gap: 2, pt: 1 }}>
            <TextField
              autoFocus
              placeholder="Project Name (e.g. Work & Study)"
              value={newProjectName}
              onChange={(e) => setNewProjectName(e.target.value)}
              fullWidth
              required
              variant="outlined"
              sx={{
                "& .MuiOutlinedInput-root": {
                  color: "#ffffff",
                  backgroundColor: "#161616",
                  borderRadius: "8px",
                  "& fieldset": { borderColor: "#333333" },
                },
              }}
            />

            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <Typography variant="caption" sx={{ color: "#888888" }}>
                Color:
              </Typography>
              {PROJECT_COLOR_PRESETS.map((col) => (
                <Box
                  key={col}
                  onClick={() => setNewProjectColor(col)}
                  sx={{
                    width: 22,
                    height: 22,
                    borderRadius: "50%",
                    backgroundColor: col,
                    cursor: "pointer",
                    border: newProjectColor === col ? "2px solid #ffffff" : "2px solid transparent",
                    transform: newProjectColor === col ? "scale(1.15)" : "scale(1)",
                    transition: "all 0.15s ease",
                  }}
                />
              ))}
            </Box>
          </DialogContent>
          <DialogActions sx={{ p: 2 }}>
            <Button onClick={() => setIsAddProjectOpen(false)} sx={{ color: "#888888", textTransform: "none" }}>
              Cancel
            </Button>
            <Button
              type="submit"
              variant="contained"
              disabled={!newProjectName.trim()}
              sx={{
                backgroundColor: "#e44232",
                color: "#ffffff",
                fontWeight: 600,
                textTransform: "none",
                "&:hover": { backgroundColor: "#d1453b" },
              }}
            >
              Add Project
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </Box>
  );
};

export default Sidebar;
