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
    <Box sx={{ flexGrow: 1, px: { xs: 2, sm: 4, md: 5 }, pb: 4, height: "calc(100vh - 140px)", overflowY: "auto" }}>
      {/* Label Tabs Bar with Manage Labels button at end */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 2,
          pb: 1,
          mb: 3,
          borderBottom: "1px solid #2a2a2a",
        }}
      >
        <Box
          sx={{
            display: "flex",
            gap: 1,
            alignItems: "center",
            overflowX: "auto",
            "&::-webkit-scrollbar": { height: 4 },
            "&::-webkit-scrollbar-thumb": { backgroundColor: "#333333", borderRadius: 2 },
          }}
        >
          {/* 'All Tasks' Tab */}
          <Button
            size="small"
            onClick={() => setSelectedLabelId(null)}
            sx={{
              color: selectedLabelId === null ? "#ffffff" : "#888888",
              backgroundColor: selectedLabelId === null ? "rgba(255, 255, 255, 0.08)" : "transparent",
              border: "1px solid",
              borderColor: selectedLabelId === null ? "#444444" : "#2e2e2e",
              borderRadius: "6px",
              textTransform: "none",
              fontWeight: selectedLabelId === null ? 700 : 500,
              fontSize: "0.85rem",
              px: 1.5,
              py: 0.5,
              whiteSpace: "nowrap",
              "&:hover": { color: "#ffffff", backgroundColor: "rgba(255, 255, 255, 0.08)" },
            }}
          >
            All Tasks ({tasks.length})
          </Button>

          {/* Dynamic Label Tabs */}
          {labels.map((lbl) => {
            const isSelected = selectedLabelId === lbl.id;
            const count = labelTaskCountsMap[lbl.id] || 0;
            const color = lbl.color || "#e44232";

            return (
              <Button
                key={lbl.id || lbl.name}
                size="small"
                startIcon={<TagIcon sx={{ color, fontSize: 16 }} />}
                onClick={() => setSelectedLabelId(isSelected ? null : lbl.id)}
                sx={{
                  color: isSelected ? "#ffffff" : "#888888",
                  backgroundColor: isSelected ? "rgba(255, 255, 255, 0.08)" : "transparent",
                  border: "1px solid",
                  borderColor: isSelected ? color : "#2e2e2e",
                  borderRadius: "6px",
                  textTransform: "none",
                  fontWeight: isSelected ? 700 : 500,
                  fontSize: "0.85rem",
                  px: 1.5,
                  py: 0.5,
                  whiteSpace: "nowrap",
                  "&:hover": { color: "#ffffff", backgroundColor: "rgba(255, 255, 255, 0.08)" },
                }}
              >
                {lbl.name} ({count})
              </Button>
            );
          })}
        </Box>

        {/* Manage Labels button */}
        <Button
          size="small"
          startIcon={<AddIcon fontSize="small" />}
          onClick={onOpenManageLabels}
          sx={{
            color: "#888888",
            borderColor: "#333333",
            borderRadius: "6px",
            textTransform: "none",
            fontWeight: 500,
            fontSize: "0.85rem",
            whiteSpace: "nowrap",
            "&:hover": { color: "#ffffff", backgroundColor: "rgba(255,255,255,0.05)" },
          }}
        >
          Manage Labels
        </Button>
      </Box>

      {/* Tasks List */}
      <Box sx={{ maxWidth: 680 }}>
        {filteredTasks.length === 0 ? (
          <Box
            sx={{
              p: 3,
              textAlign: "center",
              backgroundColor: "#1c1c1c",
              border: "1px solid #2e2e2e",
              borderRadius: "8px",
            }}
          >
            <Typography variant="body2" sx={{ color: "#888888" }}>
              No tasks found for this label.
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
