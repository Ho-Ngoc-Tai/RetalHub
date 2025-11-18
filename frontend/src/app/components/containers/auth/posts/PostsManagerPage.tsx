"use client";

import { useEffect, useMemo, useState } from "react";
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
    Tab,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Tabs,
    TextField,
    Typography,
} from "@mui/material";
import Alert from "@mui/material/Alert";
import FilterAltRoundedIcon from "@mui/icons-material/FilterAltRounded";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import FileDownloadOutlinedIcon from "@mui/icons-material/FileDownloadOutlined";
import CalendarMonthOutlinedIcon from "@mui/icons-material/CalendarMonthOutlined";
import LanguageOutlinedIcon from "@mui/icons-material/LanguageOutlined";
import { useRouter } from "next/navigation";
import axios from "axios";
import { api } from "@/app/lib/api";

interface PostItem {
    id: string;
    title: string;
    category: string;
    language: string;
    createdAt: string;
    views: number;
    status: "draft" | "published" | "archived" | "scheduled";
}

const statusLabels: Record<PostItem["status"], string> = {
    draft: "Nháp",
    published: "Published",
    archived: "Lưu trữ",
    scheduled: "Đã xuất bản",
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

    useEffect(() => {
        let ignore = false;

        const fetchPosts = async () => {
            setLoading(true);
            setError(null);
            try {
                const response = await api.get<PostItem[]>("/posts");
                if (!ignore) {
                    setPosts(response.data);
                }
            } catch (err: unknown) {
                if (!ignore) {
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
                }
            } finally {
                if (!ignore) {
                    setLoading(false);
                }
            }
        };

        fetchPosts();

        return () => {
            ignore = true;
        };
    }, []);

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
                                placeholder="Tìm kiếm bài viết"
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
                                Đặt lại
                            </Button>
                            <Button variant="contained" color="primary">
                                Tìm kiếm
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
                                        <Stack direction="row" justifyContent="flex-end" spacing={1}>
                                            <Button variant="outlined" size="small" sx={{ borderRadius: 999 }}>
                                                Xem
                                            </Button>
                                            <Button variant="contained" size="small" sx={{ borderRadius: 999 }}>
                                                Sửa
                                            </Button>
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
        </Stack>
    );
}
