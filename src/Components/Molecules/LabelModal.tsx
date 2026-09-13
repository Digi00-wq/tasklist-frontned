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
import { type Label, COLOR_PRESETS } from "../../service/TaskService";

interface LabelModalProps {
  open: boolean;
  onClose: () => void;
  labels: Label[];
  onCreateLabel: (name: string, color: string) => void;
  onDeleteLabel: (id: number) => void;
}

export const LabelModal: React.FC<LabelModalProps> = ({
  open,
  onClose,
  labels,
  onCreateLabel,
  onDeleteLabel,
}) => {
  const [name, setName] = useState("");
  const [color, setColor] = useState("#e44232");

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
            backgroundColor: "#1c1c1c",
            color: "#ffffff",
            borderRadius: "8px",
            border: "1px solid #333333",
          },
        },
      }}
    >
      <DialogTitle sx={{ fontWeight: 700, fontSize: "1.1rem" }}>
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
                {COLOR_PRESETS.map((c) => (
                  <Box
                    key={c}
                    onClick={() => setColor(c)}
                    sx={{
                      width: 22,
                      height: 22,
                      borderRadius: "50%",
                      border: color === c ? "2px solid #ffffff" : "2px solid transparent",
                      backgroundColor: c,
                      cursor: "pointer",
                      transform: color === c ? "scale(1.15)" : "scale(1)",
                      transition: "all 0.15s ease",
                    }}
                  />
                ))}
              </Box>
            </Box>

            <Button
              type="submit"
              variant="contained"
              disabled={!name.trim()}
              sx={{
                backgroundColor: "#e44232",
                color: "#ffffff",
                borderRadius: "6px",
                textTransform: "none",
                fontWeight: 600,
                "&:hover": { backgroundColor: "#d1453b" },
              }}
            >
              Label hinzufügen
            </Button>
          </Box>
        </form>

        <Typography variant="caption" sx={{ color: "#888888", fontWeight: 700, mt: 1 }}>
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
                borderRadius: "6px",
                border: `1px solid ${lbl.color || "#444444"}`,
                backgroundColor: "#161616",
              }}
            >
              <Typography variant="body2" sx={{ color: lbl.color || "#d0d0d0", fontWeight: 600 }}>
                {lbl.name}
              </Typography>
              <IconButton
                size="small"
                onClick={() => lbl.id && onDeleteLabel(lbl.id)}
                sx={{ color: "#888888", p: 0.2, "&:hover": { color: "#ef4444" } }}
              >
                <DeleteOutlinedIcon sx={{ fontSize: 16 }} />
              </IconButton>
            </Box>
          ))}
        </Box>
      </DialogContent>

      <DialogActions sx={{ p: 2 }}>
        <Button onClick={onClose} sx={{ color: "#888888", textTransform: "none" }}>
          Schliessen
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default LabelModal;
