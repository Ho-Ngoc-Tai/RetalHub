/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Close } from "@mui/icons-material";
import { IconButton, InputAdornment } from "@mui/material";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { enUS, vi } from "date-fns/locale";
import { useLocale } from "next-intl";
import { useEffect, useState } from "react";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
const locales = { vi, en: enUS };
type LocaleKey = keyof typeof locales;

export default function AtomDatePicker(props: {
  dateValue?: any;
  handleValue?: any;
  minDate?: any;
  maxDate?: any;
  label?: string;
  error?: boolean;
}) {
  const { dateValue, handleValue, minDate, maxDate, label, error } = props;

  const lang = useLocale();
  const localeKey: LocaleKey = lang === "vi" || lang === "en" ? lang : "en";

  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(dateValue || null);
  useEffect(() => {
    if (handleValue) handleValue(value);
  }, [value]);
  useEffect(() => {
    if (!dateValue) setValue(null);
  }, [dateValue]);

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={locales[localeKey]}>
      <DatePicker
        label={label}
        format="dd/MM/yyyy"
        views={["year", "month", "day"]}
        value={value}
        minDate={minDate || null}
        maxDate={maxDate || null}
        onChange={(newValue: any) => setValue(newValue)}
        open={open}
        onOpen={() => setOpen(true)}
        onClose={() => setOpen(false)}
        slots={{
          openPickerIcon: () => null,
        }}
        slotProps={{
          textField: {
            // placeholder: "dd/mm/yyyy",
            size: "small",
            fullWidth: true,
            onClick: () => setOpen(true),
            error: error || false,

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
