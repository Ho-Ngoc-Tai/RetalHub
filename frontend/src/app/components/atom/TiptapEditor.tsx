"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
    Box,
    Divider,
    FormControl,
    IconButton,
    MenuItem,
    Paper,
    Select,
    Stack,
    Tooltip,
    Typography,
} from "@mui/material";
import FormatBoldRoundedIcon from "@mui/icons-material/FormatBoldRounded";
import FormatItalicRoundedIcon from "@mui/icons-material/FormatItalicRounded";
import FormatUnderlinedRoundedIcon from "@mui/icons-material/FormatUnderlinedRounded";
import StrikethroughSRoundedIcon from "@mui/icons-material/StrikethroughSRounded";
import FormatColorTextRoundedIcon from "@mui/icons-material/FormatColorTextRounded";
import FormatColorFillRoundedIcon from "@mui/icons-material/FormatColorFillRounded";
import FormatClearRoundedIcon from "@mui/icons-material/FormatClearRounded";
import UndoRoundedIcon from "@mui/icons-material/UndoRounded";
import RedoRoundedIcon from "@mui/icons-material/RedoRounded";
import FormatListBulletedRoundedIcon from "@mui/icons-material/FormatListBulletedRounded";
import FormatListNumberedRoundedIcon from "@mui/icons-material/FormatListNumberedRounded";
import FormatQuoteRoundedIcon from "@mui/icons-material/FormatQuoteRounded";
import HorizontalRuleRoundedIcon from "@mui/icons-material/HorizontalRuleRounded";
import FormatAlignLeftRoundedIcon from "@mui/icons-material/FormatAlignLeftRounded";
import FormatAlignCenterRoundedIcon from "@mui/icons-material/FormatAlignCenterRounded";
import FormatAlignRightRoundedIcon from "@mui/icons-material/FormatAlignRightRounded";
import FormatAlignJustifyRoundedIcon from "@mui/icons-material/FormatAlignJustifyRounded";
import LinkRoundedIcon from "@mui/icons-material/LinkRounded";
import LinkOffRoundedIcon from "@mui/icons-material/LinkOffRounded";
import ImageRoundedIcon from "@mui/icons-material/ImageRounded";
import SmartDisplayRoundedIcon from "@mui/icons-material/SmartDisplayRounded";
import ContentCopyRoundedIcon from "@mui/icons-material/ContentCopyRounded";
import CheckRoundedIcon from "@mui/icons-material/CheckRounded";
import { alpha } from "@mui/material/styles";
import type { SxProps, Theme } from "@mui/material/styles";
import { EditorContent, useEditor } from "@tiptap/react";
import { Extension } from "@tiptap/core";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import Link from "@tiptap/extension-link";
import TextAlign from "@tiptap/extension-text-align";
import TextStyle from "@tiptap/extension-text-style";
import Color from "@tiptap/extension-color";
import Highlight from "@tiptap/extension-highlight";
import Placeholder from "@tiptap/extension-placeholder";
import Image from "@tiptap/extension-image";
import Youtube from "@tiptap/extension-youtube";

export interface TiptapEditorProps {
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
}

const FONT_FAMILIES = [
    { label: "Poppins", value: '"Poppins", sans-serif' },
    { label: "Roboto", value: '"Roboto", sans-serif' },
    { label: "Helvetica", value: '"Helvetica", sans-serif' },
    { label: "Times New Roman", value: '"Times New Roman", serif' },
    { label: "Georgia", value: "Georgia, serif" },
    { label: "Courier New", value: '"Courier New", monospace' },
];

const FONT_SIZES = [
    { label: "12", value: "12px" },
    { label: "14", value: "14px" },
    { label: "16", value: "16px" },
    { label: "18", value: "18px" },
    { label: "24", value: "24px" },
    { label: "32", value: "32px" },
    { label: "40", value: "40px" },
];

