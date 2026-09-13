import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
  Typography,
} from "@mui/material";
import type { Task, Label, CreateTaskDTO } from "../../service/TaskService";

interface TaskModalProps {
  open: boolean;
  onClose: () => void;
  onSaveTask: (taskData: CreateTaskDTO, editingTaskId?: number) => void;
  availableLabels: Label[];
  editingTask: Task | null;
  defaultLabelId?: number | null;
}

export const TaskModal: React.FC<TaskModalProps> = ({
  open,
  onClose,
  onSaveTask,
  availableLabels,
  editingTask,
  defaultLabelId,
}) => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [selectedLabels, setSelectedLabels] = useState<Label[]>([]);

  useEffect(() => {
    if (editingTask) {
      setName(editingTask.name || "");
      setDescription(editingTask.description || "");
      setSelectedLabels(editingTask.labels || []);
    } else {
      setName("");
      setDescription("");
      if (defaultLabelId) {
        const found = availableLabels.find((l) => l.id === defaultLabelId);
        setSelectedLabels(found ? [found] : []);
      } else {
        setSelectedLabels([]);
      }
    }
  }, [editingTask, open, defaultLabelId, availableLabels]);

  const toggleLabel = (lbl: Label) => {
    if (selectedLabels.some((l) => l.id === lbl.id || l.name === lbl.name)) {
      setSelectedLabels(selectedLabels.filter((l) => (l.id ? l.id !== lbl.id : l.name !== lbl.name)));
    } else {
      setSelectedLabels([...selectedLabels, lbl]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    onSaveTask(
      {
        name: name.trim(),
        description: description.trim() || null,
        labels: selectedLabels,
      },
      editingTask?.id
    );

    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="xs"
      slotProps={{
        paper: {
          sx: {
            backgroundColor: "#16161a",
            color: "#f3f3f5",
            borderRadius: "16px",
            border: "2px solid #3f3f4c",
          },
        },
      }}
    >
      <form onSubmit={handleSubmit}>
        <DialogTitle sx={{ fontWeight: 700, fontFamily: "monospace, sans-serif" }}>
          {editingTask ? "Task bearbeiten" : "Neuer Task"}
        </DialogTitle>

        <DialogContent sx={{ display: "flex", flexDirection: "column", gap: 2, pt: 1 }}>
          <TextField
            autoFocus
            placeholder="Task Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            fullWidth
            required
            variant="outlined"
            sx={{
              "& .MuiOutlinedInput-root": {
                color: "#f3f3f5",
                backgroundColor: "#0f0f12",
                borderRadius: "10px",
                "& fieldset": { borderColor: "#2a2a33" },
                "&:hover fieldset": { borderColor: "#3f3f4c" },
                "&.Mui-focused fieldset": { borderColor: "#717182" },
              },
            }}
          />

          <TextField
            placeholder="Beschreibung (optional)"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            multiline
            rows={3}
            fullWidth
            variant="outlined"
            sx={{
              "& .MuiOutlinedInput-root": {
                color: "#f3f3f5",
                backgroundColor: "#0f0f12",
                borderRadius: "10px",
                "& fieldset": { borderColor: "#2a2a33" },
                "&:hover fieldset": { borderColor: "#3f3f4c" },
                "&.Mui-focused fieldset": { borderColor: "#717182" },
              },
            }}
          />

          {availableLabels.length > 0 && (
            <Box sx={{ mt: 1 }}>
              <Typography variant="caption" sx={{ color: "#8e8e9e", mb: 1, display: "block" }}>
                Labels:
              </Typography>
              <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                {availableLabels.map((lbl) => {
                  const isSelected = selectedLabels.some((l) => l.id === lbl.id || l.name === lbl.name);
                  const color = lbl.color || "#717182";
                  return (
                    <Box
                      key={lbl.id || lbl.name}
                      onClick={() => toggleLabel(lbl)}
                      sx={{
                        px: 1.5,
                        py: 0.5,
                        borderRadius: "8px",
                        border: `2px solid ${color}`,
                        backgroundColor: isSelected ? color : "transparent",
                        color: isSelected ? "#0f0f12" : color,
                        fontWeight: 700,
                        fontSize: "0.75rem",
                        cursor: "pointer",
                        transition: "all 0.15s ease",
                      }}
                    >
                      {lbl.name}
                    </Box>
                  );
                })}
              </Box>
            </Box>
          )}
        </DialogContent>

        <DialogActions sx={{ p: 2, gap: 1 }}>
          <Button onClick={onClose} sx={{ color: "#8e8e9e", textTransform: "none" }}>
            Abbrechen
          </Button>
          <Button
            type="submit"
            variant="outlined"
            disabled={!name.trim()}
            sx={{
              color: "#f3f3f5",
              borderColor: "#3f3f4c",
              borderRadius: "8px",
              textTransform: "none",
              fontWeight: 600,
              "&:hover": {
                backgroundColor: "#f3f3f5",
                borderColor: "#f3f3f5",
                color: "#0f0f12",
              },
            }}
          >
            Speichern
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default TaskModal;
