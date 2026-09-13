import React, { useState } from "react";
import { Box, Typography, Button } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import TagIcon from "@mui/icons-material/Tag";
import TaskCard from "../Atoms/TaskCard";
import type { Task, Label } from "../../service/TaskService";

interface LabelsPageProps {
  labels: Label[];
  tasks: Task[];
  onToggleComplete: (task: Task) => void;
  onDeleteTask: (taskId: number) => void;
  onOpenDetail: (task: Task) => void;
  onOpenManageLabels: () => void;
}

export const LabelsPage: React.FC<LabelsPageProps> = ({
  labels,
  tasks,
  onToggleComplete,
  onDeleteTask,
  onOpenDetail,
  onOpenManageLabels,
}) => {
  const [selectedLabelId, setSelectedLabelId] = useState<number | null>(null);

  const selectedLabel = labels.find((l) => l.id === selectedLabelId);

  const filteredTasks = selectedLabelId
    ? tasks.filter((t) => t.labels?.some((l) => l.id === selectedLabelId || l.name === selectedLabel?.name))
    : tasks;

  // Calculate count per label
  const labelTaskCountsMap = React.useMemo(() => {
    const map: Record<string | number, number> = {};
    labels.forEach((lbl) => {
      const count = tasks.filter((t) =>
        t.labels?.some((l) => l.id === lbl.id || l.name === lbl.name)
      ).length;
      map[lbl.id] = count;
    });
    return map;
  }, [labels, tasks]);

  return (
    <Box sx={{ flexGrow: 1, p: 4, height: "100vh", overflowY: "auto" }}>
      {/* Header */}
      <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 3 }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 800, color: "#ffffff", letterSpacing: "-0.02em" }}>
            Labels & Tasks
          </Typography>
          <Typography variant="body2" sx={{ color: "#888888", mt: 0.5 }}>
            Filter project tasks by label categories
          </Typography>
        </Box>

        <Button
          variant="outlined"
          startIcon={<AddIcon />}
          onClick={onOpenManageLabels}
          sx={{
            color: "#ffffff",
            borderColor: "#333333",
            borderRadius: "8px",
            textTransform: "none",
            fontWeight: 600,
            "&:hover": { borderColor: "#555555", backgroundColor: "rgba(255,255,255,0.05)" },
          }}
        >
          Manage Labels
        </Button>
      </Box>

      {/* Row of Label Tabs */}
      <Box
        sx={{
          display: "flex",
          gap: 1.5,
          alignItems: "center",
          overflowX: "auto",
          pb: 1.5,
          mb: 3,
          borderBottom: "1px solid #2a2a2a",
          "&::-webkit-scrollbar": { height: 4 },
          "&::-webkit-scrollbar-thumb": { backgroundColor: "#333333", borderRadius: 2 },
        }}
      >
        {/* 'All Tasks' Tab */}
        <Box
          onClick={() => setSelectedLabelId(null)}
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1,
            px: 2,
            py: 1,
            borderRadius: "10px",
            border: "1px solid",
            borderColor: selectedLabelId === null ? "#e44232" : "#333333",
            backgroundColor: selectedLabelId === null ? "rgba(228, 66, 50, 0.15)" : "#1c1c1c",
            color: selectedLabelId === null ? "#ffffff" : "#aaaaaa",
            fontWeight: 700,
            fontSize: "0.875rem",
            cursor: "pointer",
            transition: "all 0.15s ease",
            whiteSpace: "nowrap",
            "&:hover": {
              borderColor: "#e44232",
              color: "#ffffff",
            },
          }}
        >
          <span>All Tasks</span>
          <Typography
            variant="caption"
            sx={{
              px: 1,
              py: 0.2,
              borderRadius: "10px",
              backgroundColor: selectedLabelId === null ? "#e44232" : "#2e2e2e",
              color: "#ffffff",
              fontWeight: 700,
              fontSize: "0.75rem",
            }}
          >
            {tasks.length}
          </Typography>
        </Box>

        {/* Dynamic Label Tabs */}
        {labels.map((lbl) => {
          const isSelected = selectedLabelId === lbl.id;
          const count = labelTaskCountsMap[lbl.id] || 0;
          const color = lbl.color || "#e44232";

          return (
            <Box
              key={lbl.id || lbl.name}
              onClick={() => setSelectedLabelId(isSelected ? null : lbl.id)}
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1,
                px: 2,
                py: 1,
                borderRadius: "10px",
                border: `1px solid ${isSelected ? color : "#333333"}`,
                backgroundColor: isSelected ? `${color}22` : "#1c1c1c",
                color: isSelected ? "#ffffff" : "#aaaaaa",
                fontWeight: 600,
                fontSize: "0.875rem",
                cursor: "pointer",
                transition: "all 0.15s ease",
                whiteSpace: "nowrap",
                "&:hover": {
                  borderColor: color,
                  color: "#ffffff",
                },
              }}
            >
              <TagIcon sx={{ color, fontSize: 16 }} />
              <span>{lbl.name}</span>
              <Typography
                variant="caption"
                sx={{
                  px: 1,
                  py: 0.2,
                  borderRadius: "10px",
                  backgroundColor: isSelected ? color : "#2e2e2e",
                  color: "#ffffff",
                  fontWeight: 700,
                  fontSize: "0.75rem",
                }}
              >
                {count}
              </Typography>
            </Box>
          );
        })}
      </Box>

      {/* Filtered Tasks Section Header */}
      <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
        <Typography variant="h6" sx={{ color: "#ffffff", fontWeight: 700 }}>
          {selectedLabel ? `Tasks labeled with "${selectedLabel.name}"` : "All Labeled Tasks"}
        </Typography>
        <Typography variant="body2" sx={{ color: "#888888" }}>
          ({filteredTasks.length})
        </Typography>
      </Box>

      {/* Tasks List */}
      <Box sx={{ maxWidth: 680 }}>
        {filteredTasks.length === 0 ? (
          <Box
            sx={{
              p: 4,
              textAlign: "center",
              backgroundColor: "#1c1c1c",
              border: "1px dashed #333333",
              borderRadius: "12px",
            }}
          >
            <Typography variant="body2" sx={{ color: "#888888" }}>
              No tasks associated with this label yet.
            </Typography>
          </Box>
        ) : (
          filteredTasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              onToggleComplete={onToggleComplete}
              onDelete={onDeleteTask}
              onOpenDetail={onOpenDetail}
            />
          ))
        )}
      </Box>
    </Box>
  );
};

export default LabelsPage;
