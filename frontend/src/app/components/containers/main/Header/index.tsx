"use client";

import {
    AppBar,
    Toolbar,
    Typography,
    Avatar,
    Box,
    IconButton,
    Divider,
    Badge,
} from "@mui/material";
import NotificationsNoneRoundedIcon from "@mui/icons-material/NotificationsNoneRounded";

export default function Header() {

    return (
        <AppBar
            position="sticky"
            color="default"
            elevation={0}
            sx={{
                backgroundColor: "#ffffffdd",
                backdropFilter: "blur(6px)",
                borderBottom: "1px solid",
                borderColor: "grey.200",
            }}
        >
            <Toolbar
                sx={{
                    minHeight: 72,
                    px: { xs: 2.5, md: 4 },
                    display: "flex",
                    justifyContent: "space-between",
                    gap: 2,
                }}
            >
                <Box>
                    <Typography variant="h6" fontWeight={700} color="text.primary">
                        RentalHub Admin
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        Quản lý hệ thống và tối ưu vận hành mỗi ngày
                    </Typography>
                </Box>

                <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                    <IconButton color="primary" sx={{ bgcolor: "primary.50" }}>
                        <Badge color="error" variant="dot" overlap="circular">
                            <NotificationsNoneRoundedIcon />
                        </Badge>
                    </IconButton>

                    <Divider orientation="vertical" flexItem />

                    <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                        <Box textAlign="right">
                            <Typography variant="subtitle2" fontWeight={600}>
                                Admin
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                                administrator@rentalhub.com
                            </Typography>
                        </Box>
                        <Avatar alt="Admin" src="/avatar.png" sx={{ width: 40, height: 40 }} />
                    </Box>
                </Box>
            </Toolbar>
        </AppBar>
    );
}
