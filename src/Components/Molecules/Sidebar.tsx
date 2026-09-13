import React, { useState } from "react";
import {
  Box,
  Typography,
  Button,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Menu,
  MenuItem,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import SearchIcon from "@mui/icons-material/Search";
import TagIcon from "@mui/icons-material/Tag";
import FolderOutlinedIcon from "@mui/icons-material/FolderOutlined";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { type Project, COLOR_PRESETS } from "../../service/TaskService";

interface SidebarProps {
  projects: Project[];
  activeProjectId: number;
  onSelectProject: (projectId: number) => void;
  onOpenCreateTask: () => void;
  onOpenGlobalSearch: () => void;
  onAddProject: (name: string, color: string) => void;
  onEditProject?: (projId: number, name: string, color: string) => void;
  onDeleteProject?: (projId: number) => void;
  tasksCountMap: Record<number, number>;
}



export const Sidebar: React.FC<SidebarProps> = ({
  projects,
  activeProjectId,
  onSelectProject,
  onOpenCreateTask,
  onOpenGlobalSearch,
  onAddProject,
  onEditProject,
  onDeleteProject,
  tasksCountMap,
}) => {
  const [isAddProjectOpen, setIsAddProjectOpen] = useState(false);
  const [newProjectName, setNewProjectName] = useState("");
  const [newProjectColor, setNewProjectColor] = useState("#e44232");

  // Project Menu State
  const [menuAnchorEl, setMenuAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedProjectForMenu, setSelectedProjectForMenu] = useState<Project | null>(null);

  // Edit Project Modal State
  const [isEditProjectOpen, setIsEditProjectOpen] = useState(false);
  const [editProjectName, setEditProjectName] = useState("");
  const [editProjectColor, setEditProjectColor] = useState("#e44232");

  const handleOpenMenu = (e: React.MouseEvent<HTMLButtonElement>, proj: Project) => {
    e.stopPropagation();
    setMenuAnchorEl(e.currentTarget);
    setSelectedProjectForMenu(proj);
  };

  const handleCloseMenu = () => {
    setMenuAnchorEl(null);
  };

  const handleOpenEdit = () => {
    if (selectedProjectForMenu) {
      setEditProjectName(selectedProjectForMenu.name);
      setEditProjectColor(selectedProjectForMenu.color || "#e44232");
      setIsEditProjectOpen(true);
    }
    handleCloseMenu();
  };

  const handleDelete = () => {
    if (selectedProjectForMenu && onDeleteProject) {
      onDeleteProject(selectedProjectForMenu.id);
    }
    handleCloseMenu();
  };

  const handleCreateProjectSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProjectName.trim()) return;
    onAddProject(newProjectName.trim(), newProjectColor);
    setNewProjectName("");
    setIsAddProjectOpen(false);
  };

  const handleEditProjectSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editProjectName.trim() || !selectedProjectForMenu || !onEditProject) return;
    onEditProject(selectedProjectForMenu.id, editProjectName.trim(), editProjectColor);
    setIsEditProjectOpen(false);
    setSelectedProjectForMenu(null);
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
                <Box
                  key={proj.id}
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    borderRadius: "6px",
                    px: 1.2,
                    py: 0.4,
                    backgroundColor: isSelected ? "rgba(255, 255, 255, 0.08)" : "transparent",
                    transition: "background-color 0.15s ease",
                    "&:hover": {
                      backgroundColor: "rgba(255, 255, 255, 0.08)",
                      "& .proj-menu-btn": { opacity: 1 },
                    },
                  }}
                >
                  {/* Clickable project label */}
                  <Box
                    onClick={() => onSelectProject(proj.id)}
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 1,
                      flexGrow: 1,
                      minWidth: 0,
                      cursor: "pointer",
                      py: 0.4,
                    }}
                  >
                    <TagIcon sx={{ color, fontSize: 16, flexShrink: 0 }} />
                    <Typography
                      variant="body2"
                      sx={{
                        color: isSelected ? "#ffffff" : "#d0d0d0",
                        fontWeight: isSelected ? 600 : 400,
                        fontSize: "0.875rem",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {proj.name}
                    </Typography>
                  </Box>

                  {/* Right count & 3-dot menu */}
                  <Box sx={{ display: "flex", alignItems: "center", gap: 0.5, flexShrink: 0 }}>
                    <Typography variant="caption" sx={{ color: "#888888", fontSize: "0.75rem" }}>
                      {count}
                    </Typography>
                    <IconButton
                      className="proj-menu-btn"
                      size="small"
                      onClick={(e) => handleOpenMenu(e, proj)}
                      sx={{
                        color: "#888888",
                        p: 0.2,
                        opacity: 0,
                        transition: "opacity 0.15s ease",
                        "&:hover": { color: "#ffffff" },
                      }}
                    >
                      <MoreHorizIcon sx={{ fontSize: 16 }} />
                    </IconButton>
                  </Box>
                </Box>
              );
            })}
          </Box>
        </Box>
      </Box>

      {/* Project Options Menu */}
      <Menu
        anchorEl={menuAnchorEl}
        open={Boolean(menuAnchorEl)}
        onClose={handleCloseMenu}
        slotProps={{
          paper: {
            sx: {
              backgroundColor: "#262626",
              color: "#ffffff",
              border: "1px solid #333333",
              borderRadius: "8px",
              minWidth: 150,
            },
          },
        }}
      >
        <MenuItem onClick={handleOpenEdit} sx={{ fontSize: "0.85rem", gap: 1 }}>
          <EditIcon fontSize="small" sx={{ color: "#888888" }} />
          Projekt bearbeiten
        </MenuItem>
        <MenuItem onClick={handleDelete} sx={{ fontSize: "0.85rem", color: "#ef4444", gap: 1 }}>
          <DeleteIcon fontSize="small" sx={{ color: "#ef4444" }} />
          Projekt löschen
        </MenuItem>
      </Menu>

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
              borderRadius: "8px",
              border: "1px solid #333333",
            },
          },
        }}
      >
        <form onSubmit={handleCreateProjectSubmit}>
          <DialogTitle sx={{ fontWeight: 700, fontSize: "1.1rem" }}>New Project</DialogTitle>
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
                  borderRadius: "6px",
                  "& fieldset": { borderColor: "#333333" },
                },
              }}
            />

            <Box>
              <Typography variant="caption" sx={{ color: "#888888", display: "block", mb: 1 }}>
                Color Palette:
              </Typography>
              <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                {COLOR_PRESETS.map((col) => (
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
                borderRadius: "6px",
                "&:hover": { backgroundColor: "#d1453b" },
              }}
            >
              Add Project
            </Button>
          </DialogActions>
        </form>
      </Dialog>

      {/* Edit Project Modal */}
      <Dialog
        open={isEditProjectOpen}
        onClose={() => setIsEditProjectOpen(false)}
        fullWidth
        maxWidth="xs"
        slotProps={{
          paper: {
            sx: {
              backgroundColor: "#1c1c1c",
              color: "#ffffff",
              borderRadius: "8px",
              border: "1px solid #333333",
            },
          },
        }}
      >
        <form onSubmit={handleEditProjectSubmit}>
          <DialogTitle sx={{ fontWeight: 700, fontSize: "1.1rem" }}>Projekt bearbeiten</DialogTitle>
          <DialogContent sx={{ display: "flex", flexDirection: "column", gap: 2, pt: 1 }}>
            <TextField
              autoFocus
              placeholder="Projektname"
              value={editProjectName}
              onChange={(e) => setEditProjectName(e.target.value)}
              fullWidth
              required
              variant="outlined"
              sx={{
                "& .MuiOutlinedInput-root": {
                  color: "#ffffff",
                  backgroundColor: "#161616",
                  borderRadius: "6px",
                  "& fieldset": { borderColor: "#333333" },
                },
              }}
            />

            <Box>
              <Typography variant="caption" sx={{ color: "#888888", display: "block", mb: 1 }}>
                Farbe:
              </Typography>
              <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                {COLOR_PRESETS.map((col) => (
                  <Box
                    key={col}
                    onClick={() => setEditProjectColor(col)}
                    sx={{
                      width: 22,
                      height: 22,
                      borderRadius: "50%",
                      backgroundColor: col,
                      cursor: "pointer",
                      border: editProjectColor === col ? "2px solid #ffffff" : "2px solid transparent",
                      transform: editProjectColor === col ? "scale(1.15)" : "scale(1)",
                      transition: "all 0.15s ease",
                    }}
                  />
                ))}
              </Box>
            </Box>
          </DialogContent>
          <DialogActions sx={{ p: 2 }}>
            <Button onClick={() => setIsEditProjectOpen(false)} sx={{ color: "#888888", textTransform: "none" }}>
              Abbrechen
            </Button>
            <Button
              type="submit"
              variant="contained"
              disabled={!editProjectName.trim()}
              sx={{
                backgroundColor: "#e44232",
                color: "#ffffff",
                fontWeight: 600,
                textTransform: "none",
                borderRadius: "6px",
                "&:hover": { backgroundColor: "#d1453b" },
              }}
            >
              Speichern
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </Box>
  );
};

export default Sidebar;
