import React, { useState } from "react";
import { Box, Typography, IconButton, Menu, MenuItem } from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import LabelBadge from "./LabelBadge";
import type { Task } from "../../service/TaskService";

interface TaskCardProps {
  task: Task;
  onToggleComplete: (task: Task) => void;
  onDelete: (taskId: number) => void;
  onOpenDetail: (task: Task) => void;
}

export const TaskCard: React.FC<TaskCardProps> = ({
  task,
  onToggleComplete,
  onDelete,
  onOpenDetail,
}) => {
  const [menuAnchor, setMenuAnchor] = useState<null | HTMLElement>(null);
  const primaryLabelColor = task.labels?.[0]?.color || "#777777";

  const handleOpenMenu = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    setMenuAnchor(e.currentTarget);
  };

  const handleCloseMenu = () => {
    setMenuAnchor(null);
  };

  return (
    <Box
      onClick={() => onOpenDetail(task)}
      draggable
      onDragStart={(e) => {
        e.dataTransfer.setData(
          "text/plain",
          JSON.stringify({ taskId: task.id, fromStatusTab: task.statusTab })
        );
        e.dataTransfer.effectAllowed = "move";
      }}
      sx={{
        backgroundColor: "#222222",
        border: "1px solid #333333",
        borderRadius: "12px",
        px: 2,
        py: 1.5,
        mb: 1.5,
        transition: "all 0.15s ease-in-out",
        cursor: "grab",
        position: "relative",
        display: "flex",
        flexDirection: "column",
        "&:active": { cursor: "grabbing" },
        "&:hover": {
          backgroundColor: "#272727",
          borderColor: "#444444",
          "& .card-actions": { opacity: 1 },
        },
      }}
    >
      <Box sx={{ display: "flex", alignItems: "flex-start", gap: 1.5 }}>
        {/* Check Circle Toggle */}
        <Box
          onClick={(e) => {
            e.stopPropagation();
            onToggleComplete(task);
          }}
          sx={{
            mt: 0.3,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
          }}
        >
          {task.completed ? (
            <CheckCircleIcon
              sx={{
                fontSize: 20,
                color: primaryLabelColor !== "#777777" ? primaryLabelColor : "#555555",
              }}
            />
          ) : (
            <Box
              sx={{
                width: 18,
                height: 18,
                borderRadius: "50%",
                border: `2px solid ${primaryLabelColor}`,
                backgroundColor: "transparent",
                transition: "all 0.15s ease",
                "&:hover": {
                  transform: "scale(1.15)",
                },
              }}
            />
          )}
        </Box>

        {/* Task Content */}
        <Box sx={{ flexGrow: 1, minWidth: 0 }}>
          <Typography
            variant="body1"
            sx={{
              fontWeight: 500,
              fontSize: "0.95rem",
              color: task.completed ? "#888888" : "#e0e0e0",
              textDecoration: task.completed ? "line-through" : "none",
              lineHeight: 1.4,
              wordBreak: "break-word",
            }}
          >
            {task.name}
          </Typography>

          {task.description && (
            <Typography
              variant="body2"
              sx={{
                color: "#888888",
                fontSize: "0.8rem",
                mt: 0.5,
                lineHeight: 1.3,
                wordBreak: "break-word",
                textDecoration: task.completed ? "line-through" : "none",
              }}
            >
              {task.description}
            </Typography>
          )}

          {/* Labels badges in their custom colors */}
          {task.labels && task.labels.length > 0 && (
            <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap", mt: 1 }}>
              {task.labels.map((lbl) => (
                <LabelBadge key={lbl.id || lbl.name} label={lbl} />
              ))}
            </Box>
          )}
        </Box>

        {/* Single Three-Dot Options Menu */}
        <Box className="card-actions" sx={{ opacity: 0, transition: "opacity 0.15s ease" }}>
          <IconButton size="small" onClick={handleOpenMenu} sx={{ color: "#777777", p: 0.2 }}>
            <MoreHorizIcon sx={{ fontSize: 18 }} />
          </IconButton>
          <Menu
            anchorEl={menuAnchor}
            open={Boolean(menuAnchor)}
            onClose={handleCloseMenu}
            slotProps={{
              paper: {
                sx: {
                  backgroundColor: "#262626",
                  color: "#ffffff",
                  border: "1px solid #333333",
                  borderRadius: "8px",
                },
              },
            }}
          >
            <MenuItem
              onClick={(e) => {
                e.stopPropagation();
                handleCloseMenu();
                onOpenDetail(task);
              }}
              sx={{ fontSize: "0.85rem" }}
            >
              Details anzeigen
            </MenuItem>
            <MenuItem
              onClick={(e) => {
                e.stopPropagation();
                handleCloseMenu();
                onDelete(task.id);
              }}
              sx={{ fontSize: "0.85rem", color: "#ef4444" }}
            >
              Löschen
            </MenuItem>
          </Menu>
        </Box>
      </Box>
    </Box>
  );
};

export default TaskCard;