const glassToolbarSx: SxProps<Theme> = (theme) => ({
    position: "relative",
    px: { xs: 1.5, md: 2.25 },
    py: { xs: 1.25, md: 1.75 },
    borderRadius: 3,
    borderWidth: 1,
    borderStyle: "solid",
    borderColor: alpha(theme.palette.primary.main, 0.12),
    background: `linear-gradient(145deg, ${alpha(theme.palette.primary.light, 0.08)}, rgba(255,255,255,0.92))`,
    boxShadow: "0 24px 60px rgba(15, 23, 42, 0.12)",
    backdropFilter: "blur(14px)",
    overflow: "hidden",
    "&::before": {
        content: "''",
        position: "absolute",
        inset: 0,
        backgroundImage: `radial-gradient(circle at 1px 1px, ${alpha(theme.palette.primary.main, 0.08)} 1px, transparent 0)`,
        backgroundSize: "24px 24px",
        opacity: 0.55,
        pointerEvents: "none",
    },
});

const commandGroupSx: SxProps<Theme> = (theme) => ({
    display: "flex",
    alignItems: "center",
    gap: 6,
    padding: "6px 10px",
    borderRadius: 999,
    backgroundColor: alpha(theme.palette.background.paper, 0.8),
    border: `1px solid ${alpha(theme.palette.primary.main, 0.08)}`,
    backdropFilter: "blur(10px)",
});

const editorPaperSx: SxProps<Theme> = (theme) => ({
    position: "relative",
    borderRadius: 3,
    border: `1px solid ${alpha(theme.palette.primary.main, 0.14)}`,
    overflow: "hidden",
    background: `linear-gradient(160deg, rgba(255,255,255,0.98), ${alpha(theme.palette.primary.light, 0.12)})`,
    minHeight: 320,
    boxShadow: "0 28px 65px rgba(15, 23, 42, 0.14)",
});

const metricsPillSx: SxProps<Theme> = (theme) => ({
    px: 1.5,
    py: 0.75,
    borderRadius: 2,
    backgroundColor: alpha(theme.palette.primary.main, 0.08),
    border: `1px solid ${alpha(theme.palette.primary.main, 0.12)}`,
});

