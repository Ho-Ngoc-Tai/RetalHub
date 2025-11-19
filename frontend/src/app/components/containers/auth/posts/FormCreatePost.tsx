"use client";

import { forwardRef, useEffect, useImperativeHandle, useState } from "react";
import {
    Box,
    Typography,
    TextField,
    Stack,
    Paper,
    InputAdornment,
    Switch,
    FormControlLabel,
    FormHelperText,
} from "@mui/material";
import dynamic from "next/dynamic";
import ArticleOutlinedIcon from "@mui/icons-material/ArticleOutlined";
import TitleOutlinedIcon from "@mui/icons-material/Title";
import NotesOutlinedIcon from "@mui/icons-material/Notes";
import DescriptionOutlinedIcon from "@mui/icons-material/Description";
import CalendarMonthOutlinedIcon from "@mui/icons-material/CalendarMonthOutlined";
import type { TiptapEditorProps } from "@/app/components/atom/TiptapEditor";
import AtomDateTimePicker from "@/app/components/atom/AtomDateTimePicker";

const TiptapEditor = dynamic<TiptapEditorProps>(
    () => import("@/app/components/atom/TiptapEditor").then((mod) => mod.TiptapEditor),
    {
        ssr: false,
        loading: () => <div>Loading editor...</div>,
    }
);

type FormCreatePostProps = {
    __unused?: never;
};

export interface FormCreatePostHandle {
    submitForm: () => {
        title: string;
        description: string;
        content: string;
        scheduledFor?: string;
    } | null;
}

type FormErrors = {
    title?: string;
    description?: string;
    content?: string;
    scheduledFor?: string;
};

