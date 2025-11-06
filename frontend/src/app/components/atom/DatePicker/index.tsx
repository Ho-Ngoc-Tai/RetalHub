/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { DatePicker as MuiDatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { TextField, TextFieldProps, Button, IconButton, InputAdornment } from "@mui/material";
import { Clear as ClearIcon } from "@mui/icons-material";
import { forwardRef, useState } from "react";
import { format, parse, isValid } from "date-fns";
import { enUS } from "date-fns/locale";

interface DatePickerProps extends Omit<TextFieldProps, "type" | "value" | "onChange"> {
  value?: string;
  onChange?: (value: string) => void;
}

const DatePicker = forwardRef<HTMLInputElement, DatePickerProps>(({ value, onChange, ...props }, ref) => {
  const [open, setOpen] = useState(false);

  const handleDateChange = (newValue: Date | null) => {
    if (onChange) {
      const formattedDate = newValue ? format(newValue, "yyyy-MM-dd") : "";
      onChange(formattedDate);
    }
    setOpen(false);
  };

  const handleCancel = () => {
    setOpen(false);
  };

  const handleClear = (event: React.MouseEvent) => {
    event.stopPropagation();
    if (onChange) {
      onChange("");
    }
  };

  // Convert string value to Date object
  const dateValue = value ? parse(value, "yyyy-MM-dd", new Date()) : null;
  const validDateValue = dateValue && isValid(dateValue) ? dateValue : null;

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={enUS}>
      <MuiDatePicker
        open={open}
        onOpen={() => setOpen(true)}
        onClose={() => setOpen(false)}
        value={validDateValue}
        onChange={handleDateChange}
        format="dd/MM/yyyy"
        enableAccessibleFieldDOMStructure={false}
        slots={{
          textField: (params) => {
            // Extract only valid TextField props
            const { sx, ...textFieldProps } = props;

            // Filter out invalid props from params
            const { sectionListRef, areAllSectionsEmpty, ...validParams } = params as any;

            return (
              <TextField
                {...validParams}
                {...textFieldProps}
                inputRef={ref}
                InputProps={{
                  ...validParams.InputProps,
                  readOnly: true,
                  endAdornment: (
                    <>
                      <InputAdornment position="end">
                        <IconButton
                          size="small"
                          onClick={handleClear}
                          edge="end"
                          sx={{
                            color: value ? "action.active" : "transparent",
                            "&:hover": {
                              color: value ? "error.main" : "transparent",
                            },
                            visibility: value ? "visible" : "hidden",
                          }}
                        >
                          <ClearIcon fontSize="small" />
                        </IconButton>
                      </InputAdornment>
                      {validParams.InputProps?.endAdornment}
                    </>
                  ),
                }}
                inputProps={{
                  ...validParams.inputProps,
                  onClick: (e: React.MouseEvent) => {
                    e.preventDefault();
                    setOpen(true);
                  },
                }}
                sx={{
                  "& .MuiInputBase-input": {
                    cursor: "pointer",
                    caretColor: "transparent",
                    width: "100%",
                    minWidth: "120px",
                  },
                  "& .MuiInputBase-root": {
                    cursor: "pointer",
                    width: "100%",
                    minWidth: "120px",
                  },
                  width: "100%",
                  minWidth: "120px",
                  ...sx,
                }}
              />
            );
          },
          actionBar: () => (
            <Button
              onClick={handleCancel}
              variant="text"
              size="small"
              sx={{
                position: "absolute",
                top: "290px",
                left: "240px",
                zIndex: 10,
                minWidth: "50px",
                height: "32px",
                textTransform: "none",
                fontWeight: 700,
                color: "#1976d2",
                "&:hover": {
                  backgroundColor: "rgba(66, 165, 245, 0.04)",
                },
              }}
            >
              CANCEL
            </Button>
          ),
        }}
        slotProps={{
          textField: {
            placeholder: "dd/mm/yyyy",
            inputProps: {
              placeholder: "dd/mm/yyyy",
            },
          },
          openPickerButton: {
            sx: {
              cursor: "pointer",
            },
          },
          actionBar: {
            actions: [],
          },
        }}
      />
    </LocalizationProvider>
  );
});

DatePicker.displayName = "DatePicker";

export default DatePicker;
