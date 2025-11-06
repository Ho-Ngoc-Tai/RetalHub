import { Button, ButtonProps } from "@mui/material";
import { FileDownload as FileDownloadIcon } from "@mui/icons-material";

interface ExcelExportButtonProps extends ButtonProps {
  onExportClick?: () => void;
  usersCount?: number;
}

export default function ExcelExportButton({
  disabled = false,
  onExportClick,
  usersCount = 0,
  ...props
}: ExcelExportButtonProps) {
  const handleClick = () => {
    if (onExportClick) {
      onExportClick();
    }
  };

  // Disable button if no users
  const isDisabled = disabled || usersCount === 0;

  return (
    <Button
      variant="contained"
      startIcon={<FileDownloadIcon />}
      onClick={handleClick}
      disabled={isDisabled}
      sx={{
        backgroundColor: "#1976d2",
        "&:hover": { backgroundColor: "#1565c0" },
        minWidth: 120,
      }}
      {...props}
    >
      Export Excel
    </Button>
  );
}