const FormCreatePost = forwardRef<FormCreatePostHandle, FormCreatePostProps>((_, ref) => {
    const [content, setContent] = useState("");
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [scheduleEnabled, setScheduleEnabled] = useState(false);
    const [scheduledFor, setScheduledFor] = useState<Date | null>(null);
    const [errors, setErrors] = useState<FormErrors>({});

    useEffect(() => {
        if (!scheduleEnabled) {
            setScheduledFor(null);
            setErrors((prev) => ({ ...prev, scheduledFor: undefined }));
        }
    }, [scheduleEnabled]);

    const validateForm = () => {
        const newErrors: FormErrors = {};
        let isValid = true;

        if (!title.trim()) {
            newErrors.title = "Vui lòng nhập tiêu đề";
            isValid = false;
        }

        if (!description.trim()) {
            newErrors.description = "Vui lòng nhập mô tả";
            isValid = false;
        }

        const normalizedContent = content.replace(/<p><\/p>/g, "").trim();
        if (!normalizedContent) {
            newErrors.content = "Vui lòng nhập nội dung bài viết";
            isValid = false;
        }

        if (scheduleEnabled) {
            if (!scheduledFor) {
                newErrors.scheduledFor = "Vui lòng chọn thời gian xuất bản";
                isValid = false;
            } else if (scheduledFor <= new Date()) {
                newErrors.scheduledFor = "Thời gian xuất bản phải nằm trong tương lai";
                isValid = false;
            }
        }

        setErrors(newErrors);
        return isValid;
    };

    useImperativeHandle(ref, () => ({
        submitForm: () => {
            if (validateForm()) {
                const payload: {
                    title: string;
                    description: string;
                    content: string;
                    scheduledFor?: string;
                } = {
                    title,
                    description,
                    content,
                };

                if (scheduleEnabled && scheduledFor) {
                    payload.scheduledFor = scheduledFor.toISOString();
                }

                return payload;
            }
            return null;
        },
    }));

    return (
        <Stack spacing={3}>
            <Paper
                elevation={0}
                sx={{
                    p: 3,
                    borderRadius: 3,
                    border: "1px solid",
                    borderColor: "divider",
                    background: "linear-gradient(135deg, rgba(248,250,252,0.95), #ffffff)",
                }}
            >
                <Stack spacing={2.5}>
                    <Stack direction="row" spacing={2} alignItems="center">
                        <ArticleOutlinedIcon color="primary" fontSize="large" />
                        <Box>
                            <Typography variant="h6" fontWeight={600} color="text.primary">
                                Thông tin bài viết
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                Hãy cung cấp tiêu đề rõ ràng và mô tả súc tích để bài viết dễ thu hút người đọc.
                            </Typography>
                        </Box>
                    </Stack>

                    <TextField
                        fullWidth
                        label="Tiêu đề"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        error={!!errors.title}
                        helperText={errors.title}
                        required
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <TitleOutlinedIcon color="primary" fontSize="small" />
                                </InputAdornment>
                            ),
                        }}
                    />

                    <TextField
                        fullWidth
                        label="Mô tả ngắn"
                        multiline
                        minRows={3}
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        error={!!errors.description}
                        helperText={errors.description}
                        required
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <NotesOutlinedIcon color="primary" fontSize="small" />
                                </InputAdornment>
                            ),
                        }}
                    />
                </Stack>
            </Paper>

            <Paper
                elevation={0}
                sx={{
                    p: 3,
                    borderRadius: 3,
                    border: "1px solid",
                    borderColor: "divider",
                    background: "linear-gradient(135deg, rgba(248,250,252,0.95), #ffffff)",
                }}
            >
                <Stack spacing={2.5}>
                    <Stack direction="row" spacing={2} alignItems="center">
                        <CalendarMonthOutlinedIcon color="primary" fontSize="large" />
                        <Box>
                            <Typography variant="h6" fontWeight={600} color="text.primary">
                                Thiết lập lịch xuất bản
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                Bật lịch để chọn thời điểm xuất bản tự động hoặc đăng ngay lập tức.
                            </Typography>
                        </Box>
                    </Stack>

                    <FormControlLabel
                        control={
                            <Switch
                                checked={scheduleEnabled}
                                onChange={(event) => setScheduleEnabled(event.target.checked)}
                                color="primary"
                            />
                        }
                        label="Đặt lịch xuất bản"
                    />

                    <AtomDateTimePicker
                        label="Thời gian xuất bản"
                        dateValue={scheduledFor}
                        handleValue={setScheduledFor}
                        minDateTime={new Date()}
                        disabled={!scheduleEnabled}
                        error={scheduleEnabled && !!errors.scheduledFor}
                        helperText={scheduleEnabled ? errors.scheduledFor : undefined}
                    />

                    {scheduleEnabled && errors.scheduledFor && (
                        <FormHelperText error>{errors.scheduledFor}</FormHelperText>
                    )}
                </Stack>
            </Paper>

            <Paper
                elevation={0}
                sx={{
                    p: 3,
                    borderRadius: 3,
                    border: "1px solid",
                    borderColor: "divider",
                    backgroundColor: "#ffffff",
                }}
            >
                <Stack spacing={2}>
                    <Stack direction="row" spacing={2} alignItems="center">
                        <DescriptionOutlinedIcon color="primary" />
                        <Typography variant="h6" fontWeight={600} color="text.primary">
                            Nội dung chi tiết
                        </Typography>
                    </Stack>

                    <Typography variant="body2" color="text.secondary">
                        Sử dụng trình soạn thảo dưới đây để biên tập nội dung bài viết của bạn.
                    </Typography>

                    <Box
                        sx={{
                            border: "1px solid",
                            borderColor: "divider",
                            borderRadius: 2,
                            overflow: "hidden",
                            backgroundColor: "background.paper",
                        }}
                    >
                        <TiptapEditor
                            value={content}
                            onChange={setContent}
                            placeholder="Nhập nội dung bài viết..."
                        />
                    </Box>

                    {errors.content && (
                        <Typography color="error" variant="body2">
                            {errors.content}
                        </Typography>
                    )}
                </Stack>
            </Paper>
        </Stack>
    );
});

FormCreatePost.displayName = "FormCreatePost";

export default FormCreatePost;