export function TiptapEditor({ value, onChange, placeholder }: TiptapEditorProps) {
    const textColorInputRef = useRef<HTMLInputElement | null>(null);
    const highlightColorInputRef = useRef<HTMLInputElement | null>(null);
    const [fontFamily, setFontFamily] = useState<string>(FONT_FAMILIES[0].value);
    const [fontSize, setFontSize] = useState<string>(FONT_SIZES[2].value);
    const [copied, setCopied] = useState(false);
    const [metrics, setMetrics] = useState({ words: 0, characters: 0, readingTime: "0 phút" });

    const computeMetrics = useCallback((text: string) => {
        const trimmed = text.trim();
        const words = trimmed ? trimmed.split(/\s+/).length : 0;
        const characters = trimmed.length;
        const minutes = words / 220;
        const readingTime = words === 0 ? "0 phút" : minutes < 1 ? "≈1 phút" : `${Math.ceil(minutes)} phút`;
        return { words, characters, readingTime };
    }, []);

    const FontFamilyExtension = useMemo(
        () =>
            Extension.create({
                name: "fontFamily",
                addGlobalAttributes() {
                    return [
                        {
                            types: ["textStyle"],
                            attributes: {
                                fontFamily: {
                                    default: null,
                                    parseHTML: (element) => element.style.fontFamily || null,
                                    renderHTML: (attributes) => {
                                        if (!attributes.fontFamily) return {};
                                        return { style: `font-family: ${attributes.fontFamily}` };
                                    },
                                },
                                fontSize: {
                                    default: null,
                                    parseHTML: (element) => element.style.fontSize || null,
                                    renderHTML: (attributes) => {
                                        if (!attributes.fontSize) return {};
                                        return { style: `font-size: ${attributes.fontSize}` };
                                    },
                                },
                            },
                        },
                    ];
                },
            }),
        [],
    );

    const editor = useEditor({
        extensions: [
            StarterKit.configure({
                heading: {
                    levels: [1, 2, 3, 4],
                },
            }),
            Underline,
            Link.configure({
                autolink: true,
                openOnClick: true,
                linkOnPaste: true,
                HTMLAttributes: {
                    rel: "noopener noreferrer",
                    target: "_blank",
                },
            }),
            TextAlign.configure({
                types: ["heading", "paragraph"],
            }),
            TextStyle,
            Color,
            Highlight.configure({ multicolor: true }),
            Placeholder.configure({
                placeholder: placeholder ?? "Bắt đầu soạn nội dung...",
            }),
            Image.configure({
                allowBase64: true,
                inline: false,
            }),
            Youtube.configure({
                allowFullscreen: true,
                controls: true,
                nocookie: false,
            }),
            FontFamilyExtension,
        ],
        content: value?.trim() ? value : "<p></p>",
        editorProps: {
            attributes: {
                spellcheck: "true",
                class: "ProseMirror__root",
            },
        },
        onUpdate({ editor: updatedEditor }) {
            onChange(updatedEditor.getHTML());
        },
    });

    useEffect(() => {
        if (!editor) return;
        const handler = () => {
            const attrs = editor.getAttributes("textStyle");
            setFontFamily(attrs.fontFamily ?? FONT_FAMILIES[0].value);
            setFontSize(attrs.fontSize ?? FONT_SIZES[2].value);
        };
        editor.on("selectionUpdate", handler);
        editor.on("transaction", handler);
        return () => {
            editor.off("selectionUpdate", handler);
            editor.off("transaction", handler);
        };
    }, [editor]);

    useEffect(() => {
        if (!editor) return;
        const current = editor.getHTML();
        if (value && value !== current) {
            editor.commands.setContent(value, false);
        }
        if (!value) {
            editor.commands.clearContent(false);
        }
    }, [value, editor]);

    const handleSetFontFamily = (family: string) => {
        if (!editor) return;
        editor.chain().focus().setMark("textStyle", { fontFamily: family }).run();
        setFontFamily(family);
    };

    const handleSetFontSize = (size: string) => {
        if (!editor) return;
        editor.chain().focus().setMark("textStyle", { fontSize: size }).run();
        setFontSize(size);
    };

    const handleInsertLink = () => {
        if (!editor) return;
        const previousUrl = editor.getAttributes("link").href as string | undefined;
        const url = window.prompt("Nhập đường dẫn", previousUrl ?? "https://");
        if (url === null) return;
        if (url === "") {
            editor.chain().focus().extendMarkRange("link").unsetLink().run();
            return;
        }
        editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
    };

    const handleInsertImage = () => {
        if (!editor) return;
        const url = window.prompt("Nhập URL hình ảnh", "https://");
        if (!url) return;
        editor.chain().focus().setImage({ src: url }).run();
    };

    const handleInsertVideo = () => {
        if (!editor) return;
        const url = window.prompt("Nhập URL YouTube", "https://www.youtube.com/watch?v=");
        if (!url) return;
        editor
            .chain()
            .focus()
            .setYoutubeVideo({
                src: url,
                width: 640,
                height: 360,
            })
            .run();
    };

    const handleCopyHtml = async () => {
        if (!editor) return;
        try {
            await navigator.clipboard.writeText(editor.getHTML());
            setCopied(true);
            setTimeout(() => setCopied(false), 1500);
        } catch (error) {
            console.error("Không thể sao chép nội dung", error);
        }
    };

    const toolbarDisabled = !editor;

    return (
        <Stack spacing={1.5} sx={{ width: "100%" }}>
            <Paper
                elevation={0}
                sx={{
                    px: 2,
                    py: 1.5,
                    borderRadius: 2,
                    border: "1px solid",
                    borderColor: "divider",
                    background: "linear-gradient(135deg, rgba(244, 246, 252, 0.95), #ffffff)",
                    boxShadow: "0 8px 24px rgba(15, 23, 42, 0.08)",
                }}
            >
                <Stack spacing={1.25}>
                    <Stack direction={{ xs: "column", md: "row" }} spacing={1.5} alignItems={{ xs: "stretch", md: "center" }}>
                        <Stack direction="row" spacing={1.5} alignItems="center" sx={{ flexWrap: "wrap" }}>
                            <Typography variant="body2" color="text.secondary">
                                Phông chữ
                            </Typography>
                            <FormControl size="small" sx={{ minWidth: 140 }}>
                                <Select
                                    value={fontFamily}
                                    onChange={(event) => handleSetFontFamily(event.target.value)}
                                    disabled={toolbarDisabled}
                                    renderValue={(selected) => FONT_FAMILIES.find((item) => item.value === selected)?.label ?? "Poppins"}
                                >
                                    {FONT_FAMILIES.map((item) => (
                                        <MenuItem key={item.value} value={item.value} sx={{ fontFamily: item.value }}>
                                            {item.label}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>

                            <FormControl size="small" sx={{ minWidth: 90 }}>
                                <Select
                                    value={fontSize}
                                    onChange={(event) => handleSetFontSize(event.target.value)}
                                    disabled={toolbarDisabled}
                                >
                                    {FONT_SIZES.map((item) => (
                                        <MenuItem key={item.value} value={item.value}>
                                            {item.label} pt
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Stack>

                        <Stack direction="row" spacing={1} alignItems="center" sx={{ flexWrap: "wrap" }}>
                            <Tooltip title="Sao chép HTML" arrow>
                                <IconButton onClick={handleCopyHtml} disabled={toolbarDisabled} size="small" color={copied ? "success" : "default"}>
                                    {copied ? <CheckRoundedIcon fontSize="small" /> : <ContentCopyRoundedIcon fontSize="small" />}
                                </IconButton>
                            </Tooltip>
                            <Divider orientation="vertical" flexItem sx={{ borderStyle: "dashed", display: { xs: "none", md: "block" } }} />
                            <Tooltip title="Hoàn tác" arrow>
                                <span>
                                    <IconButton size="small" onClick={() => editor?.chain().focus().undo().run()} disabled={!editor?.can().chain().focus().undo().run()}>
                                        <UndoRoundedIcon fontSize="small" />
                                    </IconButton>
                                </span>
                            </Tooltip>
                            <Tooltip title="Làm lại" arrow>
                                <span>
                                    <IconButton size="small" onClick={() => editor?.chain().focus().redo().run()} disabled={!editor?.can().chain().focus().redo().run()}>
                                        <RedoRoundedIcon fontSize="small" />
                                    </IconButton>
                                </span>
                            </Tooltip>
                        </Stack>
                    </Stack>

                    <Divider sx={{ borderStyle: "dashed" }} />

                    <Stack direction={{ xs: "column", md: "row" }} spacing={1.5} alignItems={{ xs: "stretch", md: "center" }}>
                        <Stack direction="row" spacing={0.5} alignItems="center" sx={{ flexWrap: "wrap" }}>
                            <ToolbarIconButton
                                icon={<FormatBoldRoundedIcon fontSize="small" />}
                                label="Đậm"
                                active={!!editor?.isActive("bold")}
                                onClick={() => editor?.chain().focus().toggleBold().run()}
                                disabled={!editor?.can().chain().focus().toggleBold().run()}
                            />
                            <ToolbarIconButton
                                icon={<FormatItalicRoundedIcon fontSize="small" />}
                                label="Nghiêng"
                                active={!!editor?.isActive("italic")}
                                onClick={() => editor?.chain().focus().toggleItalic().run()}
                                disabled={!editor?.can().chain().focus().toggleItalic().run()}
                            />
                            <ToolbarIconButton
                                icon={<FormatUnderlinedRoundedIcon fontSize="small" />}
                                label="Gạch chân"
                                active={!!editor?.isActive("underline")}
                                onClick={() => editor?.chain().focus().toggleUnderline().run()}
                                disabled={!editor?.can().chain().focus().toggleUnderline().run()}
                            />
                            <ToolbarIconButton
                                icon={<StrikethroughSRoundedIcon fontSize="small" />}
                                label="Gạch ngang"
                                active={!!editor?.isActive("strike")}
                                onClick={() => editor?.chain().focus().toggleStrike().run()}
                                disabled={!editor?.can().chain().focus().toggleStrike().run()}
                            />
                            <ToolbarIconButton
                                icon={<FormatQuoteRoundedIcon fontSize="small" />}
                                label="Trích dẫn"
                                active={!!editor?.isActive("blockquote")}
                                onClick={() => editor?.chain().focus().toggleBlockquote().run()}
                            />
                            <ToolbarIconButton
                                icon={<HorizontalRuleRoundedIcon fontSize="small" />}
                                label="Chèn đường kẻ"
                                onClick={() => editor?.chain().focus().setHorizontalRule().run()}
                            />
                            <ToolbarIconButton
                                icon={<FormatListBulletedRoundedIcon fontSize="small" />}
                                label="Danh sách chấm"
                                active={!!editor?.isActive("bulletList")}
                                onClick={() => editor?.chain().focus().toggleBulletList().run()}
                            />
                            <ToolbarIconButton
                                icon={<FormatListNumberedRoundedIcon fontSize="small" />}
                                label="Danh sách số"
                                active={!!editor?.isActive("orderedList")}
                                onClick={() => editor?.chain().focus().toggleOrderedList().run()}
                            />
                        </Stack>

                        <Stack direction="row" spacing={0.5} alignItems="center" sx={{ flexWrap: "wrap" }}>
                            <ToolbarIconButton
                                icon={<FormatAlignLeftRoundedIcon fontSize="small" />}
                                label="Canh trái"
                                active={!!editor?.isActive({ textAlign: "left" })}
                                onClick={() => editor?.chain().focus().setTextAlign("left").run()}
                            />
                            <ToolbarIconButton
                                icon={<FormatAlignCenterRoundedIcon fontSize="small" />}
                                label="Canh giữa"
                                active={!!editor?.isActive({ textAlign: "center" })}
                                onClick={() => editor?.chain().focus().setTextAlign("center").run()}
                            />
                            <ToolbarIconButton
                                icon={<FormatAlignRightRoundedIcon fontSize="small" />}
                                label="Canh phải"
                                active={!!editor?.isActive({ textAlign: "right" })}
                                onClick={() => editor?.chain().focus().setTextAlign("right").run()}
                            />
                            <ToolbarIconButton
                                icon={<FormatAlignJustifyRoundedIcon fontSize="small" />}
                                label="Canh đều"
                                active={!!editor?.isActive({ textAlign: "justify" })}
                                onClick={() => editor?.chain().focus().setTextAlign("justify").run()}
                            />
                        </Stack>

                        <Stack direction="row" spacing={0.5} alignItems="center" sx={{ flexWrap: "wrap" }}>
                            <input
                                ref={textColorInputRef}
                                type="color"
                                style={{ display: "none" }}
                                onChange={(event) => editor?.chain().focus().setColor(event.target.value).run()}
                            />
                            <ToolbarIconButton
                                icon={<FormatColorTextRoundedIcon fontSize="small" />}
                                label="Màu chữ"
                                onClick={() => textColorInputRef.current?.click()}
                                active={!!editor?.getAttributes("textStyle").color}
                            />
                            <input
                                ref={highlightColorInputRef}
                                type="color"
                                style={{ display: "none" }}
                                onChange={(event) => editor?.chain().focus().setHighlight({ color: event.target.value }).run()}
                            />
                            <ToolbarIconButton
                                icon={<FormatColorFillRoundedIcon fontSize="small" />}
                                label="Màu nền"
                                onClick={() => highlightColorInputRef.current?.click()}
                                active={!!editor?.isActive("highlight")}
                            />
                            <ToolbarIconButton
                                icon={<FormatClearRoundedIcon fontSize="small" />}
                                label="Xóa định dạng"
                                onClick={() => editor?.chain().focus().unsetAllMarks().clearNodes().run()}
                            />
                        </Stack>

                        <Stack direction="row" spacing={0.5} alignItems="center" sx={{ flexWrap: "wrap" }}>
                            <ToolbarIconButton
                                icon={<LinkRoundedIcon fontSize="small" />}
                                label="Chèn liên kết"
                                onClick={handleInsertLink}
                            />
                            <ToolbarIconButton
                                icon={<LinkOffRoundedIcon fontSize="small" />}
                                label="Bỏ liên kết"
                                onClick={() => editor?.chain().focus().extendMarkRange("link").unsetLink().run()}
                                disabled={!editor?.isActive("link")}
                            />
                            <ToolbarIconButton
                                icon={<ImageRoundedIcon fontSize="small" />}
                                label="Chèn hình ảnh"
                                onClick={handleInsertImage}
                            />
                            <ToolbarIconButton
                                icon={<SmartDisplayRoundedIcon fontSize="small" />}
                                label="Chèn video"
                                onClick={handleInsertVideo}
                            />
                        </Stack>
                    </Stack>
                </Stack>
            </Paper>

            <Paper
                elevation={0}
                sx={{
                    borderRadius: 2,
                    border: "1px solid",
                    borderColor: "divider",
                    overflow: "hidden",
                    backgroundColor: "#ffffff",
                    minHeight: 320,
                    boxShadow: "0 18px 40px rgba(15, 23, 42, 0.08)",
                }}
            >
                <Box
                    sx={{
                        px: 3,
                        py: 2,
                        "& .ProseMirror": {
                            outline: "none",
                            minHeight: 260,
                            fontFamily: fontFamily,
                            fontSize,
                            lineHeight: 1.7,
                            color: "text.primary",
                            background: "radial-gradient(circle at top left, rgba(240,246,255,0.35), transparent 45%)",
                            '& p:first-of-type::before': {
                                content: '""',
                            },
                            "& p": {
                                margin: "0 0 12px",
                            },
                            "& ul, & ol": {
                                paddingLeft: "1.5rem",
                            },
                            "& blockquote": {
                                borderLeft: `4px solid ${alpha("#2563eb", 0.45)}`,
                                margin: "12px 0",
                                paddingLeft: "16px",
                                fontStyle: "italic",
                                color: "text.secondary",
                            },
                            "& pre": {
                                backgroundColor: alpha("#0f172a", 0.85),
                                color: "#f8fafc",
                                borderRadius: 1.5,
                                padding: 2,
                                fontSize: "0.9rem",
                                fontFamily: '"JetBrains Mono", monospace',
                            },
                            "& img": {
                                maxWidth: "100%",
                                borderRadius: 2,
                                boxShadow: "0 12px 30px rgba(15, 23, 42, 0.35)",
                                margin: "16px auto",
                                display: "block",
                            },
                        },
                        "& .ProseMirror:focus": {
                            boxShadow: `0 0 0 2px ${alpha("#2563eb", 0.2)}`,
                        },
                        "& .ProseMirror p.is-editor-empty:first-of-type::before": {
                            color: alpha("#0f172a", 0.4),
                            content: `'${placeholder ?? "Bắt đầu soạn nội dung..."}'`,
                            float: "left",
                            height: 0,
                            pointerEvents: "none",
                        },
                    }}
                >
                    {editor ? <EditorContent editor={editor} /> : <Typography variant="body2">Đang khởi tạo trình soạn thảo...</Typography>}
                </Box>
            </Paper>
        </Stack>
    );
}

interface ToolbarIconButtonProps {
    icon: React.ReactNode;
    label: string;
    onClick: () => void;
    active?: boolean;
    disabled?: boolean;
}

function ToolbarIconButton({ icon, label, onClick, active, disabled }: ToolbarIconButtonProps) {
    return (
        <Tooltip title={label} arrow>
            <span>
                <IconButton
                    size="small"
                    onClick={onClick}
                    disabled={disabled}
                    sx={{
                        borderRadius: 1.5,
                        border: active ? "1px solid" : "1px solid transparent",
                        borderColor: active ? alpha("#2563eb", 0.6) : "transparent",
                        backgroundColor: active ? alpha("#2563eb", 0.12) : "transparent",
                        color: active ? "primary.main" : "text.secondary",
                        transition: "all 0.15s ease",
                        "&:hover": {
                            backgroundColor: active ? alpha("#2563eb", 0.2) : alpha("#1d4ed8", 0.08),
                        },
                    }}
                >
                    {icon}
                </IconButton>
            </span>
        </Tooltip>
    );
}
