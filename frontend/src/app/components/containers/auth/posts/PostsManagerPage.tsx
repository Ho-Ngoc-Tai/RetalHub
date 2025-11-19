"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
    Box,
    Button,
    Chip,
    Divider,
    IconButton,
    InputAdornment,
    LinearProgress,
    Paper,
    Stack,
    Switch,
    Tab,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Tabs,
    TextField,
    Tooltip,
    Typography,
} from "@mui/material";
import Alert from "@mui/material/Alert";
import FilterAltRoundedIcon from "@mui/icons-material/FilterAltRounded";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import FileDownloadOutlinedIcon from "@mui/icons-material/FileDownloadOutlined";
import CalendarMonthOutlinedIcon from "@mui/icons-material/CalendarMonthOutlined";
import LanguageOutlinedIcon from "@mui/icons-material/LanguageOutlined";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import { useRouter } from "next/navigation";
import axios from "axios";
import { api } from "@/app/lib/api";
import DialogConfirm from "@/app/components/atom/Dialog/DialogConfirm";

interface PostItem {
    id: string;
    title: string;
    category: string;
    language: string;
    createdAt: string;
    views: number;
    status: "draft" | "published" | "archived" | "scheduled";
    scheduledFor?: string | null;
    publishedAt?: string | null;
}

const statusLabels: Record<PostItem["status"], string> = {
    draft: "Nháp",
    published: "Đã xuất bản",
    archived: "Lưu trữ",
    scheduled: "Đã hẹn lịch",
};

const tabs: { value: string; label: string }[] = [
    { value: "all", label: "Tất cả" },
    { value: "draft", label: "Nháp" },
    { value: "published", label: "Đã xuất bản" },
    { value: "archived", label: "Lưu trữ" },
    { value: "scheduled", label: "Đã hẹn lịch" },
];

function formatDate(dateIso: string) {
    const date = new Date(dateIso);
    return date.toLocaleString("vi-VN", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    });
}

function renderStatusChip(status: PostItem["status"]) {
    switch (status) {
        case "published":
            return <Chip label={statusLabels[status]} color="success" variant="outlined" />;
        case "draft":
            return <Chip label={statusLabels[status]} color="warning" variant="outlined" />;
        case "archived":
            return <Chip label={statusLabels[status]} color="default" variant="outlined" />;
        case "scheduled":
            return <Chip label={statusLabels[status]} color="info" variant="outlined" />;
        default:
            return <Chip label={statusLabels[status]} variant="outlined" />;
    }
}

