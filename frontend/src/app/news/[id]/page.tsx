"use client";

import { useEffect, useMemo, useState, type ReactNode } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import axios from "axios";
import {
    Alert,
    Box,
    Breadcrumbs,
    Button,
    Chip,
    Container,
    Divider,
    Skeleton,
    Stack,
    Typography,
} from "@mui/material";
import { alpha } from "@mui/material/styles";
import ArrowBackRoundedIcon from "@mui/icons-material/ArrowBackRounded";
import NewspaperRoundedIcon from "@mui/icons-material/NewspaperRounded";
import ScheduleRoundedIcon from "@mui/icons-material/ScheduleRounded";
import VisibilityRoundedIcon from "@mui/icons-material/VisibilityRounded";
import { format } from "date-fns";
import { vi } from "date-fns/locale";

import { api } from "@/app/lib/api";

interface PostDetail {
    id: string;
    title: string;
    description: string;
    content: string;
    coverImage?: string | null;
    category: string;
    language: string;
    status: "draft" | "published" | "archived" | "scheduled";
    views?: number;
    createdAt: string;
    updatedAt: string;
    scheduledFor?: string | null;
}

const formatDate = (iso: string, pattern = "dd MMMM yyyy") =>
    format(new Date(iso), pattern, { locale: vi });

