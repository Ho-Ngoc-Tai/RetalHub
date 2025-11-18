"use client";

import { useEffect, useState } from "react";
import { Controller, useForm, type ControllerRenderProps } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { yupResolver } from "@hookform/resolvers/yup";
import {
  Box,
  Button,
  Card,
  CircularProgress,
  IconButton,
  InputAdornment,
  Tab,
  Tabs,
  TextField,
  Typography,
} from "@mui/material";
import VisibilityOffOutlinedIcon from "@mui/icons-material/VisibilityOffOutlined";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import { useRouter } from "next/navigation";

import { useNotify } from "@commons/utils/useNotify.utils";
import yupUtils from "@commons/utils/yup.utils";
import { makeSelectSignin, signinAction } from "@stores/reducers/authSlice";

interface SigninFormValues {
  email: string;
  password: string;
}

const signinSchema = yupUtils.object({
  email: yupUtils.string().email("Invalid email").required("Email is required"),
  password: yupUtils.string().required("Password is required"),
});

export default function LoginPage() {
  const dispatch = useDispatch();
  const notify = useNotify();
  const signin = useSelector(makeSelectSignin);
  const router = useRouter();
  const [tab, setTab] = useState(0);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<SigninFormValues>({
    defaultValues: {
      email: "",
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
      console.log("[LoginPage] signin success", signin.session);
      notify.show("Login successfully", "success");
      router.push("/dashboard");
    }
  }, [notify, router, signin.isSuccess, signin.session]);

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
      <Card
        sx={{
          width: 420,
          p: 4,
          borderRadius: 4,
          backgroundColor: "background.paper",
          boxShadow: "0 8px 24px rgba(0,0,0,0.3)",
        }}
      >
        <Tabs
          value={tab}
          onChange={(_, value) => setTab(value)}
          variant="fullWidth"
          sx={{ mb: 3 }}
        >
          <Tab label="Log In" />
          <Tab label="Sign Up" />
        </Tabs>

        {tab === 0 && (
          <Box display="flex" flexDirection="column" gap={2}>
            <Typography variant="h4" textAlign="center" mb={1}>
              Log In
            </Typography>
            <Controller
              name="email"
              control={control}
              render={({ field }: { field: ControllerRenderProps<SigninFormValues, "email"> }) => (
                <TextField
                  {...field}
                  fullWidth
                  label="Email"
                  type="email"
                  placeholder="Enter your email"
                  required
                  error={Boolean(errors.email)}
                  helperText={errors.email?.message}
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
              <Typography color="error" textAlign="center">
                Invalid email or password
              </Typography>
            )}

            <Button
              variant="contained"
              fullWidth
              sx={{ mt: 1 }}
              onClick={handleSubmit(onSubmit)}
              disabled={signin.isCalling}
            >
              {signin.isCalling ? <CircularProgress size={24} /> : "Submit"}
            </Button>

            <Typography variant="body2" textAlign="center" mt={1}>
              <a href="#" style={{ color: "#ffeba7" }}>
                Forgot your password?
              </a>
            </Typography>
          </Box>
        )}

        {tab === 1 && (
          <Box display="flex" flexDirection="column" gap={2}>
            <Typography variant="h4" textAlign="center" mb={1}>
              Sign Up
            </Typography>
            <Typography variant="body2" color="text.secondary" textAlign="center">
              Registration is not available yet. Please contact the administrator.
            </Typography>
            <Button variant="contained" fullWidth disabled>
              Submit
            </Button>
          </Box>
        )}
      </Card>
    </Box>
  );
}
