"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
    Alert,
    Box,
    Button,
    CircularProgress,
    Stack,
    Typography,
} from "@mui/material";
import axios from "axios";
import { api } from "@/app/lib/api";
import FormCreatePost, { FormCreatePostHandle } from "./FormCreatePost";

interface EditPostProps {
    postId: string;
}

interface PostResponse {
    id: string;
    title: string;
    description: string;
    content: string;
    coverImage?: string | null;
    category: string;
    language: string;
    status: "draft" | "published" | "archived" | "scheduled";
    scheduledFor?: string | null;
    createdAt: string;
    updatedAt: string;
}

const EditPost = ({ postId }: EditPostProps) => {
    const router = useRouter();
    const formRef = useRef<FormCreatePostHandle>(null);

    const [loading, setLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [initialValues, setInitialValues] = useState<PostResponse | null>(null);

    useEffect(() => {
        let ignore = false;

        const fetchPost = async () => {
            setLoading(true);
            setError(null);
            try {
                const response = await api.get<PostResponse>(`/posts/${postId}`);
                if (!ignore) {
                    setInitialValues(response.data);
                }
            } catch (err: unknown) {
                if (ignore) return;
                let message = "Không thể tải thông tin bài viết.";
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

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        if (!formRef.current || !initialValues) return;

        const formData = formRef.current.submitForm();
        if (!formData) return;

        const updatePayload: Record<string, unknown> = {
            title: formData.title,
            description: formData.description,
            content: formData.content,
            category: initialValues.category,
            language: initialValues.language,
            status: initialValues.status,
        };

        if (Object.prototype.hasOwnProperty.call(formData, "coverImage")) {
            updatePayload.coverImage = formData.coverImage ?? null;
        }

        if (Object.prototype.hasOwnProperty.call(formData, "scheduledFor")) {
            updatePayload.scheduledFor = formData.scheduledFor ?? null;
        }

        try {
            setIsSubmitting(true);
            setError(null);
            await api.patch(`/posts/${postId}`, updatePayload);
            router.refresh();
            router.push("/posts");
        } catch (err: unknown) {
            let message = "Không thể cập nhật bài viết. Vui lòng thử lại.";
            if (axios.isAxiosError(err)) {
                const dataMessage = err.response?.data as { message?: unknown } | undefined;
                const extracted = dataMessage?.message ?? err.message;
                if (typeof extracted === "string") {
                    message = extracted;
                } else if (extracted) {
                    message = JSON.stringify(extracted);
                }
            } else if (err instanceof Error) {
                message = err.message;
            }
            setError(message);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Box component="form" onSubmit={handleSubmit} sx={{ py: 2 }}>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                <Box>
                    <Typography variant="overline" color="primary.main" sx={{ letterSpacing: 1 }}>
                        POSTS MANAGEMENT
                    </Typography>
                    <Typography variant="h4" fontWeight={700}>
                        Chỉnh sửa bài viết
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        Cập nhật nội dung, ảnh bìa và lịch xuất bản cho bài viết này.
                    </Typography>
                </Box>
                <Stack direction="row" spacing={2}>
                    <Button variant="outlined" onClick={() => router.back()} type="button" disabled={isSubmitting}>
                        Hủy
                    </Button>
                    <Button
                        variant="contained"
                        color="primary"
                        type="submit"
                        disabled={isSubmitting || loading || !initialValues}
                    >
                        {isSubmitting ? "Đang lưu..." : "Lưu thay đổi"}
                    </Button>
                </Stack>
            </Box>

            {error && (
                <Alert severity="error" sx={{ mb: 3 }}>
                    {error}
                </Alert>
            )}

            {loading ? (
                <Stack alignItems="center" justifyContent="center" minHeight={320}>
                    <CircularProgress />
                    <Typography variant="body2" color="text.secondary" mt={2}>
                        Đang tải dữ liệu bài viết...
                    </Typography>
                </Stack>
            ) : initialValues ? (
                <FormCreatePost
                    ref={formRef}
                    initialValues={{
                        title: initialValues.title,
                        description: initialValues.description,
                        content: initialValues.content,
                        coverImage: initialValues.coverImage ?? undefined,
                        scheduledFor: initialValues.scheduledFor ?? undefined,
                    }}
                    mode="edit"
                />
            ) : (
                <Stack spacing={2} alignItems="center" justifyContent="center" minHeight={240}>
                    <Typography variant="h6">Không tìm thấy bài viết</Typography>
                    <Typography variant="body2" color="text.secondary" textAlign="center">
                        Bài viết có thể đã bị xóa hoặc bạn không có quyền truy cập.
                    </Typography>
                    <Button variant="contained" onClick={() => router.push("/posts")}>
                        Quay lại danh sách
                    </Button>
                </Stack>
            )}
        </Box>
    );
};

export default EditPost;
