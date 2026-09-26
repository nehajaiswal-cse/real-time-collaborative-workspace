import { useState } from "react";

import {
  Alert,
  Box,
  Button,
  CircularProgress,
  IconButton,
  InputAdornment,
  Paper,
  TextField,
  Typography,
} from "@mui/material";

import {
  Visibility,
  VisibilityOff,
} from "@mui/icons-material";

import { Link, useNavigate } from "react-router-dom";

import { loginUser } from "../api/authApi";

const Login = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);

  const [error, setError] = useState("");

  const [loading, setLoading] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    setError("");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const { email, password } = formData;

    // Frontend validation
    if (!email.trim()) {
      setError("Please enter your email.");
      return;
    }

    if (!password) {
      setError("Please enter your password.");
      return;
    }

    try {
      setLoading(true);
      setError("");

      // Send real data to backend
      const response = await loginUser({
        email: email.trim(),
        password,
      });

      console.log("Login successful:", response);

      // Save JWT token if backend sends one
      if (response.token) {
        localStorage.setItem("token", response.token);
      }

      // Save user if backend sends user data
      if (response.user) {
        localStorage.setItem(
          "user",
          JSON.stringify(response.user)
        );
      }

      // Redirect after successful login
      navigate("/");

    } catch (error) {
      console.error("Login failed:", error);

      setError(
        error.response?.data?.message ||
          "Invalid email or password."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background:
          "linear-gradient(135deg, #f8fafc 0%, #f4ece6 100%)",
        px: 2,
      }}
    >
      <Paper
        elevation={0}
        sx={{
          width: "100%",
          maxWidth: 440,
          p: { xs: 3, sm: 4 },
          borderRadius: 4,
          border: "1px solid #e5e7eb",
        }}
      >
        {/* Header */}

        <Box
          sx={{
            textAlign: "center",
            mb: 4,
          }}
        >
          <Typography
            sx={{
              fontSize: 28,
              fontWeight: 700,
              color: "#A9744F",
              fontFamily: "Georgia, serif",
            }}
          >
            Welcome Back
          </Typography>

          <Typography
            sx={{
              mt: 1,
              color: "#6b7280",
              fontSize: 14,
            }}
          >
            Login to your account to continue
          </Typography>
        </Box>

        {/* Error */}

        {error && (
          <Alert
            severity="error"
            sx={{
              mb: 2,
              borderRadius: 2,
            }}
          >
            {error}
          </Alert>
        )}

        {/* Form */}

        <Box
          component="form"
          onSubmit={handleSubmit}
          noValidate
        >
          {/* Email */}

          <TextField
            fullWidth
            label="Email Address"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            margin="normal"
            required
            sx={{
              "& .MuiOutlinedInput-root": {
                "&.Mui-focused fieldset": {
                  borderColor: "#A9744F",
                },
              },

              "& .MuiInputLabel-root.Mui-focused": {
                color: "#A9744F",
              },

              "& .MuiInputBase-input": {
                caretColor: "#A9744F",
              },
            }}
          />

          {/* Password */}

          <TextField
            fullWidth
            label="Password"
            name="password"
            type={showPassword ? "text" : "password"}
            value={formData.password}
            onChange={handleChange}
            margin="normal"
            required
            sx={{
              "& .MuiOutlinedInput-root": {
                "&.Mui-focused fieldset": {
                  borderColor: "#A9744F",
                },
              },

              "& .MuiInputLabel-root.Mui-focused": {
                color: "#A9744F",
              },

              "& .MuiInputBase-input": {
                caretColor: "#A9744F",
              },
            }}
            slotProps={{
              input: {
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() =>
                        setShowPassword(
                          (prev) => !prev
                        )
                      }
                      edge="end"
                    >
                      {showPassword ? (
                        <VisibilityOff />
                      ) : (
                        <Visibility />
                      )}
                    </IconButton>
                  </InputAdornment>
                ),
              },
            }}
          />

          {/* Forgot Password */}

          <Box
            sx={{
              display: "flex",
              justifyContent: "flex-end",
              mt: 1,
            }}
          >
            <Box
              component={Link}
              to="/forgot-password"
              sx={{
                color: "#A9744F",
                fontSize: 14,
                fontWeight: 600,
                textDecoration: "none",

                "&:hover": {
                  textDecoration: "underline",
                },
              }}
            >
              Forgot Password?
            </Box>
          </Box>

          {/* Login Button */}

          <Button
            type="submit"
            fullWidth
            variant="contained"
            disabled={loading}
            sx={{
              mt: 3,
              py: 1.4,
              borderRadius: 2,
              textTransform: "none",
              fontSize: 16,
              fontWeight: 600,

              background:
                "linear-gradient(135deg, #A9744F, #8B5E3C)",

              "&:hover": {
                background:
                  "linear-gradient(135deg, #8B5E3C, #6F472F)",
              },
            }}
          >
            {loading ? (
              <CircularProgress
                size={24}
                sx={{
                  color: "#fff",
                }}
              />
            ) : (
              "Login"
            )}
          </Button>
        </Box>

        {/* Register */}

        <Typography
          sx={{
            textAlign: "center",
            mt: 3,
            fontSize: 14,
            color: "#6b7280",
          }}
        >
          Don't have an account?{" "}

          <Box
            component={Link}
            to="/register"
            sx={{
              color: "#A9744F",
              fontWeight: 600,
              textDecoration: "none",

              "&:hover": {
                textDecoration: "underline",
              },
            }}
          >
            Create Account
          </Box>
        </Typography>
      </Paper>
    </Box>
  );
};

export default Login;