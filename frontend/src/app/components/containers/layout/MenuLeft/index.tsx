"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useDispatch } from "react-redux";
import { Box, List, ListItemButton, ListItemIcon, ListItemText, ListSubheader } from "@mui/material";

import { adminMenus, AdminMenuAction, AdminMenuItem } from "./menuLeft.enum";
import { logoutAction } from "@/app/stores/reducers/authSlice";

export default function MenuLeft() {
    const pathname = usePathname();
    const dispatch = useDispatch();
    const menus = adminMenus();

    const handleAction = (action: AdminMenuAction | undefined) => {
        if (action === "logout") {
            dispatch(logoutAction());
        }
    };

    const renderItem = (item: AdminMenuItem) => {
        if (item.path) {
            return (
                <ListItemButton
                    key={item.label}
                    LinkComponent={Link}
                    href={item.path}
                    selected={pathname === item.path}
                >
                    <ListItemIcon sx={{ minWidth: 32, color: "primary.main" }}>{item.icon}</ListItemIcon>
                    <ListItemText primary={item.label} />
                </ListItemButton>
            );
        }

        return (
            <ListItemButton key={item.label} onClick={() => handleAction(item.action)}>
                <ListItemIcon sx={{ minWidth: 32, color: "primary.main" }}>{item.icon}</ListItemIcon>
                <ListItemText primary={item.label} />
            </ListItemButton>
        );
    };

    return (
        <Box component="nav" aria-label="Admin navigation">
            <List
                subheader={
                    <ListSubheader component="div" sx={{ backgroundColor: "transparent", color: "text.primary" }}>
                        Điều hướng nhanh
                    </ListSubheader>
                }
            >
                {menus.map((item) => renderItem(item))}
            </List>
        </Box>
    );
}
