/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import {
    Avatar,
    Menu,
    MenuItem,
    ListItemIcon,
    ListItemText,
    Divider,
    Button,
    Typography,
    ListItemButton,
} from "@mui/material";
import { Logout as LogoutIcon } from "@mui/icons-material";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { grey, orange } from "@mui/material/colors";
import { logoutAction } from "@/app/stores/reducers/authSlice";
import { HOME_PAGE } from "@/routes/webRoute";
import { makeAdminProfile } from "@/app/stores/reducers/common";
export default function AdminInfo() {
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const dispatch = useDispatch();

    const adminInfo: any = useSelector(makeAdminProfile);

    const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    const handleLogout = () => {
        dispatch(logoutAction());
        handleMenuClose();
    };
    return (
        <>
            <Button
                onClick={handleMenuOpen}
                startIcon={<Avatar sx={{ width: 24, height: 24, bgcolor: orange[500] }}>{adminInfo?.fullname?.[0]}</Avatar>}
                variant="outlined"
                // size="small"
                sx={{
                    color: "#fff",
                    border: `1px solid ${grey[600]}`,
                    p: 1,
                    borderRadius: 8,
                }}
            >
                <Typography
                    maxWidth={100}
                    sx={{
                        display: "inline-block" /* hoặc block nếu muốn full-width của container */,
                        //   max-width: 200px,      /* hoặc width: 100% / width: 200px */
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        verticalAlign: "middle" /* nếu cần canh hàng với inline elements khác */,
                        fontSize: 12,
                        width: "fit-content",
                    }}
                >
                    {adminInfo?.fullname}
                </Typography>
            </Button>

            <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleMenuClose}
                onClick={handleMenuClose}
                transformOrigin={{ horizontal: "right", vertical: "top" }}
                anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
                PaperProps={{
                    elevation: 3,
                    sx: {
                        overflow: "visible",
                        filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
                        mt: 1.5,
                        "& .MuiAvatar-root": {
                            width: 32,
                            height: 32,
                            ml: -0.5,
                            mr: 1,
                        },
                    },
                }}
            >
                <MenuItem>
                    <ListItemButton href={HOME_PAGE}>
                        <ListItemIcon>
                            <Avatar sx={{ width: 32, height: 32, bgcolor: orange[500] }}>{adminInfo?.fullname?.[0]}</Avatar>
                        </ListItemIcon>
                        <ListItemText primary={adminInfo?.fullname} secondary={adminInfo?.email} />
                    </ListItemButton>
                </MenuItem>
                <Divider />
                <MenuItem onClick={handleLogout}>
                    <ListItemIcon>
                        <LogoutIcon fontSize="small" />
                    </ListItemIcon>
                    <ListItemText>Logout</ListItemText>
                </MenuItem>
            </Menu>
        </>
    );
}
