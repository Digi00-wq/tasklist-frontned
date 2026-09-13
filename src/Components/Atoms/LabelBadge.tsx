import React from "react";
import { Box, Typography } from "@mui/material";
import type { Label } from "../../service/TaskService";

interface LabelBadgeProps {
  label: Label;
  onClick?: () => void;
  onDelete?: () => void;
}

export const LabelBadge: React.FC<LabelBadgeProps> = ({ label, onClick }) => {
  const badgeColor = label.color || "#ffffff";

  return (
    <Box
      onClick={onClick}
      sx={{
        height: 18,
        px: 1,
        borderRadius: "6px",
        border: `2px solid ${badgeColor}`,
        backgroundColor: "transparent",
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        cursor: onClick ? "pointer" : "default",
        transition: "all 0.15s ease",
        "&:hover": onClick
          ? {
              backgroundColor: `${badgeColor}20`,
            }
          : {},
      }}
    >
      <Typography
        variant="caption"
        sx={{
          color: badgeColor,
          fontSize: "0.7rem",
          fontWeight: 700,
          lineHeight: 1,
        }}
      >
        {label.name}
      </Typography>
    </Box>
  );
};

export default LabelBadge;
