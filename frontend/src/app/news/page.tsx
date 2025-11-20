"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import axios from "axios";
import {
    Alert,
    Box,
    Breadcrumbs,
    Card,
    CardActionArea,
    CardContent,
    CardMedia,
    Chip,
    Container,
    Divider,
    Grid,
    Skeleton,
    Stack,
    Typography,
} from "@mui/material";
import { alpha } from "@mui/material/styles";
import ArrowBackRoundedIcon from "@mui/icons-material/ArrowBackRounded";
import NewspaperRoundedIcon from "@mui/icons-material/NewspaperRounded";
import ShowChartRoundedIcon from "@mui/icons-material/ShowChartRounded";
import CandlestickChartRoundedIcon from "@mui/icons-material/CandlestickChartRounded";
import BoltRoundedIcon from "@mui/icons-material/BoltRounded";
import SmartDisplayRoundedIcon from "@mui/icons-material/SmartDisplayRounded";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import { api } from "@/app/lib/api";

interface PostItem {
    id: string;
    title: string;
    description: string;
    content: string;
    coverImage?: string | null;
    category: string;
    views: number;
    status: string;
    language: string;
    createdAt: string;
    updatedAt: string;
}

const categoryPalette: Record<string, { from: string; to: string }> = {
    general: { from: "#2563eb", to: "#60a5fa" },
    market: { from: "#ec4899", to: "#f97316" },
    tips: { from: "#10b981", to: "#34d399" },
    lifestyle: { from: "#6366f1", to: "#8b5cf6" },
    business: { from: "#f59e0b", to: "#facc15" },
};

const getCategoryGradient = (category: string) => {
    const key = category.toLowerCase();
    const palette = categoryPalette[key] ?? { from: "#0ea5e9", to: "#22d3ee" };
    return `linear-gradient(135deg, ${palette.from} 0%, ${palette.to} 100%)`;
};

const stripHtml = (value: string) => value.replace(/<[^>]+>/g, " ");

const getExcerpt = (content: string, limit = 220) => {
    const clean = stripHtml(content).replace(/\s+/g, " ").trim();
    if (clean.length <= limit) return clean;
    return `${clean.slice(0, limit - 1)}…`;
};

const extractFirstImage = (html: string) => {
    if (!html) return null;
    const match = html.match(/<img[^>]+src=["']([^"']+)["'][^>]*>/i);
    return match?.[1] ?? null;
};