export default function NewsDetailPage() {
    const params = useParams<{ id: string }>();
    const router = useRouter();
    const postId = useMemo(() => {
        if (!params?.id) return null;
        return Array.isArray(params.id) ? params.id[0] : params.id;
    }, [params]);

    const [post, setPost] = useState<PostDetail | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        let ignore = false;
        const fetchPost = async () => {
            if (!postId) return;
            setLoading(true);
            setError(null);

            try {
                const response = await api.get<PostDetail>(`/posts/${postId}`);
                if (!ignore) {
                    setPost(response.data);
                }
            } catch (err: unknown) {
                if (ignore) return;
                let message = "Không thể tải nội dung bài viết.";
                if (axios.isAxiosError(err)) {
                    const dataMessage = err.response?.data as { message?: unknown } | undefined;
                    const extracted = dataMessage?.message ?? err.message;
                    if (typeof extracted === "string") {
                        message = extracted;
                    }
                } else if (err instanceof Error && err.message) {
                    message = err.message;
                }
                setError(message);
            } finally {
                if (!ignore) {
                    setLoading(false);
                }
            }
        };

        fetchPost();

        return () => {
            ignore = true;
        };
    }, [postId]);

    useEffect(() => {
        if (!loading && !post && !error && postId) {
            setError("Bài viết không tồn tại hoặc đã bị xoá.");
        }
    }, [loading, post, error, postId]);

    const coverImage = post?.coverImage?.trim();

    const handleBack = () => {
        router.push("/news");
    };

    return (
        <Box sx={{ background: "linear-gradient(180deg, #0f172a 0%, #f1f5f9 55%)", minHeight: "100vh" }}>
            <Box
                sx={{
                    background: "linear-gradient(135deg, #132145 0%, #203b74 100%)",
                    color: "#fff",
                    pb: { xs: 8, md: 12 },
                }}
            >
                <Container maxWidth="lg" sx={{ pt: { xs: 10, md: 14 } }}>
                    <Stack spacing={3}>
                        <Breadcrumbs sx={{ color: "rgba(255,255,255,0.7)" }}>
                            <Link href="/" style={{ color: "inherit", textDecoration: "none" }}>
                                Trang chủ
                            </Link>
                            <Link href="/news" style={{ color: "inherit", textDecoration: "none" }}>
                                Tin tức
                            </Link>
                            <Typography color="inherit">Bài viết</Typography>
                        </Breadcrumbs>

                        <Stack direction="row" alignItems="center" spacing={2}>
                            <Box
                                sx={{
                                    width: 56,
                                    height: 56,
                                    borderRadius: "20%",
                                    background: "rgba(255,255,255,0.1)",
                                    display: "grid",
                                    placeItems: "center",
                                }}
                            >
                                <NewspaperRoundedIcon sx={{ fontSize: 32 }} />
                            </Box>
                            <Box>
                                <Typography variant="overline" sx={{ color: "rgba(255,255,255,0.7)", letterSpacing: 1 }}>
                                    RentalHub Insights
                                </Typography>
                                <Typography variant="h3" fontWeight={800} sx={{ lineHeight: 1.15 }}>
                                    {post?.title || (loading ? "Đang tải bài viết..." : "Nội dung bài viết")}
                                </Typography>
                            </Box>
                        </Stack>

                        <Stack direction="row" alignItems={{ xs: "flex-start", md: "center" }} spacing={2}>
                            <Button
                                variant="outlined"
                                color="inherit"
                                startIcon={<ArrowBackRoundedIcon />}
                                onClick={handleBack}
                                sx={{ color: "rgba(255,255,255,0.88)", borderColor: "rgba(255,255,255,0.32)" }}
                            >
                                Quay lại
                            </Button>
                            {post && (
                                <Stack direction={{ xs: "column", sm: "row" }} spacing={1} divider={<Divider orientation="vertical" flexItem />}
                                    sx={{
                                        color: "rgba(255,255,255,0.78)",
                                        "& .MuiDivider-root": { borderColor: "rgba(255,255,255,0.25)" },
                                    }}
                                >
                                    <Stack direction="row" spacing={1} alignItems="center">
                                        <ScheduleRoundedIcon fontSize="small" />
                                        <Typography variant="body2">{formatDate(post.createdAt)}</Typography>
                                    </Stack>
                                    <Stack direction="row" spacing={1} alignItems="center">
                                        <VisibilityRoundedIcon fontSize="small" />
                                        <Typography variant="body2">{post.views?.toLocaleString() ?? "0"} lượt xem</Typography>
                                    </Stack>
                                    <Chip
                                        label={post.language.toUpperCase()}
                                        size="small"
                                        sx={{
                                            alignSelf: "flex-start",
                                            fontWeight: 600,
                                            color: "#0f172a",
                                            backgroundColor: "rgba(255,255,255,0.9)",
                                        }}
                                    />
                                </Stack>
                            )}
                        </Stack>
                    </Stack>
                </Container>
            </Box>

            <Container maxWidth="lg" sx={{ mt: { xs: -8, md: -10 }, pb: 8 }}>
                <Stack spacing={4}>
                    {loading ? (
                        <Stack spacing={3}>
                            <Skeleton variant="rounded" height={360} sx={{ borderRadius: 4, transform: "none" }} />
                            <Skeleton variant="text" height={48} sx={{ transform: "none" }} />
                            <Skeleton variant="rectangular" height={220} sx={{ borderRadius: 3, transform: "none" }} />
                        </Stack>
                    ) : error ? (
                        <Alert severity="error" sx={{ borderRadius: 2 }}>
                            {error}
                        </Alert>
                    ) : post ? (
                        <Stack spacing={4}>
                            <Box
                                sx={{
                                    position: "relative",
                                    borderRadius: 4,
                                    overflow: "hidden",
                                    border: "1px solid",
                                    borderColor: alpha("#1e293b", 0.08),
                                    boxShadow: "0 24px 60px rgba(15, 23, 42, 0.12)",
                                    background: coverImage
                                        ? undefined
                                        : "radial-gradient(circle at top left, rgba(59,130,246,0.25), transparent 55%), linear-gradient(135deg, #1e293b 0%, #0f172a 100%)",
                                    minHeight: 280,
                                }}
                            >
                                {coverImage && (
                                    <Box
                                        component="img"
                                        src={coverImage}
                                        alt={post.title}
                                        sx={{
                                            position: "absolute",
                                            inset: 0,
                                            width: "100%",
                                            height: "100%",
                                            objectFit: "cover",
                                        }}
                                        onError={(event) => {
                                            const target = event.currentTarget;
                                            target.style.display = "none";
                                        }}
                                    />
                                )}
                                <Box
                                    sx={{
                                        position: "absolute",
                                        inset: 0,
                                        background: "linear-gradient(180deg, rgba(15,23,42,0.15) 0%, rgba(15,23,42,0.75) 100%)",
                                    }}
                                />
                                <Stack spacing={2} sx={{ position: "relative", p: { xs: 3, md: 5 }, color: "#f8fafc" }}>
                                    <Stack direction="row" spacing={1} alignItems="center">
                                        <Chip
                                            label={post.category}
                                            sx={{
                                                textTransform: "uppercase",
                                                fontWeight: 700,
                                                letterSpacing: 1,
                                                color: "#0f172a",
                                                backgroundColor: "rgba(248,250,252,0.85)",
                                            }}
                                        />
                                        {post.status !== "published" && (
                                            <Chip
                                                label={post.status === "draft" ? "Nháp" : post.status === "scheduled" ? "Đã hẹn lịch" : "Lưu trữ"}
                                                color="warning"
                                                size="small"
                                            />
                                        )}
                                    </Stack>
                                    <Typography variant="h3" fontWeight={800}>
                                        {post.title}
                                    </Typography>
                                    {post.description && (
                                        <Typography variant="h6" sx={{ opacity: 0.88, maxWidth: 720 }}>
                                            {post.description}
                                        </Typography>
                                    )}
                                </Stack>
                            </Box>

                            <PaperLike>
                                <ContentRenderer html={post.content} />
                            </PaperLike>
                        </Stack>
                    ) : null}
                </Stack>
            </Container>
        </Box>
    );
}