export default function PostsManagerPage() {
    const router = useRouter();
    const [tab, setTab] = useState("all");
    const [search, setSearch] = useState("");
    const [language, setLanguage] = useState("all");
    const [status, setStatus] = useState("all");
    const [posts, setPosts] = useState<PostItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [updatingId, setUpdatingId] = useState<string | null>(null);
    const [statusDialog, setStatusDialog] = useState<{
        open: boolean;
        post: PostItem | null;
        nextStatus: PostItem["status"] | null;
        checked: boolean;
    }>({ open: false, post: null, nextStatus: null, checked: false });

    const loadPosts = useCallback(
        async ({ silent = false, ignore }: { silent?: boolean; ignore?: { current: boolean } } = {}) => {
            if (!silent) {
                setLoading(true);
            }

            try {
                const response = await api.get<PostItem[]>("/posts");
                if (ignore?.current) return;
                setPosts(response.data);
                setError(null);
            } catch (err: unknown) {
                if (ignore?.current) return;
                let message = "Không thể tải danh sách bài viết.";
                if (axios.isAxiosError(err)) {
                    const dataMessage = err.response?.data as { message?: unknown } | undefined;
                    const extracted = dataMessage?.message ?? err.message;
                    if (typeof extracted === "string") message = extracted;
                    else if (extracted) message = JSON.stringify(extracted);
                } else if (err instanceof Error) {
                    message = err.message;
                }
                setError(message);
            } finally {
                if (ignore?.current) return;
                if (!silent) {
                    setLoading(false);
                }
            }
        },
        [],
    );

    useEffect(() => {
        const ignore = { current: false };
        loadPosts({ ignore }).catch(() => {
            // Errors handled inside loadPosts; suppress unhandled rejection warnings.
        });
        return () => {
            ignore.current = true;
        };
    }, [loadPosts]);

    const filteredPosts = useMemo(() => {
        return posts.filter((post) => {
            const matchTab = tab === "all" || post.status === tab;
            const matchLanguage = language === "all" || post.language === language;
            const matchStatus = status === "all" || post.status === status;
            const matchSearch = search.trim()
                ? post.title.toLowerCase().includes(search.toLowerCase()) ||
                post.category.toLowerCase().includes(search.toLowerCase())
                : true;
            return matchTab && matchLanguage && matchStatus && matchSearch;
        });
    }, [tab, language, status, search, posts]);

    const handleStatusToggle = async (post: PostItem, nextChecked: boolean) => {
        if (post.status !== "draft" && post.status !== "published") {
            return;
        }

        const nextStatus: PostItem["status"] = nextChecked ? "published" : "draft";

        setUpdatingId(post.id);
        setError(null);

        try {
            await api.patch(`/posts/${post.id}`, {
                status: nextStatus,
                ...(nextStatus === "published" ? { scheduledFor: null } : {}),
            });

            setPosts((prev) =>
                prev.map((item) =>
                    item.id === post.id
                        ? {
                            ...item,
                            status: nextStatus,
                        }
                        : item,
                ),
            );
            await loadPosts({ silent: true });
        } catch (err: unknown) {
            let message = "Không thể cập nhật trạng thái bài viết.";
            if (axios.isAxiosError(err)) {
                const dataMessage = err.response?.data as { message?: unknown } | undefined;
                const extracted = dataMessage?.message ?? err.message;
                if (typeof extracted === "string") {
                    message = extracted;
                }
            } else if (err instanceof Error) {
                message = err.message;
            }

            setError(message);
        } finally {
            setUpdatingId(null);
        }
    };

    const handleRequestStatusToggle = (post: PostItem, nextChecked: boolean) => {
        if (post.status !== "draft" && post.status !== "published") {
            return;
        }

        const nextStatus: PostItem["status"] = nextChecked ? "published" : "draft";
        setStatusDialog({ open: true, post, nextStatus, checked: nextChecked });
    };

    const handleCloseDialog = () => {
        setStatusDialog((prev) => ({ ...prev, open: false }));
    };

    const handleConfirmStatusToggle = async () => {
        if (!statusDialog.post) return;
        handleCloseDialog();
        await handleStatusToggle(statusDialog.post, statusDialog.checked);
    };

    const handleViewPost = (post: PostItem) => {
        if (post.status === "published") {
            window.open(`/news/${post.id}`, "_blank", "noopener,noreferrer");
            return;
        }

        router.push(`/posts/${post.id}/edit`);
    };

    const handleEditPost = (post: PostItem) => {
        router.push(`/posts/${post.id}/edit`);
    };

    return (
        <Stack spacing={3}>
            {/* Page Header */}
            <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
                <Stack spacing={0.5}>
                    <Typography variant="overline" color="primary.main" sx={{ letterSpacing: 1 }}>
                        Posts Management
                    </Typography>
                    <Typography variant="h4" fontWeight={700}>
                        Quản lý bài viết
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        Theo dõi trạng thái và tối ưu nội dung bài viết một cách trực quan và hiệu quả.
                    </Typography>
                </Stack>
                <Stack direction="row" spacing={1.5}>
                    <IconButton color="primary" sx={{ border: "1px solid", borderColor: "grey.300" }}>
                        <FileDownloadOutlinedIcon />
                    </IconButton>
                    <Button
                        variant="contained"
                        startIcon={<AddRoundedIcon />}
                        sx={{ borderRadius: 999 }}
                        onClick={() => router.push("/posts/create")}
                    >
                        Tạo bài viết mới
                    </Button>
                </Stack>
            </Stack>

            {loading && <LinearProgress sx={{ borderRadius: 999 }} />}

            {error && (
                <Alert severity="error" sx={{ borderRadius: 2 }}>
                    {error}
                </Alert>
            )}

            {/* Filters */}
            <Paper elevation={0} sx={{ p: 3, borderRadius: 3, border: "1px solid", borderColor: "grey.200" }}>
                <Stack spacing={3}>
                    <Stack direction={{ xs: "column", md: "row" }} spacing={2} alignItems={{ xs: "stretch", md: "center" }}>
                        <Stack direction="row" spacing={1.5} alignItems="center">
                            <FilterAltRoundedIcon color="primary" />
                            <Typography variant="subtitle1" fontWeight={600}>
                                Bộ lọc tìm kiếm
                            </Typography>
                        </Stack>
                        <Stack direction={{ xs: "column", md: "row" }} spacing={2} flex={1}
                            justifyContent="flex-end">
                            <TextField
                                select
                                label="Ngôn ngữ"
                                size="small"
                                value={language}
                                onChange={(e) => setLanguage(e.target.value)}
                                InputProps={{ startAdornment: <InputAdornment position="start"><LanguageOutlinedIcon fontSize="small" /></InputAdornment> }}
                                sx={{ minWidth: 160 }}
                            >
                                <option value="all">All</option>
                                <option value="vi">Vietnamese</option>
                                <option value="en">English</option>
                            </TextField>
                            <TextField
                                select
                                label="Trạng thái"
                                size="small"
                                value={status}
                                onChange={(e) => setStatus(e.target.value)}
                                sx={{ minWidth: 160 }}
                            >
                                <option value="all">All</option>
                                <option value="draft">Nháp</option>
                                <option value="published">Đã xuất bản</option>
                                <option value="archived">Lưu trữ</option>
                                <option value="scheduled">Đã hẹn lịch</option>
                            </TextField>
                            <TextField
                                type="date"
                                label="Ngày bắt đầu"
                                size="small"
                                InputLabelProps={{ shrink: true }}
                                sx={{ minWidth: 170 }}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <CalendarMonthOutlinedIcon fontSize="small" />
                                        </InputAdornment>
                                    ),
                                }}
                            />
                            <TextField
                                placeholder="Searching...."
                                size="small"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <SearchRoundedIcon fontSize="small" />
                                        </InputAdornment>
                                    ),
                                }}
                                sx={{ minWidth: 220 }}
                            />
                        </Stack>
                        <Stack direction="row" spacing={1.5}>
                            <Button variant="outlined" onClick={() => {
                                setLanguage("all");
                                setStatus("all");
                                setSearch("");
                            }}>
                                Reset
                            </Button>
                            <Button variant="contained" color="primary">
                                Filter
                            </Button>
                        </Stack>
                    </Stack>

                    <Divider sx={{ borderStyle: "dashed" }} />

                    <Tabs
                        value={tab}
                        onChange={(_, value) => setTab(value)}
                        variant="scrollable"
                        scrollButtons={false}
                        TabIndicatorProps={{
                            children: <span className="MuiTabs-indicatorSpan" />,
                        }}
                        sx={{
                            "& .MuiTabs-flexContainer": {
                                gap: 1,
                            },
                            "& .MuiTabs-indicator": {
                                display: "flex",
                                justifyContent: "center",
                                backgroundColor: "transparent",
                                height: "100%",
                                transition: "all 0.25s ease",
                            },
                            "& .MuiTabs-indicatorSpan": {
                                width: "100%",
                                borderRadius: 999,
                                backgroundColor: "primary.main",
                                boxShadow: "0 4px 12px rgba(25, 118, 210, 0.25)",
                            },
                            "& .MuiTab-root": {
                                textTransform: "none",
                                fontWeight: 600,
                                borderRadius: 999,
                                minHeight: 36,
                                minWidth: "auto",
                                px: 2.5,
                                my: 0.5,
                                color: "text.secondary",
                                position: "relative",
                                zIndex: 1,
                            },
                            "& .MuiTab-root.Mui-selected": {
                                color: "primary.contrastText",
                            },
                        }}
                    >
                        {tabs.map((item) => (
                            <Tab key={item.value} label={`${item.label}`} value={item.value} disableRipple />
                        ))}
                    </Tabs>
                </Stack>
            </Paper>

            {/* Table */}
            <Paper elevation={0} sx={{ borderRadius: 3, border: "1px solid", borderColor: "grey.200" }}>
                <TableContainer>
                    <Table>
                        <TableHead>
                            <TableRow sx={{ "& th": { fontWeight: 700, color: "text.secondary", fontSize: 13, textTransform: "uppercase" } }}>
                                <TableCell width={64}>No.</TableCell>
                                <TableCell>Tiêu đề</TableCell>
                                <TableCell width={180}>Chuyên mục</TableCell>
                                <TableCell width={180}>Ngày tạo</TableCell>
                                <TableCell width={120} align="right">Lượt xem</TableCell>
                                <TableCell width={140}>Trạng thái</TableCell>
                                <TableCell width={160} align="right">Thao tác</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {filteredPosts.map((post, index) => (
                                <TableRow key={post.id} hover sx={{ "& td": { borderBottomStyle: "dashed" } }}>
                                    <TableCell>{index + 1}</TableCell>
                                    <TableCell>
                                        <Typography fontWeight={600}>{post.title}</Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            {post.category}
                                        </Typography>
                                    </TableCell>
                                    <TableCell>{post.category}</TableCell>
                                    <TableCell>{formatDate(post.createdAt)}</TableCell>
                                    <TableCell align="right">{(post.views ?? 0).toLocaleString()}</TableCell>
                                    <TableCell>{renderStatusChip(post.status)}</TableCell>
                                    <TableCell align="right">
                                        <Stack direction="row" justifyContent="flex-end" spacing={1.5} alignItems="center">
                                            <Tooltip
                                                title={post.status === "published" ? "Xem bài viết" : "Chỉ xem được sau khi xuất bản"}
                                                placement="top"
                                                arrow
                                            >
                                                <span>
                                                    <IconButton
                                                        size="small"
                                                        color="primary"
                                                        onClick={() => handleViewPost(post)}
                                                        disabled={post.status !== "published"}
                                                    >
                                                        <VisibilityOutlinedIcon fontSize="small" />
                                                    </IconButton>
                                                </span>
                                            </Tooltip>

                                            <Tooltip
                                                title={
                                                    post.status === "published"
                                                        ? "Tắt để chuyển về nháp"
                                                        : "Bật để xuất bản bài viết"
                                                }
                                                placement="top"
                                                arrow
                                            >
                                                <span>
                                                    <Switch
                                                        size="small"
                                                        color="success"
                                                        checked={post.status === "published"}
                                                        onChange={(_, checked) => handleRequestStatusToggle(post, checked)}
                                                        disabled={
                                                            updatingId === post.id ||
                                                            (post.status !== "draft" && post.status !== "published")
                                                        }
                                                        inputProps={{ "aria-label": "toggle publish status" }}
                                                    />
                                                </span>
                                            </Tooltip>

                                            <Tooltip title="Chỉnh sửa bài viết" placement="top" arrow>
                                                <IconButton
                                                    size="small"
                                                    color="primary"
                                                    onClick={() => handleEditPost(post)}
                                                >
                                                    <EditOutlinedIcon fontSize="small" />
                                                </IconButton>
                                            </Tooltip>
                                        </Stack>
                                    </TableCell>
                                </TableRow>
                            ))}
                            {!loading && filteredPosts.length === 0 && (
                                <TableRow>
                                    <TableCell colSpan={7}>
                                        <Box py={6} textAlign="center">
                                            <Typography variant="h6" gutterBottom>
                                                Không có bài viết phù hợp
                                            </Typography>
                                            <Typography variant="body2" color="text.secondary">
                                                Thử thay đổi bộ lọc hoặc tạo bài viết mới để bắt đầu.
                                            </Typography>
                                        </Box>
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Paper>

            <DialogConfirm
                open={statusDialog.open}
                title="Xác nhận thay đổi trạng thái"
                description={
                    statusDialog.nextStatus === "published"
                        ? "Bạn có chắc chắn muốn xuất bản bài viết này?"
                        : "Bạn có chắc chắn muốn chuyển bài viết này về trạng thái nháp?"
                }
                handleClose={handleCloseDialog}
                handleApplie={handleConfirmStatusToggle}
                isLoading={statusDialog.post ? updatingId === statusDialog.post.id : false}
                lableClose="Hủy"
                lableConfirm={statusDialog.nextStatus === "published" ? "Xuất bản" : "Chuyển về nháp"}
            />
        </Stack>
    );
}
