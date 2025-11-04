"use client";

import { AppBar, Toolbar, Typography, Avatar, Box } from "@mui/material";

export default function Header() {
    return (
        <AppBar
            position="static"
            sx={{
                ml: "240px",
                backgroundColor: "#fff",
                color: "#1976d2",
                boxShadow: "none",
                borderBottom: "1px solid #ddd",
            }}
        >
            <Toolbar sx={{ justifyContent: "space-between" }}>
                <Typography variant="h6">Dashboard</Typography>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <Typography>Admin</Typography>
                    <Avatar alt="Admin" src="/avatar.png" />
                </Box>
            </Toolbar>
        </AppBar>
    );
}
