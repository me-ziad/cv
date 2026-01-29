// src/components/Dashboard/SeekerDashboard.tsx
import React, { useState } from "react";
import {Box,Tabs,Tab,Avatar,Typography,Button,Stack,IconButton,Drawer,List,ListItem,ListItemText,Divider,} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import LogoutIcon from "@mui/icons-material/Logout";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "../../store/store";
import Overview from "./Overview";
import Skills from "./Skills";
import Education from "./Education";
import Experience from "./Experience";
import Projects from "./Projects";
import CVUpload from "./CVUpload";
const BASE_URL = "https://node-hr.vercel.app";
const primaryBlue = "#3B82F6";

export default function SeekerDashboard() {
  const [tab, setTab] = useState(0);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();
  const { data } = useSelector((state: RootState) => state.profile);

  const handleChange = (_: any, newValue: number) => {
    setTab(newValue);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const tabs = [
    "Overview",
    "Skills",
    "Education",
    "Experience",
    "Projects",
    "CV Upload",
  ];

  return (
    <Box>
      <Box
        sx={{
          position: "fixed", 
          top: 0,
          left: 0,
          right: 0,
          zIndex: 1000,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          bgcolor: "#191919",
          px: 3,
          py: 2,
          borderBottom: "1px solid #1E293B",
        }}
      >
        {/* User Info */}
        <Stack direction="row" spacing={2} alignItems="center">
          <Avatar
           src={data?.avatar || undefined}
            sx={{ width: 45, height: 45, border: `2px solid ${primaryBlue}` }}
          />
          <Typography variant="h6" color="white" fontWeight={600}>
            {data?.name || "User"}
          </Typography>
        </Stack>

        {/* Tabs for large screens */}
        <Box sx={{ display: { xs: "none", md: "block" }, flexGrow: 1, mx: 4 }}>
          <Tabs
            value={tab}
            onChange={handleChange}
            variant="scrollable"
            scrollButtons="auto"
            sx={{
              "& .MuiTab-root": {
                color: "white",
                fontWeight: 500,
                minWidth: 100,
              },
              "& .MuiTab-root.Mui-selected": {
                color: primaryBlue,
                backgroundColor: "#1E293B",
                borderRadius: 2,
              },
            }}
          >
            {tabs.map((label, index) => (
              <Tab sx={{ cursor: "pointer" }} key={index} label={label} />
            ))}
          </Tabs>
        </Box>

        {/* Hamburger menu for small screens */}
        <Box sx={{ display: { xs: "block", md: "none" } }}>
          <IconButton
            onClick={() => setSidebarOpen(true)}
            sx={{ color: "white" }}
          >
            <MenuIcon />
          </IconButton>
        </Box>

        {/* Logout Button (desktop) */}
        <Button
          variant="outlined"
          startIcon={<LogoutIcon />}
          onClick={handleLogout}
          sx={{
            bgcolor: "  #e2171700",
            border: "1px solid red",
            color: "red",
            borderRadius: 1,
            display: { xs: "none", md: "flex" },
          }}
        >
          Logout
        </Button>
      </Box>

      {/* Sidebar for small screens */}
      <Drawer
        anchor="right"
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      >
        <Box
          sx={{
            width: 250,
            bgcolor: "#191919",
            height: "100%",
            color: "white",
          }}
        >
          <List>
            {tabs.map((label, index) => (
              <ListItem
                sx={{ cursor: "pointer" }}
                button
                key={index}
                onClick={() => {
                  setTab(index);
                  setSidebarOpen(false);
                }}
              >
                <ListItemText primary={label} />
              </ListItem>
            ))}
          </List>
          <Divider sx={{ bgcolor: "#1E293B" }} />
          {/* Logout at bottom */}
          <Box sx={{ position: "absolute", bottom: 20, width: "80%", px: 2 }}>
            <Button
              fullWidth
              variant="contained"
              startIcon={<LogoutIcon />}
              onClick={handleLogout}
              sx={{
                bgcolor: "#ef4444",
                "&:hover": { bgcolor: "#dc2626" },
                borderRadius: 2,
              }}
            >
              Logout
            </Button>
          </Box>
        </Box>
      </Drawer>

      <Box sx={{ mt: 3, p: 3 }}>
        {tab === 0 && <Overview />}
        {tab === 1 && <Skills />}
        {tab === 2 && <Education />}
        {tab === 3 && <Experience />}
        {tab === 4 && <Projects />}
        {tab === 5 && <CVUpload />}
      </Box>
    </Box>
  );
}
