"use client";

import type { ReactNode } from "react";
import { useMemo, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    alpha,
    Box,
    Collapse,
    Drawer,
    List,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    ListSubheader,
    Typography,
} from "@mui/material";
import SpaceDashboardRoundedIcon from "@mui/icons-material/SpaceDashboardRounded";
import PeopleAltRoundedIcon from "@mui/icons-material/PeopleAltRounded";
import ArticleRoundedIcon from "@mui/icons-material/ArticleRounded";
import EditNoteRoundedIcon from "@mui/icons-material/EditNoteRounded";
import LibraryBooksRoundedIcon from "@mui/icons-material/LibraryBooksRounded";
import SettingsRoundedIcon from "@mui/icons-material/SettingsRounded";
import PublicRoundedIcon from "@mui/icons-material/PublicRounded";
import ExpandMoreRoundedIcon from "@mui/icons-material/ExpandMoreRounded";
import FiberManualRecordRoundedIcon from "@mui/icons-material/FiberManualRecordRounded";

const drawerWidth = 280;

type NavItem = {
    label: string;
    icon: ReactNode;
    href?: string;
    children?: NavItem[];
};

const navSections: { title: string; items: NavItem[] }[] = [
    {
        title: "Tổng quan",
        items: [
            {
                label: "Bảng điều khiển",
                icon: <SpaceDashboardRoundedIcon fontSize="small" />,
                href: "/admin",
            },
        ],
    },
    {
        title: "Quản trị",
        items: [
            {
                label: "Quản lý người dùng",
                icon: <PeopleAltRoundedIcon fontSize="small" />,
                href: "/user",
            },
            {
                label: "Quản lý bài viết",
                icon: <ArticleRoundedIcon fontSize="small" />,
                children: [
                    {
                        label: "Danh sách bài viết",
                        icon: <LibraryBooksRoundedIcon fontSize="small" />,
                        href: "/posts",
                    },
                    {
                        label: "Tạo bài viết mới",
                        icon: <EditNoteRoundedIcon fontSize="small" />,
                        href: "/posts/create",
                    },
                ],
            },
        ],
    },
    {
        title: "Hệ thống",
        items: [
            {
                label: "Cài đặt",
                icon: <SettingsRoundedIcon fontSize="small" />,
                href: "/settings",
            },
        ],
    },
    {
        title: "Trang công khai",
        items: [
            {
                label: "Trang tin tức",
                icon: <PublicRoundedIcon fontSize="small" />,
                href: "/news",
            },
        ],
    },
];

const baseTextColor = "#cbd5f5";

