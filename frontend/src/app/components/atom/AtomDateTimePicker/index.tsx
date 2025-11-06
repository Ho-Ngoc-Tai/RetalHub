/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Close } from "@mui/icons-material";
import { IconButton, InputAdornment } from "@mui/material";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { enUS, vi } from "date-fns/locale";
import { useLocale } from "next-intl";
import { useEffect, useState } from "react";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";

const locales = { vi, en: enUS };
type LocaleKey = keyof typeof locales;

export default function AtomDateTimePicker(props: {
  dateValue?: any;
  handleValue?: any;
  minDateTime?: any;
  maxDateTime?: any;
  label?: string;
  error?: boolean;
  helperText?: string;
  disabled?: boolean;
}) {
  const { dateValue, handleValue, minDateTime, maxDateTime, label, error, helperText, disabled } = props;

  const lang = useLocale();
  const localeKey: LocaleKey = lang === "vi" || lang === "en" ? lang : "en";

  const [open, setOpen] = useState(false);
  const [value, setValue] = useState<any>(dateValue || null);

  // Gửi giá trị ra ngoài khi thay đổi
  useEffect(() => {
    if (handleValue) handleValue(value);
  }, [value]);

  // Reset về null khi prop dateValue đổi
  useEffect(() => {
    if (!dateValue) setValue(null);
  }, [dateValue]);

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={locales[localeKey]}>
      <DateTimePicker
        label={label}
        disabled={disabled}
        format="dd/MM/yyyy HH:mm:ss"
        value={value}
        minDateTime={minDateTime || null}
        maxDateTime={maxDateTime || null}
        onChange={(newValue: any) => setValue(newValue)}
        open={open}
        onOpen={() => setOpen(true)}
        onClose={() => setOpen(false)}
        slots={{
          openPickerIcon: () => null,
        }}
        slotProps={{
          textField: {
            size: "small",
            fullWidth: true,
            error,
            helperText,
            onClick: () => setOpen(true),
            InputProps: {
              startAdornment: (
                <InputAdornment position="start">
                  <CalendarMonthIcon />
                </InputAdornment>
              ),
              endAdornment: value && (
                <InputAdornment position="end">
                  <IconButton
                    onClick={(event) => {
                      event.stopPropagation();
                      setValue(null);
                    }}
                    size="small"
                  >
                    <Close fontSize="small" />
                  </IconButton>
                </InputAdornment>
              ),
            },
          },
        }}
      />
    </LocalizationProvider>
  );
}
