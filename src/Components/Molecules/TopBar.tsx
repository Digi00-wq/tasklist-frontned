import React from "react";
import { Box, Typography, Button, TextField, InputAdornment } from "@mui/material";
import ViewColumnOutlinedIcon from "@mui/icons-material/ViewColumnOutlined";
import CalendarTodayOutlinedIcon from "@mui/icons-material/CalendarTodayOutlined";
import LabelOutlinedIcon from "@mui/icons-material/LabelOutlined";
import SearchIcon from "@mui/icons-material/Search";

interface TopBarProps {
  projectName: string;
  projectColor?: string;
  activeView: string;
  onSelectView: (view: "board" | "today" | "labels") => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

export const TopBar: React.FC<TopBarProps> = ({
  projectName,
  projectColor = "#e44232",
  activeView,
  onSelectView,
  searchQuery,
  onSearchChange,
}) => {
  return (
    <Box sx={{ px: 5, pt: 3, pb: 2, borderBottom: "1px solid #282828", mb: 3 }}>
      {/* Top Breadcrumb */}
      <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 1 }}>
        <Typography variant="body2" sx={{ color: "#888888", fontSize: "0.85rem" }}>
          Projects / <span style={{ color: projectColor, fontWeight: 600 }}>{projectName}</span>
        </Typography>

        {/* Quick Search Bar */}
        <TextField
          size="small"
          placeholder="Filter in project..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon sx={{ color: "#888888", fontSize: 16 }} />
                </InputAdornment>
              ),
            },
          }}
          sx={{
            width: 200,
            "& .MuiOutlinedInput-root": {
              color: "#ffffff",
              backgroundColor: "#222222",
              borderRadius: "8px",
              fontSize: "0.8rem",
              "& fieldset": { borderColor: "#333333" },
              "&:hover fieldset": { borderColor: "#444444" },
              "&.Mui-focused fieldset": { borderColor: "#666666" },
            },
          }}
        />
      </Box>

      {/* Main Project Name */}
      <Typography
        variant="h4"
        sx={{
          fontWeight: 700,
          color: "#ffffff",
          fontSize: "2rem",
          letterSpacing: "-0.02em",
          mb: 2,
        }}
      >
        {projectName}
      </Typography>

      {/* Sub-Navigation Tabs inside the Project: Board | Today | Labels */}
      <Box sx={{ display: "flex", gap: 1, borderBottom: "2px solid #262626", pb: 0.5 }}>
        <Button
          size="small"
          startIcon={<ViewColumnOutlinedIcon sx={{ fontSize: 18 }} />}
          onClick={() => onSelectView("board")}
          sx={{
            color: activeView === "board" ? "#ffffff" : "#888888",
            borderBottom: activeView === "board" ? "2px solid #e44232" : "none",
            borderRadius: 0,
            textTransform: "none",
            fontWeight: activeView === "board" ? 700 : 500,
            fontSize: "0.9rem",
            px: 1.5,
            py: 0.5,
            "&:hover": { color: "#ffffff", backgroundColor: "transparent" },
          }}
        >
          Board
        </Button>

        <Button
          size="small"
          startIcon={<CalendarTodayOutlinedIcon sx={{ fontSize: 18, color: "#058527" }} />}
          onClick={() => onSelectView("today")}
          sx={{
            color: activeView === "today" ? "#ffffff" : "#888888",
            borderBottom: activeView === "today" ? "2px solid #058527" : "none",
            borderRadius: 0,
            textTransform: "none",
            fontWeight: activeView === "today" ? 700 : 500,
            fontSize: "0.9rem",
            px: 1.5,
            py: 0.5,
            "&:hover": { color: "#ffffff", backgroundColor: "transparent" },
          }}
        >
          Today
        </Button>

        <Button
          size="small"
          startIcon={<LabelOutlinedIcon sx={{ fontSize: 18, color: "#e44232" }} />}
          onClick={() => onSelectView("labels")}
          sx={{
            color: activeView === "labels" ? "#ffffff" : "#888888",
            borderBottom: activeView === "labels" ? "2px solid #e44232" : "none",
            borderRadius: 0,
            textTransform: "none",
            fontWeight: activeView === "labels" ? 700 : 500,
            fontSize: "0.9rem",
            px: 1.5,
            py: 0.5,
            "&:hover": { color: "#ffffff", backgroundColor: "transparent" },
          }}
        >
          Labels
        </Button>
      </Box>
    </Box>
  );
};

export default TopBar;
