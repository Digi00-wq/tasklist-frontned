import React, { useState } from "react";
import { Box, Typography, Button, IconButton, Menu, MenuItem } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import TaskCard from "../Atoms/TaskCard";
import type { Task, ProjectTab } from "../../service/TaskService";

interface LabelColumnProps {
  tab: ProjectTab;
  tasks: Task[];
  onToggleComplete: (task: Task) => void;
  onDeleteTask: (taskId: number) => void;
  onEditTask: (task: Task) => void;
  onAddTaskToLabel: (tab: ProjectTab) => void;
  onDropTask?: (taskId: number, targetTabId: string) => void;
  onEditColumn?: (tab: ProjectTab) => void;
  onMoveColumn?: (tabId: string, direction: "left" | "right") => void;
  onDeleteColumn?: (tabId: string) => void;
  isFirstColumn?: boolean;
  isLastColumn?: boolean;
}

export const LabelColumn: React.FC<LabelColumnProps> = ({
  tab,
  tasks,
  onToggleComplete,
  onDeleteTask,
  onEditTask,
  onAddTaskToLabel,
  onDropTask,
  onEditColumn,
  onMoveColumn,
  onDeleteColumn,
  isFirstColumn,
  isLastColumn,
}) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleOpenMenu = (e: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(e.currentTarget);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    if (!isDragOver) setIsDragOver(true);
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    try {
      const dataStr = e.dataTransfer.getData("text/plain");
      if (!dataStr) return;
      const data = JSON.parse(dataStr);
      if (data && data.taskId && onDropTask) {
        onDropTask(data.taskId, tab.id);
      }
    } catch (err) {
      console.error("Failed to drop task:", err);
    }
  };

  return (
    <Box
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      sx={{
        width: 320,
        minWidth: 300,
        display: "flex",
        flexDirection: "column",
        maxHeight: "calc(100vh - 160px)",
        borderRadius: "12px",
        p: 1,
        transition: "all 0.2s ease-in-out",
        backgroundColor: isDragOver ? "rgba(228, 66, 50, 0.08)" : "transparent",
        border: isDragOver ? "2px dashed #e44232" : "2px solid transparent",
      }}
    >
      {/* Column Header */}
      <Box sx={{ mb: 1.5, px: 0.5 }}>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Typography
              variant="h6"
              sx={{
                fontWeight: 700,
                color: "#ffffff",
                fontSize: "1.05rem",
              }}
            >
              {tab.name}
            </Typography>

            <Typography
              variant="body2"
              sx={{
                color: "#888888",
                fontSize: "0.9rem",
                fontWeight: 500,
              }}
            >
              {tasks.length}
            </Typography>
          </Box>

          <IconButton
            size="small"
            onClick={handleOpenMenu}
            sx={{ color: "#888888", p: 0.5, "&:hover": { color: "#ffffff" } }}
          >
            <MoreHorizIcon fontSize="small" />
          </IconButton>

          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleCloseMenu}
            slotProps={{
              paper: {
                sx: {
                  backgroundColor: "#262626",
                  color: "#ffffff",
                  border: "1px solid #333333",
                  borderRadius: "8px",
                  minWidth: 160,
                },
              },
            }}
          >
            {onEditColumn && (
              <MenuItem
                onClick={() => {
                  handleCloseMenu();
                  onEditColumn(tab);
                }}
                sx={{ fontSize: "0.85rem", gap: 1 }}
              >
                <EditIcon fontSize="small" sx={{ color: "#888888" }} />
                Spalte bearbeiten
              </MenuItem>
            )}

            {onMoveColumn && !isFirstColumn && (
              <MenuItem
                onClick={() => {
                  handleCloseMenu();
                  onMoveColumn(tab.id, "left");
                }}
                sx={{ fontSize: "0.85rem", gap: 1 }}
              >
                <ArrowBackIcon fontSize="small" sx={{ color: "#888888" }} />
                Nach links verschieben
              </MenuItem>
            )}

            {onMoveColumn && !isLastColumn && (
              <MenuItem
                onClick={() => {
                  handleCloseMenu();
                  onMoveColumn(tab.id, "right");
                }}
                sx={{ fontSize: "0.85rem", gap: 1 }}
              >
                <ArrowForwardIcon fontSize="small" sx={{ color: "#888888" }} />
                Nach rechts verschieben
              </MenuItem>
            )}

            {onDeleteColumn && (
              <MenuItem
                onClick={() => {
                  handleCloseMenu();
                  onDeleteColumn(tab.id);
                }}
                sx={{ fontSize: "0.85rem", color: "#ef4444", gap: 1 }}
              >
                <DeleteIcon fontSize="small" sx={{ color: "#ef4444" }} />
                Spalte löschen
              </MenuItem>
            )}
          </Menu>
        </Box>

        {/* Subtitle under column header */}
        <Typography
          variant="caption"
          sx={{
            color: "#888888",
            fontSize: "0.8rem",
            display: "block",
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
            mt: 0.2,
          }}
        >
          {tab.subtitle || `${tab.name} tasks`}
        </Typography>
      </Box>

      {/* Task Cards Stack */}
      <Box
        sx={{
          flexGrow: 1,
          overflowY: "auto",
          pr: 0.5,
          minHeight: 120,
          "&::-webkit-scrollbar": { width: 4 },
          "&::-webkit-scrollbar-thumb": { backgroundColor: "#333333", borderRadius: 2 },
        }}
      >
        {tasks.map((task) => (
          <TaskCard
            key={task.id}
            task={task}
            onToggleComplete={onToggleComplete}
            onDelete={onDeleteTask}
            onOpenDetail={onEditTask}
          />
        ))}
      </Box>

      {/* "+ Add task" Button */}
      <Button
        variant="text"
        startIcon={<AddIcon sx={{ color: tab.color || "#e5484d", fontSize: 18 }} />}
        onClick={() => onAddTaskToLabel(tab)}
        sx={{
          mt: 0.5,
          color: "#888888",
          textTransform: "none",
          fontWeight: 500,
          fontSize: "0.9rem",
          justifyContent: "flex-start",
          px: 1,
          py: 0.5,
          "&:hover": {
            backgroundColor: "rgba(255, 255, 255, 0.05)",
            color: "#ffffff",
          },
        }}
      >
        Add task
      </Button>
    </Box>
  );
};

export default LabelColumn;
