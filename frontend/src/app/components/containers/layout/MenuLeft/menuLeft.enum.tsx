"use client";

import type { ReactNode } from "react";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import LoginOutlinedIcon from "@mui/icons-material/LoginOutlined";
import LogoutOutlinedIcon from "@mui/icons-material/LogoutOutlined";

import { AUTH_SIGNIN_PAGE, HOME_PAGE } from "@/routes/webRoute";

export type AdminMenuAction = "logout";

export interface AdminMenuItem {
    label: string;
    icon: ReactNode;
    path?: string;
    action?: AdminMenuAction;
}

export const adminMenus = (): AdminMenuItem[] => [
    {
        label: "Trang chủ",
        path: HOME_PAGE,
        icon: <HomeOutlinedIcon />,
    },
    {
        label: "Đăng nhập",
        path: AUTH_SIGNIN_PAGE,
        icon: <LoginOutlinedIcon />,
    },
    {
        label: "Đăng xuất",
        action: "logout",
        icon: <LogoutOutlinedIcon />,
    },
];