export default function Sidebar() {
    const pathname = usePathname();
    const [openMap, setOpenMap] = useState<Record<string, boolean>>(() => {
        const initial: Record<string, boolean> = {};
        navSections.forEach((section) => {
            section.items.forEach((item) => {
                if (item.children) {
                    initial[item.label] = true;
                }
            });
        });
        return initial;
    });

    const toggleCollapse = (label: string) => {
        setOpenMap((prev) => ({ ...prev, [label]: !prev[label] }));
    };

    const isItemActive = (item: NavItem): boolean => {
        if (!item.href) return false;
        if (pathname === item.href) return true;
        return pathname.startsWith(`${item.href}/`);
    };

    const renderNavItem = (item: NavItem) => {
        const hasChildren = Boolean(item.children && item.children.length > 0);
        const active = isItemActive(item);

        const buttonStyles = {
            borderRadius: 2,
            mb: 0.5,
            px: 2,
            py: 1,
            color: active ? "#fff" : alpha(baseTextColor, 0.72),
            background: active
                ? "linear-gradient(98deg, rgba(69,125,247,0.35) 0%, rgba(69,125,247,0.15) 100%)"
                : "transparent",
            boxShadow: active ? "0 12px 24px rgba(15, 40, 76, 0.35)" : "none",
            transition: "all 0.25s ease",
            display: "flex",
            alignItems: "center",
            gap: 1,
            justifyContent: "flex-start",
            pr: hasChildren ? 1.5 : 2,
            "&:hover": {
                background: active
                    ? "linear-gradient(98deg, rgba(69,125,247,0.4) 0%, rgba(69,125,247,0.2) 100%)"
                    : alpha("#ffffff", 0.06),
                color: "#fff",
                transform: "translateX(4px)",
                "& .MuiListItemIcon-root": {
                    color: "#fff",
                },
            },
            "& .MuiListItemIcon-root": {
                minWidth: 36,
                color: active ? "#fff" : alpha(baseTextColor, 0.6),
                transition: "color 0.3s ease",
            },
        } as const;

        const buttonProps = hasChildren
            ? {
                onClick: () => toggleCollapse(item.label),
                component: "button" as const,
            }
            : item.href
                ? {
                    component: Link,
                    href: item.href,
                }
                : {};

        return (
            <Box key={item.label} sx={{ width: "100%" }}>
                <ListItemButton {...buttonProps} sx={buttonStyles}>
                    <ListItemIcon>{item.icon}</ListItemIcon>
                    <ListItemText
                        primary={item.label}
                        primaryTypographyProps={{
                            fontWeight: 600,
                            fontSize: 14,
                            letterSpacing: 0.2,
                        }}
                    />
                    {hasChildren && (
                        <ExpandMoreRoundedIcon
                            sx={{
                                fontSize: 18,
                                transform: openMap[item.label] ? "rotate(180deg)" : "rotate(90deg)",
                                transition: "transform 0.3s ease",
                                color: active ? "#fff" : alpha(baseTextColor, 0.6),
                            }}
                        />
                    )}
                </ListItemButton>

                {hasChildren && (
                    <Collapse in={openMap[item.label]} timeout="auto" unmountOnExit>
                        <List disablePadding sx={{ pl: 1 }}>
                            {item.children?.map((child) => {
                                const childActive = isItemActive(child);

                                return (
                                    <ListItemButton
                                        key={child.label}
                                        component={Link}
                                        href={child.href ?? "#"}
                                        sx={{
                                            borderRadius: 2,
                                            pl: 7,
                                            pr: 2,
                                            py: 0.9,
                                            mb: 0.25,
                                            color: childActive ? "#fff" : alpha(baseTextColor, 0.7),
                                            backgroundColor: childActive ? alpha("#5779f7", 0.25) : "transparent",
                                            transition: "all 0.25s ease",
                                            "&:hover": {
                                                backgroundColor: alpha("#5779f7", 0.28),
                                                color: "#fff",
                                                transform: "translateX(6px)",
                                            },
                                            "& .MuiListItemIcon-root": {
                                                minWidth: 28,
                                                color: childActive ? "#fff" : alpha(baseTextColor, 0.55),
                                            },
                                        }}
                                    >
                                        <ListItemIcon>
                                            {child.icon ?? (
                                                <FiberManualRecordRoundedIcon sx={{ fontSize: 10 }} />
                                            )}
                                        </ListItemIcon>
                                        <ListItemText
                                            primary={child.label}
                                            primaryTypographyProps={{
                                                fontSize: 13,
                                                fontWeight: 600,
                                                letterSpacing: 0.2,
                                            }}
                                        />
                                    </ListItemButton>
                                );
                            })}
                        </List>
                    </Collapse>
                )}
            </Box>
        );
    };

    const sidebarPaperStyles = useMemo(
        () => ({
            width: drawerWidth,
            boxSizing: "border-box",
            borderRight: "none",
            backgroundImage: "linear-gradient(180deg, #0b1729 0%, #111f38 35%, #0b1424 100%)",
            color: "#f8fbff",
            paddingBottom: 3,
            display: "flex",
            flexDirection: "column",
        }),
        []
    );

    return (
        <Drawer
            variant="permanent"
            sx={{
                width: drawerWidth,
                flexShrink: 0,
                "& .MuiDrawer-paper": sidebarPaperStyles,
            }}
        >
            <Box
                sx={{
                    px: 1,
                    py: 1,
                    display: "flex",
                    alignItems: "center",
                    gap: 1.5,
                    background: "linear-gradient(135deg, rgba(87,121,247,0.25) 0%, rgba(36,65,156,0.1) 100%)",
                    borderBottom: "1px solid rgba(255,255,255,0.04)",
                }}
            >
                <Box
                    sx={{
                        width: 44,
                        height: 44,
                        borderRadius: 2,
                        background: "linear-gradient(135deg, #facc15 0%, #f97316 100%)",
                        display: "grid",
                        placeItems: "center",
                        boxShadow: "0 10px 25px rgba(248, 204, 0, 0.35)",
                        color: "#0f172a",
                        fontWeight: 700,
                        fontSize: 20,
                    }}
                >
                    RH
                </Box>
                <Box>
                    <Typography variant="subtitle1" fontWeight={700} sx={{ letterSpacing: 0.8 }}>
                        RentalHub Admin
                    </Typography>
                    <Typography variant="body2" sx={{ color: alpha("#ffffff", 0.6) }}>
                        Điều khiển toàn bộ hệ thống
                    </Typography>
                </Box>
            </Box>

            <Box sx={{ flex: 1, overflowY: "auto" }}>
                {navSections.map((section) => (
                    <List
                        key={section.title}
                        disablePadding
                        subheader={
                            <ListSubheader
                                disableSticky
                                sx={{
                                    pl: 2,
                                    pr: 0,
                                    py: 1,
                                    bgcolor: "transparent",
                                    color: alpha("#ffffff", 0.5),
                                    textTransform: "uppercase",
                                    letterSpacing: 1,
                                    fontSize: 12,
                                    fontWeight: 700,
                                }}
                            >
                                {section.title}
                            </ListSubheader>
                        }
                    >
                        {section.items.map((item) => renderNavItem(item))}
                    </List>
                ))}
            </Box>

            {/* <Box sx={{ px: 3, pb: 3, pt: 2, borderTop: "1px solid rgba(255,255,255,0.04)" }}>
                <Typography variant="caption" sx={{ color: alpha("#ffffff", 0.5), display: "block" }}>
                    © {new Date().getFullYear()} RentalHub Platform
                </Typography>
                <Typography variant="caption" sx={{ color: alpha("#ffffff", 0.35) }}>
                    Luôn cập nhật dữ liệu theo thời gian thực.
                </Typography>
            </Box> */}
        </Drawer>
    );
}
