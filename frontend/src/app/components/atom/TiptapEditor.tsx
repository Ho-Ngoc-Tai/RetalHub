"use client";

import { useEffect, useRef } from "react";
import { Box, TextField } from "@mui/material";

export interface TiptapEditorProps {
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
}

export function TiptapEditor({ value, onChange, placeholder }: TiptapEditorProps) {
    const ref = useRef<HTMLTextAreaElement | null>(null);

    useEffect(() => {
        if (ref.current && ref.current.value !== value) {
            ref.current.value = value;
        }
    }, [value]);

    return (
        <Box sx={{ p: 1 }}>
            <TextField
                inputRef={ref}
                multiline
                minRows={8}
                fullWidth
                placeholder={placeholder}
                value={value}
                onChange={(e) => onChange(e.target.value)}
                sx={{
                    "& .MuiOutlinedInput-root": {
                        alignItems: "flex-start",
                    },
                }}
            />
        </Box>
    );
}
