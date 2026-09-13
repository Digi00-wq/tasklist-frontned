import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
  Typography,
  IconButton,
} from "@mui/material";
import DeleteOutlinedIcon from "@mui/icons-material/DeleteOutlined";
import type { Label } from "../../service/TaskService";

interface LabelModalProps {
  open: boolean;
  onClose: () => void;
  labels: Label[];
  onCreateLabel: (name: string, color: string) => void;
  onDeleteLabel: (id: number) => void;
}

const PRESET_COLORS = [
  "#94a3b8", // Cool Slate
  "#71717a", // Zinc Slate
  "#cbd5e1", // Silver Gray
  "#3f3f46", // Dark Charcoal
  "#a1a1aa", // Warm Neutral
  "#e2e8f0", // Soft Light Gray
];

export const LabelModal: React.FC<LabelModalProps> = ({
  open,
  onClose,
  labels,
  onCreateLabel,
  onDeleteLabel,
}) => {
  const [name, setName] = useState("");
  const [color, setColor] = useState("#94a3b8");

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    onCreateLabel(name.trim(), color);
    setName("");
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
      <DialogTitle sx={{ fontWeight: 700, fontFamily: "monospace, sans-serif" }}>
        Labels verwalten
      </DialogTitle>

      <DialogContent sx={{ display: "flex", flexDirection: "column", gap: 2, pt: 1 }}>
        <form onSubmit={handleCreate}>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5, mb: 2 }}>
            <TextField
              size="small"
              placeholder="Neues Label (z.B. Feature)"
              value={name}
              onChange={(e) => setName(e.target.value)}
              fullWidth
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

            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <Typography variant="caption" sx={{ color: "#8e8e9e" }}>
                Farbe:
              </Typography>
              {PRESET_COLORS.map((c) => (
                <Box
                  key={c}
                  onClick={() => setColor(c)}
                  sx={{
                    width: 22,
                    height: 22,
                    borderRadius: "50%",
                    border: color === c ? "2px solid #f3f3f5" : "2px solid transparent",
                    backgroundColor: c,
                    cursor: "pointer",
                    transform: color === c ? "scale(1.15)" : "scale(1)",
                    transition: "all 0.15s ease",
                  }}
                />
              ))}
            </Box>

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
                "&:hover": { borderColor: "#717182", backgroundColor: "rgba(255, 255, 255, 0.04)" },
              }}
            >
              Label hinzufügen
            </Button>
          </Box>
        </form>

        <Typography variant="caption" sx={{ color: "#8e8e9e", fontWeight: 700, mt: 1 }}>
          Bestehende Labels ({labels.length})
        </Typography>

        <Box sx={{ display: "flex", flexDirection: "column", gap: 1, maxHeight: 200, overflowY: "auto" }}>
          {labels.map((lbl) => (
            <Box
              key={lbl.id || lbl.name}
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                px: 1.5,
                py: 0.8,
                borderRadius: "8px",
                border: `2px solid ${lbl.color || "#717182"}`,
                backgroundColor: "#0f0f12",
              }}
            >
              <Typography variant="body2" sx={{ color: lbl.color || "#717182", fontWeight: 700 }}>
                {lbl.name}
              </Typography>
              <IconButton
                size="small"
                onClick={() => lbl.id && onDeleteLabel(lbl.id)}
                sx={{ color: "#8e8e9e", p: 0.2, "&:hover": { color: "#ef4444" } }}
              >
                <DeleteOutlinedIcon sx={{ fontSize: 16 }} />
              </IconButton>
            </Box>
          ))}
        </Box>
      </DialogContent>

      <DialogActions sx={{ p: 2 }}>
        <Button onClick={onClose} sx={{ color: "#8e8e9e", textTransform: "none" }}>
          Schliessen
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default LabelModal;
