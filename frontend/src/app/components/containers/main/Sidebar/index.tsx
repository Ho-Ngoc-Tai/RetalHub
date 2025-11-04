"use client";

import {
    Drawer,
    List,
    ListItemButton,
    ListItemText,
    ListItemIcon,
    Typography,
    Box,
} from "@mui/material";
import DashboardIcon from "@mui/icons-material/Dashboard";
import PeopleIcon from "@mui/icons-material/People";
import Link from "next/link";

const drawerWidth = 240;

export default function Sidebar() {
    return (
        <Drawer
            variant="permanent"
            sx={{
                width: drawerWidth,
                flexShrink: 0,
                "& .MuiDrawer-paper": {
                    width: drawerWidth,
                    boxSizing: "border-box",
                    backgroundColor: "#1976d2",
                    color: "#fff",
                },
            }}
        >
            <Box sx={{ p: 2 }}>
                <Typography variant="h6" align="center">
                    Admin Panel
                </Typography>
            </Box>
            <List>
                <ListItemButton component={Link} href="/admin" sx={{ color: "#fff" }}>
                    <ListItemIcon sx={{ color: "#fff" }}>
                        <DashboardIcon />
                    </ListItemIcon>
                    <ListItemText primary="Dashboard" />
                </ListItemButton>
                <ListItemButton component={Link} href="/user" sx={{ color: "#fff" }}>
                    <ListItemIcon sx={{ color: "#fff" }}>
                        <PeopleIcon />
                    </ListItemIcon>
                    <ListItemText primary="User" />
                </ListItemButton>
            </List>
        </Drawer>
    );
}
