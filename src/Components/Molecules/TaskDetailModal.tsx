import React, { useState, useEffect } from "react";
import {
  Dialog,
  Box,
  Typography,
  IconButton,
  TextField,
  Divider,
  Avatar,
  Tooltip,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import AddIcon from "@mui/icons-material/Add";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import TagIcon from "@mui/icons-material/Tag";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import FlagOutlinedIcon from "@mui/icons-material/FlagOutlined";
import SubjectIcon from "@mui/icons-material/Subject";
import LabelBadge from "../Atoms/LabelBadge";
import type { Task, Label } from "../../service/TaskService";

interface TaskDetailModalProps {
  open: boolean;
  onClose: () => void;
  task: Task | null;
  onToggleComplete: (task: Task) => void;
  onUpdateTask: (task: Task) => void;
  onDeleteTask: (taskId: number) => void;
  availableLabels: Label[];
  projectName?: string;
}

export const TaskDetailModal: React.FC<TaskDetailModalProps> = ({
  open,
  onClose,
  task,
  onToggleComplete,
  onUpdateTask,
  projectName,
}) => {
  const [description, setDescription] = useState("");
  const [commentText, setCommentText] = useState("");
  const [subtasks, setSubtasks] = useState<string[]>([]);
  const [newSubtask, setNewSubtask] = useState("");

  useEffect(() => {
    if (task) {
      setDescription(task.description || "");
    }
  }, [task]);

  if (!task) return null;

  const primaryColor = task.labels?.[0]?.color || "#e5484d";
  const statusTabName = task.statusTab || task.labels?.[0]?.name || "Not begun";

  const handleSaveDescription = () => {
    onUpdateTask({
      ...task,
      description: description.trim() || null,
    });
  };

  const handleAddSubtask = () => {
    if (!newSubtask.trim()) return;
    setSubtasks([...subtasks, newSubtask.trim()]);
    setNewSubtask("");
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="md"
      slotProps={{
        paper: {
          sx: {
            backgroundColor: "#1c1c1c",
            color: "#ffffff",
            borderRadius: "16px",
            border: "1px solid #333333",
            minHeight: 520,
            overflow: "hidden",
          },
        },
      }}
    >
      {/* Header Bar matching fullscreen.png */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          px: 3,
          py: 1.5,
          borderBottom: "1px solid #2a2a2a",
        }}
      >
        {/* Left Breadcrumb */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <TagIcon sx={{ color: "#e44232", fontSize: 16 }} />
          <Typography variant="body2" sx={{ color: "#d0d0d0", fontWeight: 600, fontSize: "0.875rem" }}>
            {projectName || "Project"}
          </Typography>
          <Typography variant="body2" sx={{ color: "#666666" }}>
            /
          </Typography>
          <Typography variant="body2" sx={{ color: "#888888", fontSize: "0.875rem" }}>
            {statusTabName}
          </Typography>
        </Box>

        {/* Right Navigation & Action Icons */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
          <Tooltip title="Vorheriger Task">
            <IconButton size="small" sx={{ color: "#888888", "&:hover": { color: "#ffffff" } }}>
              <KeyboardArrowUpIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Nächster Task">
            <IconButton size="small" sx={{ color: "#888888", "&:hover": { color: "#ffffff" } }}>
              <KeyboardArrowDownIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          <IconButton size="small" sx={{ color: "#888888", "&:hover": { color: "#ffffff" } }}>
            <MoreHorizIcon fontSize="small" />
          </IconButton>
          <IconButton size="small" onClick={onClose} sx={{ color: "#888888", "&:hover": { color: "#ffffff" } }}>
            <CloseIcon fontSize="small" />
          </IconButton>
        </Box>
      </Box>

      {/* Main Grid Content Layout */}
      <Box sx={{ display: "flex", flexGrow: 1, minHeight: 460 }}>
        {/* Left Content Column (70%) */}
        <Box sx={{ flexGrow: 1, p: 3, display: "flex", flexDirection: "column", gap: 2.5 }}>
          {/* Title Row */}
          <Box sx={{ display: "flex", alignItems: "flex-start", gap: 1.5 }}>
            <Box
              onClick={() => onToggleComplete(task)}
              sx={{ mt: 0.5, cursor: "pointer", display: "flex", alignItems: "center" }}
            >
              {task.completed ? (
                <CheckCircleIcon sx={{ fontSize: 24, color: primaryColor }} />
              ) : (
                <Box
                  sx={{
                    width: 22,
                    height: 22,
                    borderRadius: "50%",
                    border: `2px solid ${primaryColor}`,
                    backgroundColor: "transparent",
                    "&:hover": { transform: "scale(1.1)" },
                  }}
                />
              )}
            </Box>

            <Typography
              variant="h5"
              sx={{
                fontWeight: 700,
                color: task.completed ? "#888888" : "#ffffff",
                textDecoration: task.completed ? "line-through" : "none",
                fontSize: "1.35rem",
                lineHeight: 1.3,
              }}
            >
              {task.name}
            </Typography>
          </Box>

          {/* Description Section */}
          <Box sx={{ pl: 4.5 }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1, color: "#888888", mb: 1 }}>
              <SubjectIcon fontSize="small" />
              <Typography variant="body2" sx={{ fontSize: "0.875rem" }}>
                Description
              </Typography>
            </Box>
            <TextField
              multiline
              rows={2}
              fullWidth
              placeholder="Description..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              onBlur={handleSaveDescription}
              variant="outlined"
              sx={{
                "& .MuiOutlinedInput-root": {
                  color: "#ffffff",
                  backgroundColor: "#161616",
                  borderRadius: "8px",
                  fontSize: "0.875rem",
                  "& fieldset": { borderColor: "#2e2e2e" },
                  "&:hover fieldset": { borderColor: "#444444" },
                  "&.Mui-focused fieldset": { borderColor: "#666666" },
                },
              }}
            />
          </Box>

          {/* Sub-tasks Section */}
          <Box sx={{ pl: 4.5 }}>
            {subtasks.map((st, idx) => (
              <Typography key={idx} variant="body2" sx={{ color: "#d0d0d0", mb: 0.5 }}>
                • {st}
              </Typography>
            ))}
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <TextField
                size="small"
                placeholder="Add sub-task"
                value={newSubtask}
                onChange={(e) => setNewSubtask(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleAddSubtask()}
                sx={{
                  width: 220,
                  "& .MuiOutlinedInput-root": {
                    color: "#ffffff",
                    backgroundColor: "#161616",
                    borderRadius: "6px",
                    fontSize: "0.8rem",
                    "& fieldset": { borderColor: "#2e2e2e" },
                  },
                }}
              />
              <IconButton size="small" onClick={handleAddSubtask} sx={{ color: "#888888" }}>
                <AddIcon fontSize="small" />
              </IconButton>
            </Box>
          </Box>

          <Divider sx={{ my: 1, borderColor: "#2e2e2e" }} />

          {/* Comment Section matching fullscreen.png */}
          <Box sx={{ pl: 4.5, mt: "auto" }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
              <Avatar sx={{ width: 28, height: 28, backgroundColor: "#e44232", fontSize: "0.75rem" }}>
                U
              </Avatar>
              <TextField
                size="small"
                fullWidth
                placeholder="Comment"
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                slotProps={{
                  input: {
                    endAdornment: <AttachFileIcon sx={{ color: "#888888", cursor: "pointer" }} />,
                  },
                }}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    color: "#ffffff",
                    backgroundColor: "#161616",
                    borderRadius: "20px",
                    fontSize: "0.875rem",
                    "& fieldset": { borderColor: "#2e2e2e" },
                  },
                }}
              />
            </Box>
          </Box>
        </Box>

        {/* Right Details Panel (30%) matching fullscreen.png */}
        <Box
          sx={{
            width: 260,
            minWidth: 260,
            borderLeft: "1px solid #2e2e2e",
            p: 3,
            display: "flex",
            flexDirection: "column",
            gap: 2.5,
            backgroundColor: "#181818",
          }}
        >
          {/* Project Details */}
          <Box>
            <Typography variant="caption" sx={{ color: "#888888", fontWeight: 600, display: "block", mb: 0.5 }}>
              Project
            </Typography>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <TagIcon sx={{ color: "#e44232", fontSize: 16 }} />
              <Typography variant="body2" sx={{ color: "#ffffff", fontSize: "0.85rem" }}>
                {projectName || "Project"} / {statusTabName}
              </Typography>
            </Box>
          </Box>

          <Divider sx={{ borderColor: "#2e2e2e" }} />

          {/* Date */}
          <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <Typography variant="body2" sx={{ color: "#888888", fontSize: "0.85rem" }}>
              Date
            </Typography>
            <AddIcon sx={{ color: "#888888", fontSize: 18, cursor: "pointer" }} />
          </Box>

          {/* Deadline */}
          <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <Typography variant="body2" sx={{ color: "#888888", fontSize: "0.85rem" }}>
              Deadline 💥
            </Typography>
            <LockOutlinedIcon sx={{ color: "#666666", fontSize: 16 }} />
          </Box>

          <Divider sx={{ borderColor: "#2e2e2e" }} />

          {/* Priority */}
          <Box>
            <Typography variant="caption" sx={{ color: "#888888", fontWeight: 600, display: "block", mb: 0.5 }}>
              Priority
            </Typography>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1, color: "#e44232" }}>
              <FlagOutlinedIcon fontSize="small" />
              <Typography variant="body2" sx={{ fontWeight: 700, fontSize: "0.85rem" }}>
                P1
              </Typography>
            </Box>
          </Box>

          <Divider sx={{ borderColor: "#2e2e2e" }} />

          {/* Labels */}
          <Box>
            <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 1 }}>
              <Typography variant="caption" sx={{ color: "#888888", fontWeight: 600 }}>
                Labels
              </Typography>
              <AddIcon sx={{ color: "#888888", fontSize: 18, cursor: "pointer" }} />
            </Box>
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.8 }}>
              {task.labels && task.labels.length > 0 ? (
                task.labels.map((lbl) => <LabelBadge key={lbl.id || lbl.name} label={lbl} />)
              ) : (
                <Typography variant="caption" sx={{ color: "#666666" }}>
                  None
                </Typography>
              )}
            </Box>
          </Box>

          <Divider sx={{ borderColor: "#2e2e2e" }} />

          {/* Reminders */}
          <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <Typography variant="body2" sx={{ color: "#888888", fontSize: "0.85rem" }}>
              Reminders
            </Typography>
            <AddIcon sx={{ color: "#888888", fontSize: 18, cursor: "pointer" }} />
          </Box>

          {/* Location */}
          <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <Typography variant="body2" sx={{ color: "#888888", fontSize: "0.85rem" }}>
              Location 💥
            </Typography>
            <LockOutlinedIcon sx={{ color: "#666666", fontSize: 16 }} />
          </Box>
        </Box>
      </Box>
    </Dialog>
  );
};

export default TaskDetailModal;
