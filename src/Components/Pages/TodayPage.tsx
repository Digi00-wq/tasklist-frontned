import React from "react";
import { Box, Typography } from "@mui/material";
import CalendarTodayOutlinedIcon from "@mui/icons-material/CalendarTodayOutlined";
import TaskCard from "../Atoms/TaskCard";
import type { Task } from "../../service/TaskService";

interface TodayPageProps {
  tasks: Task[];
  onToggleComplete: (task: Task) => void;
  onDeleteTask: (taskId: number) => void;
  onOpenDetail: (task: Task) => void;
}

export const TodayPage: React.FC<TodayPageProps> = ({
  tasks,
  onToggleComplete,
  onDeleteTask,
  onOpenDetail,
}) => {
  const todayDateString = new Date().toLocaleDateString("de-DE", {
    weekday: "short",
    day: "numeric",
    month: "short",
  });

  return (
    <Box sx={{ flexGrow: 1, p: 4, height: "100vh", overflowY: "auto" }}>
      {/* Header */}
      <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 0.5 }}>
        <Typography variant="h4" sx={{ fontWeight: 700, color: "#ffffff" }}>
          Today
        </Typography>
        <Typography variant="body2" sx={{ color: "#888888", mt: 1 }}>
          {todayDateString}
        </Typography>
      </Box>

      <Typography variant="body2" sx={{ color: "#888888", mb: 3 }}>
        {tasks.length} tasks due today
      </Typography>

      {/* Task List */}
      <Box sx={{ maxWidth: 650 }}>
        {tasks.length === 0 ? (
          <Box sx={{ py: 6, textAlign: "center" }}>
            <CalendarTodayOutlinedIcon sx={{ color: "#058527", fontSize: 40, mb: 1 }} />
            <Typography variant="body1" sx={{ color: "#ffffff", fontWeight: 600 }}>
              All clear for today!
            </Typography>
            <Typography variant="body2" sx={{ color: "#888888" }}>
              Enjoy your day or add new tasks from the sidebar.
            </Typography>
          </Box>
        ) : (
          tasks.map((task) => (
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

export default TodayPage;
