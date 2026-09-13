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
import { type ProjectTab, COLOR_PRESETS } from "../../service/TaskService";

interface ColumnModalProps {
  open: boolean;
  onClose: () => void;
  onSaveColumn: (columnData: { id?: string; name: string; subtitle?: string; color?: string }) => void;
  editingColumn: ProjectTab | null;
}

export const ColumnModal: React.FC<ColumnModalProps> = ({
  open,
  onClose,
  onSaveColumn,
  editingColumn,
}) => {
  const [name, setName] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const [color, setColor] = useState("#e44232");

  useEffect(() => {
    if (editingColumn) {
      setName(editingColumn.name || "");
      setSubtitle(editingColumn.subtitle || "");
      setColor(editingColumn.color || "#e44232");
    } else {
      setName("");
      setSubtitle("");
      setColor("#e44232");
    }
  }, [editingColumn, open]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    onSaveColumn({
      id: editingColumn?.id,
      name: name.trim(),
      subtitle: subtitle.trim() || undefined,
      color,
    });

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
            backgroundColor: "#1c1c1c",
            color: "#ffffff",
            borderRadius: "8px",
            border: "1px solid #333333",
          },
        },
      }}
    >
      <form onSubmit={handleSubmit}>
        <DialogTitle sx={{ fontWeight: 700, fontSize: "1.1rem" }}>
          {editingColumn ? "Spalte bearbeiten" : "Neue Board-Spalte"}
        </DialogTitle>

        <DialogContent sx={{ display: "flex", flexDirection: "column", gap: 2, pt: 1 }}>
          <TextField
            autoFocus
            placeholder="Spaltenname (z.B. In Review)"
            value={name}
            onChange={(e) => setName(e.target.value)}
            fullWidth
            required
            variant="outlined"
            sx={{
              "& .MuiOutlinedInput-root": {
                color: "#ffffff",
                backgroundColor: "#161616",
                borderRadius: "6px",
                "& fieldset": { borderColor: "#333333" },
              },
            }}
          />

          <TextField
            placeholder="Beschreibung / Untertitel (optional)"
            value={subtitle}
            onChange={(e) => setSubtitle(e.target.value)}
            fullWidth
            variant="outlined"
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
              {COLOR_PRESETS.map((col) => (
                <Box
                  key={col}
                  onClick={() => setColor(col)}
                  sx={{
                    width: 22,
                    height: 22,
                    borderRadius: "50%",
                    backgroundColor: col,
                    cursor: "pointer",
                    border: color === col ? "2px solid #ffffff" : "2px solid transparent",
                    transform: color === col ? "scale(1.15)" : "scale(1)",
                    transition: "all 0.15s ease",
                  }}
                />
              ))}
            </Box>
          </Box>
        </DialogContent>

        <DialogActions sx={{ p: 2 }}>
          <Button onClick={onClose} sx={{ color: "#888888", textTransform: "none" }}>
            Abbrechen
          </Button>
          <Button
            type="submit"
            variant="contained"
            disabled={!name.trim()}
            sx={{
              backgroundColor: "#e44232",
              color: "#ffffff",
              fontWeight: 600,
              textTransform: "none",
              borderRadius: "6px",
              "&:hover": { backgroundColor: "#d1453b" },
            }}
          >
            Speichern
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default ColumnModal;
