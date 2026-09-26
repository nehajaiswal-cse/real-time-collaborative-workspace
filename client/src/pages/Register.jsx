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

import { useNavigate, Link } from "react-router-dom";
import { registerUser } from "../api/authApi";

const Register = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] =
    useState(false);

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

    const {
      name,
      email,
      password,
      confirmPassword,
    } = formData;

    if (!name.trim()) {
      setError("Please enter your name.");
      return;
    }

    if (!email.trim()) {
      setError("Please enter your email.");
      return;
    }

    if (!password) {
      setError("Please enter a password.");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const response = await registerUser({
        name: name.trim(),
        email: email.trim(),
        password,
      });

      console.log("Registration successful:", response);

      navigate("/login");
    } catch (error) {
      console.error("Registration failed:", error);

      setError(
        error.response?.data?.message ||
        "Registration failed. Please try again."
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
          "linear-gradient(135deg, #f8fafc 0%, #eef2ff 100%)",
        px: 2,
      }}
    >
      <Paper
        elevation={0}
        sx={{
          minHeight: "80vh",
          width: "100%",
          maxWidth: 440,
          p: { xs: 3, sm: 4 },
          borderRadius: 4,
          border: "1px solid #e5e7eb",
        }}
      >
        {/* Header */}

        <Box sx={{ textAlign: "center", mb: 4 }}>
          <Typography
            sx={{
              fontSize: 28,
              fontWeight: 700,
              background: "#a9744f",
              //   "linear-gradient(135deg, #3b82f6, #9333ea)",
              backgroundClip: "text",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            Create Account
          </Typography>

          <Typography
            sx={{
              mt: 1,
              color: "#6b7280",
              fontSize: 14,
            }}
          >
            Create your account to get started
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
          <TextField
            fullWidth
            label="Full Name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            margin="normal"
            required
            sx={{
              "& .MuiOutlinedInput-root": {
                "&.Mui-focused fieldset": {
                  borderColor: "#a9744f",
                },
              },
              "& .MuiInputLabel-root.Mui-focused": {
                color: "#a9744f",
              },
              "& .MuiInputBase-input": {
                caretColor: "#a9744f",
              },
            }}
          />

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
                  borderColor: "#a9744f",
                },
              },
              "& .MuiInputLabel-root.Mui-focused": {
                color: "#a9744f",
              },
              "& .MuiInputBase-input": {
                caretColor: "#a9744f",
              },
            }}
          />

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
                  borderColor: "#a9744f",
                },
              },
              "& .MuiInputLabel-root.Mui-focused": {
                color: "#a9744f",
              },
              "& .MuiInputBase-input": {
                caretColor: "#a9744f",
              },
            }}
            slotProps={{
              input: {
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() =>
                        setShowPassword((prev) => !prev)
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

          <TextField
            fullWidth
            label="Confirm Password"
            name="confirmPassword"
            type={
              showConfirmPassword ? "text" : "password"
            }
            value={formData.confirmPassword}
            onChange={handleChange}
            margin="normal"
            required
            sx={{
              "& .MuiOutlinedInput-root": {
                "&.Mui-focused fieldset": {
                  borderColor: "#a9744f",
                },
              },
              "& .MuiInputLabel-root.Mui-focused": {
                color: "#a9744f",
              },
              "& .MuiInputBase-input": {
                caretColor: "#a9744f",
              },
            }}
            slotProps={{
              input: {
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() =>
                        setShowConfirmPassword(
                          (prev) => !prev
                        )
                      }
                      edge="end"
                    >
                      {showConfirmPassword ? (
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
              background: "linear-gradient(135deg, #a9744f, #8b5e3c)",
              "&:hover": {
                background: "linear-gradient(135deg, #8b5e3c, #6f472f)",
              },

            }}
          >
            {loading ? (
              <CircularProgress
                size={24}
                sx={{ color: "#fff" }}
              />
            ) : (
              "Create Account"
            )}
          </Button>
        </Box>

        {/* Login */}

        <Typography
          sx={{
            textAlign: "center",
            mt: 3,
            fontSize: 14,
            color: "#6b7280",
          }}
        >
          Already have an account?{" "}
          <Box
            component={Link}
            to="/login"
            sx={{
              color: "#a9744f",
              fontWeight: 600,
              textDecoration: "none",
              "&:hover": {
                textDecoration: "underline",
              },
            }}
          >
            Login
          </Box>
        </Typography>
      </Paper>
    </Box>
  );
};

export default Register;