"use client";

import { useEffect, useState } from "react";
import { Controller, useForm, type ControllerRenderProps } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { yupResolver } from "@hookform/resolvers/yup";
import {
  Box,
  CircularProgress,
  IconButton,
  InputAdornment,
  TextField,
  Typography,
} from "@mui/material";
import VisibilityOffOutlinedIcon from "@mui/icons-material/VisibilityOffOutlined";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import { useRouter } from "next/navigation";

import StyledButton from "@components/atom/StyledButton";
import StyledPaper from "@components/atom/StyledPaper";
import { useNotify } from "@commons/utils/useNotify.utils";
import { validateUsername } from "@commons/utils/validate/username.validate";
import yupUtils from "@commons/utils/yup.utils";
import { makeSelectSignin, signinAction } from "@stores/reducers/authSlice";

interface SigninFormValues {
  username: string;
  password: string;
}

const signinSchema = yupUtils.object({
  username: yupUtils
    .string()
    .test("isValidUsername", "Invalid email or phone number", (val: string | undefined) => {
      const validUsername = validateUsername(val);
      return validUsername.success;
    })
    .required("Username is required"),
  password: yupUtils.string().required("Password is required"),
});

export default function LoginPage() {
  const dispatch = useDispatch();
  const notify = useNotify();
  const signin = useSelector(makeSelectSignin);
  const router = useRouter();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<SigninFormValues>({
    defaultValues: {
      username: "",
      password: "",
    },
    mode: "onChange",
    resolver: yupResolver(signinSchema),
  });

  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (signin.isError) {
      // Debug: theo dõi khi login thất bại
      console.error("[LoginPage] signin failure", signin.error);
      notify.show("Login failed", "error");
    }
  }, [notify, signin.error, signin.isError]);

  useEffect(() => {
    if (signin.isSuccess) {
      console.log("[LoginPage] signin success", signin.data);
      const accessToken = (signin.data as { accessToken?: string } | null)?.accessToken;
      const refreshToken = (signin.data as { refreshToken?: string } | null)?.refreshToken;
      if (accessToken) {
        localStorage.setItem("accessToken", accessToken);
      }
      if (refreshToken) {
        localStorage.setItem("refreshToken", refreshToken);
      }

      notify.show("Login successfully", "success");
      router.push("/dashboard");
    }
  }, [notify, router, signin.data, signin.isSuccess]);

  const handleTogglePassword = () => {
    setShowPassword((prev) => !prev);
  };

  const onSubmit = (data: SigninFormValues) => {
    if (!signin.isCalling) {
      console.log("[LoginPage] dispatch signinAction", data);
      dispatch(signinAction(data));
    }
  };

  return (
    <Box
      display="flex"
      alignItems="center"
      justifyContent="center"
      minHeight="100vh"
      sx={{ backgroundColor: "background.default", p: 2 }}
    >
      <StyledPaper sx={{ width: "100%", maxWidth: 400 }}>
        <Typography
          variant="h4"
          component="h1"
          gutterBottom
          sx={{
            fontWeight: "bold",
            background: "linear-gradient(45deg, #37474f 30%, #78909c 90%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          RENTAL HUB
        </Typography>
        <Typography variant="subtitle1" color="text.secondary" align="center" sx={{ mb: 4 }}>
          Log in to continue!
        </Typography>

        <Box display="flex" flexDirection="column" gap={3} width="100%">
          <Controller
            name="username"
            control={control}
            render={({ field }: { field: ControllerRenderProps<SigninFormValues, "username"> }) => (
              <TextField
                {...field}
                fullWidth
                label="Username"
                variant="outlined"
                placeholder="Enter your email or phone number"
                required
                error={Boolean(errors.username)}
                helperText={errors.username?.message}
                slotProps={{
                  input: {
                    sx: {
                      borderRadius: "10px",
                    },
                  },
                }}
              />
            )}
          />

          <Controller
            name="password"
            control={control}
            render={({ field }: { field: ControllerRenderProps<SigninFormValues, "password"> }) => (
              <TextField
                {...field}
                fullWidth
                label="Password"
                variant="outlined"
                placeholder="Enter your password"
                type={showPassword ? "text" : "password"}
                required
                error={Boolean(errors.password)}
                helperText={errors.password?.message}
                onKeyDown={(event) => {
                  if (event.key === "Enter") {
                    void handleSubmit(onSubmit)();
                  }
                }}
                slotProps={{
                  input: {
                    sx: {
                      borderRadius: "10px",
                    },
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton onClick={handleTogglePassword} edge="end">
                          {showPassword ? <VisibilityOutlinedIcon /> : <VisibilityOffOutlinedIcon />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  },
                }}
              />
            )}
          />

          {signin.isError && (signin.error as { code?: number } | null)?.code === 401 && (
            <Typography color="error" align="center">
              Invalid username or password
            </Typography>
          )}
        </Box>

        <StyledButton
          variant="contained"
          fullWidth
          onClick={handleSubmit(onSubmit)}
          disabled={signin.isCalling}
          endIcon={signin.isCalling ? <CircularProgress size={24} /> : null}
        >
          Log in
        </StyledButton>
      </StyledPaper>
    </Box>
  );
}
