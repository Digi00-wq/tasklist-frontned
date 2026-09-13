import React, { useState, useMemo } from "react";
import { Box, Typography, TextField, InputAdornment } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import TaskCard from "../Atoms/TaskCard";
import type { Task } from "../../service/TaskService";

interface SearchPageProps {
  tasks: Task[];
  onToggleComplete: (task: Task) => void;
  onDeleteTask: (taskId: number) => void;
  onOpenDetail: (task: Task) => void;
}

export const SearchPage: React.FC<SearchPageProps> = ({
  tasks,
  onToggleComplete,
  onDeleteTask,
  onOpenDetail,
}) => {
  const [query, setQuery] = useState("");

  const searchResults = useMemo(() => {
    if (!query.trim()) return tasks;
    const q = query.toLowerCase();

    return tasks.filter((t) => {
      const nameMatch = t.name.toLowerCase().includes(q);
      const descMatch = t.description?.toLowerCase().includes(q);
      const labelMatch = t.labels?.some((l) => l.name.toLowerCase().includes(q));

      return nameMatch || descMatch || labelMatch;
    });
  }, [tasks, query]);

  return (
    <Box sx={{ flexGrow: 1, p: 4, height: "100vh", overflowY: "auto" }}>
      {/* Header & Search Bar */}
      <Typography variant="h4" sx={{ fontWeight: 700, color: "#ffffff", mb: 2 }}>
        Search
      </Typography>

      <TextField
        autoFocus
        fullWidth
        placeholder="Search tasks by name, description, or label..."
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
          maxWidth: 600,
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

      <Typography variant="body2" sx={{ color: "#888888", mb: 2 }}>
        Results ({searchResults.length})
      </Typography>

      {/* Results List */}
      <Box sx={{ maxWidth: 650 }}>
        {searchResults.length === 0 ? (
          <Typography variant="body2" sx={{ color: "#666666", fontStyle: "italic", py: 4 }}>
            No matching tasks found. Try searching for names, descriptions, or label tags.
          </Typography>
        ) : (
          searchResults.map((task) => (
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

export default SearchPage;
