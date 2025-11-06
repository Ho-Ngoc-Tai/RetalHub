import { Box, CircularProgress, Typography } from "@mui/material";

export default function PageLoading({ loadingText = "Đang tải dữ liệu..." }) {
  return (
    <Box
      sx={{
        flexGrow: 1,
        height: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 2,
        textAlign: "center",
        my: 3,
      }}
    >
      <CircularProgress />
      {loadingText && <Typography>{loadingText}</Typography>}
    </Box>
  );
}