function PaperLike({ children }: { children: ReactNode }) {
    return (
        <Box
            sx={{
                backgroundColor: "#ffffff",
                borderRadius: 3,
                border: "1px solid",
                borderColor: "divider",
                boxShadow: "0 22px 60px rgba(15, 23, 42, 0.1)",
                px: { xs: 3, md: 6 },
                py: { xs: 4, md: 6 },
            }}
        >
            {children}
        </Box>
    );
}

function ContentRenderer({ html }: { html: string }) {
    if (!html) {
        return (
            <Typography variant="body1" color="text.secondary">
                Nội dung bài viết chưa được cập nhật.
            </Typography>
        );
    }

    return (
        <Box
            sx={{
                "& .ProseMirror__root": {
                    fontSize: { xs: "1.05rem", md: "1.125rem" },
                    lineHeight: 1.8,
                    color: "#0f172a",
                    "& h1, & h2, & h3, & h4": {
                        fontWeight: 700,
                        mt: 4,
                        mb: 2,
                    },
                    "& p": {
                        mb: 2.5,
                    },
                    "& img": {
                        display: "block",
                        maxWidth: "100%",
                        borderRadius: 2,
                        boxShadow: "0 12px 40px rgba(15, 23, 42, 0.15)",
                        my: 3,
                    },
                    "& blockquote": {
                        borderLeft: "4px solid",
                        borderColor: "primary.main",
                        backgroundColor: alpha("#3b82f6", 0.08),
                        px: 3,
                        py: 2,
                        fontStyle: "italic",
                        borderRadius: 2,
                        my: 3,
                    },
                    "& ul, & ol": {
                        pl: 4,
                        mb: 3,
                    },
                    "& a": {
                        color: "primary.main",
                        fontWeight: 600,
                        textDecoration: "underline",
                        textDecorationColor: alpha("#2563eb", 0.4),
                    },
                    "& pre": {
                        backgroundColor: "rgba(15,23,42,0.92)",
                        color: "#f8fafc",
                        borderRadius: 2,
                        px: 3,
                        py: 2,
                        overflowX: "auto",
                        fontSize: "0.95rem",
                        my: 3,
                    },
                },
            }}
        >
            <div className="ProseMirror__root" dangerouslySetInnerHTML={{ __html: html }} />
        </Box>
    );
}
