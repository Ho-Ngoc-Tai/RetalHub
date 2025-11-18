"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Box, Typography, Button, Stack, Alert } from "@mui/material";
import axios from "axios";
import { api } from "@/app/lib/api";
import FormCreatePost, { FormCreatePostHandle } from "./FormCreatePost";

const CreatePost = () => {
    const router = useRouter();
    const formRef = useRef<FormCreatePostHandle>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (formRef.current) {
            const formData = formRef.current.submitForm();
            if (formData) {
                try {
                    setIsSubmitting(true);
                    setError(null);

                    await api.post("/posts", {
                        ...formData,
                        status: "draft",
                        category: "General",
                        language: "vi",
                    });
                    router.refresh();
                    router.push("/posts");
                } catch (err: unknown) {
                    console.error("Error creating post:", err);
                    let message = "Không thể tạo bài viết. Vui lòng thử lại.";

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
            }
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
                        Tạo bài viết mới
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        Hoàn thiện nội dung trước khi xuất bản để giữ tính nhất quán và chuyên nghiệp.
                    </Typography>
                </Box>
                <Stack direction="row" spacing={2}>
                    <Button variant="outlined" onClick={() => router.back()} type="button" disabled={isSubmitting}>
                        Hủy
                    </Button>
                    <Button variant="contained" color="primary" type="submit" disabled={isSubmitting}>
                        {isSubmitting ? "Đang lưu..." : "Lưu bài viết"}
                    </Button>
                </Stack>
            </Box>

            {error && (
                <Alert severity="error" sx={{ mb: 3 }}>
                    {error}
                </Alert>
            )}

            <FormCreatePost ref={formRef} />
        </Box>
    );
};

export default CreatePost;