const extractFirstYoutubeSrc = (html: string) => {
    if (!html) return null;
    const match = html.match(/<iframe[^>]+src=["']([^"']+youtube[^"']+)["'][^>]*>/i);
    return match?.[1] ?? null;
};

const getYoutubeThumbnail = (src: string) => {
    if (!src) return null;
    const idMatch = src.match(/(?:embed\/|watch\?v=|youtu\.be\/)([\w-]{11})/);
    const videoId = idMatch?.[1];
    if (!videoId) return null;
    return `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
};

const getPostMedia = (post: PostItem) => {
    const preferredImage = post.coverImage?.trim() || extractFirstImage(post.content);
    if (preferredImage) {
        return { type: "image" as const, src: preferredImage };
    }

    const youtubeSrc = extractFirstYoutubeSrc(post.content);
    if (youtubeSrc) {
        const thumbnail = getYoutubeThumbnail(youtubeSrc);
        if (thumbnail) {
            return {
                type: "video" as const,
                src: thumbnail,
            };
        }
    }

    return null;
};

const formatDate = (iso: string, pattern = "dd MMMM yyyy") =>
    format(new Date(iso), pattern, { locale: vi });

const defaultTickerItems = [
    { symbol: "BTC", name: "Bitcoin", price: 92654, change: 3.47 },
    { symbol: "ETH", name: "Ethereum", price: 4721, change: -1.26 },
    { symbol: "SOL", name: "Solana", price: 188, change: 5.12 },
    { symbol: "ARB", name: "Arbitrum", price: 16.4, change: 2.01 },
    { symbol: "DOT", name: "Polkadot", price: 11.9, change: -0.84 },
    { symbol: "ADA", name: "Cardano", price: 1.37, change: 0.63 },
];

const computePseudoTicker = (post: PostItem, index: number) => {
    const hash = [...post.id].reduce((acc, char) => acc + char.charCodeAt(0), 0) + index * 13;
    const price = Math.round((hash % 95000) / 10 + 50);
    const rawChange = ((hash % 2200) / 100 - 11).toFixed(2);
    const categoryPrefix = post.category.slice(0, 3).toUpperCase();
    const symbol = `${categoryPrefix}${(index + 1).toString().padStart(2, "0")}`;
    return {
        symbol,
        name: post.title,
        price,
        change: Number(rawChange),
    };
};

export default function NewsPage() {
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
                    setPosts(response.data ?? []);
                }
            } catch (error: unknown) {
                if (!ignore) {
                    let message = "Không thể tải danh sách bài viết. Vui lòng thử lại sau.";
                    if (axios.isAxiosError(error)) {
                        const dataMessage = error.response?.data as { message?: unknown } | undefined;
                        const extracted = dataMessage?.message ?? error.message;
                        if (typeof extracted === "string") {
                            message = extracted;
                        }
                    } else if (error instanceof Error && error.message) {
                        message = error.message;
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

    const publishedPosts = useMemo(() => posts.filter((post) => post.status === "published"), [posts]);

    const headline = publishedPosts[0];
    const others = publishedPosts.slice(1);
    const trending = others.slice(0, 3);
    const feed = others.slice(3);

    const tickerItems = useMemo(() => {
        if (publishedPosts.length === 0) {
            return defaultTickerItems;
        }

        const derived = publishedPosts.slice(0, 6).map((post, index) => computePseudoTicker(post, index));
        return [...derived, ...defaultTickerItems].slice(0, 6);
    }, [publishedPosts]);

    return (
        <Box sx={{ background: "#f3f6fd", minHeight: "100vh" }}>
            <Box
                sx={{
                    background: "linear-gradient(135deg, #132145 0%, #203b74 100%)",
                    color: "#fff",
                    pt: { xs: 10, md: 14 },
                    pb: { xs: 10, md: 16 },
                }}
            >
                <Container maxWidth="lg">
                    <Stack spacing={3}>
                        <Breadcrumbs sx={{ color: "rgba(255,255,255,0.7)" }}>
                            <Link href="/" style={{ color: "inherit", textDecoration: "none" }}>
                                Trang chủ
                            </Link>
                            <Typography color="inherit">Tin tức</Typography>
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
                                    Tin tức & bài viết nổi bật
                                </Typography>
                                <Typography variant="body1" sx={{ color: "rgba(255,255,255,0.78)", maxWidth: 520 }}>
                                    Cập nhật những câu chuyện, xu hướng và kinh nghiệm mới nhất trong hành trình thuê nhà và quản lý bất động sản.
                                </Typography>
                            </Box>
                        </Stack>

                        <Stack direction="row" spacing={2} alignItems="center">
                            <ArrowBackRoundedIcon sx={{ opacity: 0.5 }} />
                            <Typography variant="body2" sx={{ color: "rgba(255,255,255,0.7)" }}>
                                Khám phá các bài viết mới được xuất bản từ đội ngũ RentalHub.
                            </Typography>
                        </Stack>
                    </Stack>
                </Container>
            </Box>

            <Container maxWidth="lg" sx={{ mt: -12, pb: 8 }}>
                <Box
                    sx={{
                        mb: 5,
                        borderRadius: 4,
                        background: "linear-gradient(135deg, rgba(14,16,40,0.92) 0%, rgba(12,28,62,0.9) 100%)",
                        border: "1px solid",
                        borderColor: "rgba(96, 165, 250, 0.25)",
                        overflow: "hidden",
                        boxShadow: "0 20px 70px rgba(15, 23, 42, 0.4)",
                        position: "relative",
                    }}
                >
                    <Box
                        sx={{
                            position: "absolute",
                            inset: 0,
                            background: "radial-gradient(circle at 20% 20%, rgba(59,130,246,0.25) 0%, transparent 55%), radial-gradient(circle at 80% 30%, rgba(236,72,153,0.2) 0%, transparent 65%)",
                        }}
                    />
                    <Stack
                        direction={{ xs: "column", md: "row" }}
                        spacing={3}
                        sx={{ position: "relative", px: { xs: 3, md: 5 }, py: { xs: 3, md: 4 } }}
                        alignItems={{ xs: "stretch", md: "center" }}
                    >
                        <Stack spacing={1} sx={{ minWidth: { md: 220 } }}>
                            <Stack direction="row" spacing={1.5} alignItems="center">
                                <BoltRoundedIcon sx={{ color: "#facc15" }} />
                                <Typography variant="subtitle1" sx={{ color: alpha("#fff", 0.88), fontWeight: 700 }}>
                                    Crypto Pulse Board
                                </Typography>
                            </Stack>
                            <Typography variant="body2" sx={{ color: alpha("#fff", 0.65) }}>
                                Theo dõi nhịp đập thị trường: số liệu biến động mô phỏng từ các chuyên mục đang được quan tâm.
                            </Typography>
                        </Stack>
                        <Divider orientation="vertical" flexItem sx={{ display: { xs: "none", md: "block" }, borderColor: alpha("#fff", 0.08) }} />
                        <Stack
                            direction={{ xs: "column", md: "row" }}
                            spacing={{ xs: 2, md: 4 }}
                            sx={{ flex: 1, flexWrap: "wrap" }}
                        >
                            {tickerItems.map((item) => {
                                const isPositive = item.change >= 0;
                                return (
                                    <Stack
                                        key={item.symbol}
                                        spacing={0.5}
                                        sx={{
                                            minWidth: { xs: "100%", sm: 160 },
                                            px: 2.5,
                                            py: 1.5,
                                            borderRadius: 3,
                                            backgroundColor: alpha("#0ea5e9", 0.08),
                                            border: "1px solid",
                                            borderColor: alpha(isPositive ? "#4ade80" : "#f87171", 0.35),
                                        }}
                                    >
                                        <Stack direction="row" justifyContent="space-between" alignItems="center">
                                            <Stack direction="row" spacing={1} alignItems="center">
                                                <ShowChartRoundedIcon sx={{ fontSize: 18, color: alpha("#fff", 0.65) }} />
                                                <Typography variant="subtitle2" sx={{ color: "#fff", fontWeight: 700 }}>
                                                    {item.symbol}
                                                </Typography>
                                            </Stack>
                                            <Typography
                                                variant="caption"
                                                sx={{
                                                    color: isPositive ? "#4ade80" : "#f87171",
                                                    fontWeight: 600,
                                                }}
                                            >
                                                {isPositive ? "▲" : "▼"} {Math.abs(item.change).toFixed(2)}%
                                            </Typography>
                                        </Stack>
                                        <Typography variant="h6" sx={{ color: "#e0f2fe", fontWeight: 700 }}>
                                            {item.price.toLocaleString("en-US", { minimumFractionDigits: 2 })} $
                                        </Typography>
                                        <Typography variant="caption" sx={{ color: alpha("#fff", 0.55) }}>
                                            {item.name.length > 42 ? `${item.name.slice(0, 39)}…` : item.name}
                                        </Typography>
                                    </Stack>
                                );
                            })}
                        </Stack>
                    </Stack>
                </Box>

                {error && (
                    <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
                        {error}
                    </Alert>
                )}

                {loading ? (
                    <Stack spacing={4}>
                        <Skeleton variant="rounded" height={420} sx={{ borderRadius: 4, transform: "none" }} />
                        <Grid container spacing={3}>
                            {Array.from({ length: 3 }).map((_, index) => (
                                <Grid size={{ xs: 12, sm: 4 }} key={`trending-skeleton-${index}`}>
                                    <Skeleton variant="rounded" height={260} sx={{ borderRadius: 3, transform: "none" }} />
                                </Grid>
                            ))}
                        </Grid>
                        <Stack spacing={3}>
                            {Array.from({ length: 4 }).map((_, index) => (
                                <Skeleton
                                    key={`feed-skeleton-${index}`}
                                    variant="rounded"
                                    height={220}
                                    sx={{ borderRadius: 3, transform: "none" }}
                                />
                            ))}
                        </Stack>
                    </Stack>
                ) : (
                    <Stack spacing={6}>
                        {headline ? (
                            (() => {
                                const media = getPostMedia(headline);
                                return (
                                    <Card
                                        elevation={0}
                                        sx={{
                                            borderRadius: 4,
                                            overflow: "hidden",
                                            background: "linear-gradient(120deg, #ffffff 0%, #f3f6fd 100%)",
                                            boxShadow: "0 30px 80px rgba(19, 33, 69, 0.1)",
                                        }}
                                    >
                                        <CardActionArea component={Link} href={`/news/${headline.id}`} sx={{ display: "block" }}>
                                            <CardContent sx={{ p: 0 }}>
                                                <Box
                                                    sx={{
                                                        position: "relative",
                                                        minHeight: { xs: 320, md: 420 },
                                                        display: "grid",
                                                        alignItems: "end",
                                                        background: media ? undefined : getCategoryGradient(headline.category),
                                                    }}
                                                >
                                                    {media && (
                                                        <Box
                                                            component="img"
                                                            src={media.src}
                                                            alt={headline.title}
                                                            sx={{
                                                                position: "absolute",
                                                                inset: 0,
                                                                width: "100%",
                                                                height: "100%",
                                                                objectFit: "cover",
                                                                filter: media.type === "video" ? "brightness(0.75)" : undefined,
                                                            }}
                                                        />
                                                    )}
                                                    {media?.type === "video" && (
                                                        <SmartDisplayRoundedIcon
                                                            sx={{
                                                                position: "absolute",
                                                                top: 24,
                                                                right: 24,
                                                                fontSize: 48,
                                                                color: "rgba(255,255,255,0.85)",
                                                            }}
                                                        />
                                                    )}
                                                    <Box
                                                        sx={{
                                                            position: "absolute",
                                                            inset: 0,
                                                            background: "linear-gradient(180deg, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0.65) 100%)",
                                                        }}
                                                    />
                                                    <Stack spacing={3} sx={{ p: { xs: 4, md: 6 }, position: "relative", color: "#fff" }}>
                                                        <Chip
                                                            label={headline.category}
                                                            color="default"
                                                            sx={{
                                                                alignSelf: "flex-start",
                                                                fontWeight: 600,
                                                                textTransform: "uppercase",
                                                                letterSpacing: 1,
                                                                backgroundColor: "rgba(255,255,255,0.18)",
                                                                color: "inherit",
                                                                border: "1px solid rgba(255,255,255,0.24)",
                                                            }}
                                                        />
                                                        <Typography variant="overline" sx={{ letterSpacing: 2, opacity: 0.8 }}>
                                                            Bài viết nổi bật
                                                        </Typography>
                                                        <Typography variant="h3" fontWeight={800} sx={{ lineHeight: 1.15 }}>
                                                            {headline.title}
                                                        </Typography>
                                                        <Typography variant="body1" sx={{ maxWidth: { md: 680 }, opacity: 0.92 }}>
                                                            {headline.description || getExcerpt(headline.content, 320)}
                                                        </Typography>
                                                        <Stack direction={{ xs: "column", sm: "row" }} spacing={2} alignItems={{ xs: "flex-start", sm: "center" }}>
                                                            <Typography variant="body2" sx={{ opacity: 0.9 }}>
                                                                {formatDate(headline.createdAt)}
                                                            </Typography>
                                                            <Box
                                                                component="span"
                                                                sx={{
                                                                    display: { xs: "none", sm: "block" },
                                                                    width: 4,
                                                                    height: 4,
                                                                    borderRadius: "50%",
                                                                    backgroundColor: "rgba(255,255,255,0.48)",
                                                                }}
                                                            />
                                                            <Typography variant="body2" sx={{ opacity: 0.9 }}>
                                                                {headline.views?.toLocaleString()} lượt xem
                                                            </Typography>
                                                        </Stack>
                                                    </Stack>
                                                </Box>
                                            </CardContent>
                                        </CardActionArea>
                                    </Card>
                                );
                            })()
                        ) : (
                            <Alert severity="info" sx={{ borderRadius: 3 }}>
                                Hiện chưa có bài viết nào được xuất bản. Hãy quay lại sau khi quản trị viên đăng tải nội dung mới nhé!
                            </Alert>
                        )}

                        {trending.length > 0 && (
                            <Stack spacing={2}>
                                <Stack direction={{ xs: "column", md: "row" }} justifyContent="space-between" alignItems={{ xs: "flex-start", md: "center" }} spacing={1.5}>
                                    <Stack direction="row" spacing={1.5} alignItems="center">
                                        <CandlestickChartRoundedIcon sx={{ color: "primary.main" }} />
                                        <Typography variant="h5" fontWeight={700}>
                                            Xu hướng hôm nay
                                        </Typography>
                                        <Chip
                                            label="HOT"
                                            size="small"
                                            color="primary"
                                            sx={{ fontWeight: 700, letterSpacing: 1, borderRadius: 999 }}
                                        />
                                    </Stack>
                                    <Typography variant="body2" color="text.secondary" sx={{ maxWidth: 420 }}>
                                        Những câu chuyện đang dẫn đầu, giống như các cặp coin được giao dịch sôi động nhất.
                                    </Typography>
                                </Stack>
                                <Grid container spacing={3}>
                                    {trending.map((post) => {
                                        const media = getPostMedia(post);
                                        return (
                                            <Grid size={{ xs: 12, sm: 6, md: 4 }} key={post.id}>
                                                <Card
                                                    elevation={0}
                                                    sx={{
                                                        borderRadius: 3,
                                                        height: "100%",
                                                        display: "flex",
                                                        flexDirection: "column",
                                                        overflow: "hidden",
                                                        boxShadow: "0 18px 40px rgba(15, 40, 76, 0.08)",
                                                    }}
                                                >
                                                    <CardActionArea component={Link} href={`/news/${post.id}`} sx={{ height: "100%" }}>
                                                        <CardMedia sx={{ position: "relative", height: 180 }}>
                                                            {media ? (
                                                                <Box
                                                                    component="img"
                                                                    src={media.src}
                                                                    alt={post.title}
                                                                    sx={{
                                                                        position: "absolute",
                                                                        inset: 0,
                                                                        width: "100%",
                                                                        height: "100%",
                                                                        objectFit: "cover",
                                                                        filter: media.type === "video" ? "brightness(0.8)" : undefined,
                                                                    }}
                                                                />
                                                            ) : (
                                                                <Box
                                                                    sx={{
                                                                        position: "absolute",
                                                                        inset: 0,
                                                                        background: getCategoryGradient(post.category),
                                                                    }}
                                                                />
                                                            )}
                                                            {media?.type === "video" && (
                                                                <SmartDisplayRoundedIcon
                                                                    sx={{
                                                                        position: "absolute",
                                                                        top: 12,
                                                                        right: 12,
                                                                        color: "rgba(255,255,255,0.9)",
                                                                    }}
                                                                />
                                                            )}
                                                        </CardMedia>
                                                        <CardContent sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                                                            <Stack direction="row" spacing={1} alignItems="center">
                                                                <Chip
                                                                    label={post.category}
                                                                    size="small"
                                                                    sx={{ textTransform: "uppercase", fontWeight: 600 }}
                                                                />
                                                                <Chip
                                                                    label={post.language.toUpperCase()}
                                                                    size="small"
                                                                    variant="outlined"
                                                                    sx={{ fontWeight: 600 }}
                                                                />
                                                            </Stack>
                                                            <Typography variant="h6" fontWeight={700}>
                                                                {post.title}
                                                            </Typography>
                                                            <Typography variant="body2" color="text.secondary">
                                                                {post.description || getExcerpt(post.content, 160)}
                                                            </Typography>
                                                            <Typography variant="caption" color="text.secondary">
                                                                {formatDate(post.createdAt, "dd MMM yyyy")} · {post.views?.toLocaleString()} lượt xem
                                                            </Typography>
                                                        </CardContent>
                                                    </CardActionArea>
                                                </Card>
                                            </Grid>
                                        );
                                    })}
                                </Grid>
                            </Stack>
                        )}

                        {feed.length > 0 && (
                            <Stack spacing={3}>
                                <Typography variant="h5" fontWeight={700}>
                                    Bảng tin mới nhất
                                </Typography>
                                <Stack spacing={3}>
                                    {feed.map((post, index) => {
                                        const media = getPostMedia(post);
                                        return (
                                            <Card
                                                key={post.id}
                                                elevation={0}
                                                sx={{
                                                    borderRadius: 3,
                                                    overflow: "hidden",
                                                    boxShadow: "0 20px 60px rgba(19, 33, 69, 0.08)",
                                                }}
                                            >
                                                <CardActionArea component={Link} href={`/news/${post.id}`} sx={{ display: "block" }}>
                                                    <Stack direction={{ xs: "column", md: index % 2 === 0 ? "row" : "row-reverse" }}>
                                                        <Box
                                                            sx={{
                                                                flexBasis: { md: "45%" },
                                                                minHeight: { xs: 180, md: 260 },
                                                                position: "relative",
                                                                background: media ? undefined : getCategoryGradient(post.category),
                                                            }}
                                                        >
                                                            {media && (
                                                                <Box
                                                                    component="img"
                                                                    src={media.src}
                                                                    alt={post.title}
                                                                    sx={{
                                                                        position: "absolute",
                                                                        inset: 0,
                                                                        width: "100%",
                                                                        height: "100%",
                                                                        objectFit: "cover",
                                                                        filter: media.type === "video" ? "brightness(0.75)" : undefined,
                                                                    }}
                                                                />
                                                            )}
                                                            {media?.type === "video" && (
                                                                <SmartDisplayRoundedIcon
                                                                    sx={{
                                                                        position: "absolute",
                                                                        top: 16,
                                                                        right: 16,
                                                                        color: "rgba(255,255,255,0.88)",
                                                                        fontSize: 32,
                                                                    }}
                                                                />
                                                            )}
                                                        </Box>
                                                        <CardContent
                                                            sx={{
                                                                flex: 1,
                                                                display: "flex",
                                                                flexDirection: "column",
                                                                gap: 2,
                                                                p: { xs: 3, md: 4 },
                                                            }}
                                                        >
                                                            <Stack direction="row" spacing={1.5} alignItems="center">
                                                                <Chip
                                                                    label={post.category}
                                                                    size="small"
                                                                    sx={{ textTransform: "uppercase", fontWeight: 600 }}
                                                                />
                                                                <Divider orientation="vertical" flexItem sx={{ borderStyle: "dashed" }} />
                                                                <Typography variant="caption" color="text.secondary">
                                                                    {formatDate(post.createdAt, "dd MMM yyyy")} · {post.views?.toLocaleString()} lượt xem
                                                                </Typography>
                                                            </Stack>
                                                            <Typography variant="h5" fontWeight={700}>
                                                                {post.title}
                                                            </Typography>
                                                            <Typography variant="body1" color="text.secondary">
                                                                {post.description || getExcerpt(post.content)}
                                                            </Typography>
                                                            <Typography variant="body2" sx={{ color: "primary.main", fontWeight: 600 }}>
                                                                Đọc tiếp →
                                                            </Typography>
                                                        </CardContent>
                                                    </Stack>
                                                </CardActionArea>
                                            </Card>
                                        );
                                    })}
                                </Stack>
                            </Stack>
                        )}
                    </Stack>
                )}
            </Container>
        </Box>
    );
}
