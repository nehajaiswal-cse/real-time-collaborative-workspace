import { useState } from 'react';
import {
    Box,
    Container,
    Paper,
    Typography,
    TextField,
    Button,
    IconButton,
    InputAdornment,
    Checkbox,
    FormControlLabel,
    Grid,
    Divider,
    Alert,
    Snackbar,
    CircularProgress,
    LinearProgress,
    Chip,
} from '@mui/material';
import {
    PersonOutlined,
    EmailOutlined,
    LockOutlined,
    Visibility,
    VisibilityOff,
    CheckCircleOutlined,
    GroupWorkOutlined,
    ArrowForward,
    Google as GoogleIcon,
    GitHub as GitHubIcon,
    Speed,
    Security,
    Bolt,
} from '@mui/icons-material';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const Register = () => {
    const navigate = useNavigate();

    // Form states
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
        agreeTerms: false,
    });

    // UI state
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});

    // Notification state
    const [snackbar, setSnackbar] = useState({
        open: false,
        message: '',
        severity: 'info',
    });

    const handleChange = (e) => {
        const { name, value, checked, type } = e.target;
        const val = type === 'checkbox' ? checked : value;

        setFormData((prev) => ({
            ...prev,
            [name]: val,
        }));

        if (errors[name]) {
            setErrors((prev) => ({ ...prev, [name]: '' }));
        }
    };

    // Password strength calculation
    const getPasswordStrength = (pass) => {
        if (!pass) return { score: 0, label: '', color: 'error' };
        let score = 0;
        if (pass.length >= 6) score += 25;
        if (pass.length >= 10) score += 25;
        if (/[A-Z]/.test(pass) && /[a-z]/.test(pass)) score += 25;
        if (/[0-9]/.test(pass) || /[^A-Za-z0-9]/.test(pass)) score += 25;

        if (score <= 25) return { score: 25, label: 'Weak', color: 'error' };
        if (score <= 75) return { score: 60, label: 'Medium', color: 'warning' };
        return { score: 100, label: 'Strong', color: 'success' };
    };

    const passwordStrength = getPasswordStrength(formData.password);

    // Validate form
    const validateForm = () => {
        const newErrors = {};

        if (!formData.name.trim()) {
            newErrors.name = 'Full name is required';
        } else if (formData.name.trim().length < 2) {
            newErrors.name = 'Name must be at least 2 characters';
        }

        if (!formData.email.trim()) {
            newErrors.email = 'Email is required';
        } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(formData.email)) {
            newErrors.email = 'Invalid email address';
        }

        if (!formData.password) {
            newErrors.password = 'Password is required';
        } else if (formData.password.length < 6) {
            newErrors.password = 'Password must be at least 6 characters';
        }

        if (!formData.confirmPassword) {
            newErrors.confirmPassword = 'Please confirm your password';
        } else if (formData.password !== formData.confirmPassword) {
            newErrors.confirmPassword = 'Passwords do not match';
        }

        if (!formData.agreeTerms) {
            newErrors.agreeTerms = 'You must accept the Terms of Service to proceed';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    // Submit Handler
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            setSnackbar({
                open: true,
                message: 'Please resolve the highlighted errors in the form.',
                severity: 'error',
            });
            return;
        }

        setLoading(true);

        try {
            const response = await axios.post('/api/auth/register', {
                name: formData.name.trim(),
                email: formData.email.trim(),
                password: formData.password,
            });

            if (response.data && response.data.token) {
                localStorage.setItem('token', response.data.token);
                localStorage.setItem('user', JSON.stringify(response.data.user));
            }

            setSnackbar({
                open: true,
                message: response.data?.message || 'Account created successfully! Redirecting...',
                severity: 'success',
            });

            setTimeout(() => {
                navigate('/login');
            }, 1500);
        } catch (err) {
            const errorMsg = err.response?.data?.message || 'Registration failed. Please try again.';
            setSnackbar({
                open: true,
                message: errorMsg,
                severity: 'error',
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box
            sx={{
                minHeight: '100vh',
                backgroundColor: '#F9FAFB', // Matches Dashboard bg-gray-50 / #f9fafb
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                position: 'relative',
                overflow: 'hidden',
                py: { xs: 4, md: 8 },
                px: 2,
            }}
        >
            {/* Background Decorative Accent Shapes */}
            <Box
                sx={{
                    position: 'absolute',
                    top: '-10%',
                    left: '-5%',
                    width: '500px',
                    height: '500px',
                    borderRadius: '50%',
                    background: 'radial-gradient(circle, rgba(99, 102, 241, 0.08) 0%, rgba(99, 102, 241, 0) 70%)',
                    pointerEvents: 'none',
                }}
            />
            <Box
                sx={{
                    position: 'absolute',
                    bottom: '-10%',
                    right: '-5%',
                    width: '500px',
                    height: '500px',
                    borderRadius: '50%',
                    background: 'radial-gradient(circle, rgba(139, 92, 246, 0.08) 0%, rgba(139, 92, 246, 0) 70%)',
                    pointerEvents: 'none',
                }}
            />

            <Container maxWidth="lg">
                <Grid container spacing={4} alignItems="stretch" justifyContent="center">

                    {/* Left Side Feature Showcase (Visible on MD and larger screens) */}
                    <Grid
                        item
                        xs={12}
                        md={5}
                        sx={{
                            display: { xs: 'none', md: 'flex' },
                            flexDirection: 'column',
                        }}
                    >
                        <Paper
                            elevation={0}
                            sx={{
                                p: 4,
                                height: '100%',
                                borderRadius: 4,
                                display: 'flex',
                                flexDirection: 'column',
                                justifyContent: 'space-between',
                                backgroundColor: '#FFFFFF',
                                border: '1px solid #E5E7EB',
                                boxShadow: '0 10px 30px -10px rgba(0, 0, 0, 0.05)',
                            }}
                        >
                            {/* Brand Logo Header */}
                            <Box>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 4 }}>
                                    <Box
                                        sx={{
                                            width: 44,
                                            height: 44,
                                            borderRadius: 2.5,
                                            background: 'linear-gradient(135deg, #6366F1 0%, #4F46E5 100%)',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            boxShadow: '0 6px 16px rgba(99, 102, 241, 0.3)',
                                        }}
                                    >
                                        <GroupWorkOutlined sx={{ fontSize: 26, color: '#FFFFFF' }} />
                                    </Box>
                                    <Typography variant="h5" sx={{ fontWeight: 800, color: '#3F342C' }}>
                                        CollabSpace
                                    </Typography>
                                </Box>

                                <Typography
                                    variant="h4"
                                    sx={{
                                        fontWeight: 800,
                                        lineHeight: 1.25,
                                        mb: 2,
                                        color: '#3F342C',
                                    }}
                                >
                                    Build together in real-time without limits.
                                </Typography>

                                <Typography variant="body1" sx={{ color: '#64748B', mb: 4, lineHeight: 1.6 }}>
                                    Join your team to co-create, manage boards, and track real-time project activities smoothly.
                                </Typography>

                                {/* Feature Bullet Cards */}
                                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
                                    <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                                        <Box
                                            sx={{
                                                p: 1.25,
                                                borderRadius: 2.5,
                                                backgroundColor: '#EEF2FF',
                                                color: '#6366F1',
                                            }}
                                        >
                                            <Bolt fontSize="small" />
                                        </Box>
                                        <Box>
                                            <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#3F342C' }}>
                                                Real-time Collaboration
                                            </Typography>
                                            <Typography variant="caption" sx={{ color: '#64748B' }}>
                                                Instant sync engine powering multi-user document edits.
                                            </Typography>
                                        </Box>
                                    </Box>

                                    <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                                        <Box
                                            sx={{
                                                p: 1.25,
                                                borderRadius: 2.5,
                                                backgroundColor: '#ECFDF5',
                                                color: '#10B981',
                                            }}
                                        >
                                            <Security fontSize="small" />
                                        </Box>
                                        <Box>
                                            <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#3F342C' }}>
                                                Secure Workspace
                                            </Typography>
                                            <Typography variant="caption" sx={{ color: '#64748B' }}>
                                                Protected user sessions and encrypted board sharing.
                                            </Typography>
                                        </Box>
                                    </Box>

                                    <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                                        <Box
                                            sx={{
                                                p: 1.25,
                                                borderRadius: 2.5,
                                                backgroundColor: '#FDF2F8',
                                                color: '#EC4899',
                                            }}
                                        >
                                            <Speed fontSize="small" />
                                        </Box>
                                        <Box>
                                            <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#3F342C' }}>
                                                Interactive Dashboard
                                            </Typography>
                                            <Typography variant="caption" sx={{ color: '#64748B' }}>
                                                Overview cards, active boards, and recent activity updates.
                                            </Typography>
                                        </Box>
                                    </Box>
                                </Box>
                            </Box>

                            {/* Bottom Footer Badge */}
                            <Box
                                sx={{
                                    mt: 4,
                                    pt: 3,
                                    borderTop: '1px solid #F1F5F9',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'space-between',
                                }}
                            >
                                <Typography variant="caption" sx={{ color: '#94A3B8' }}>
                                    © {new Date().getFullYear()} CollabSpace
                                </Typography>
                                <Chip
                                    label="v2.5 Dashboard Ready"
                                    size="small"
                                    sx={{
                                        backgroundColor: '#EEF2FF',
                                        color: '#6366F1',
                                        fontWeight: 600,
                                        fontSize: '0.75rem',
                                    }}
                                />
                            </Box>
                        </Paper>
                    </Grid>

                    {/* Right Side Registration Form Card */}
                    <Grid item xs={12} sm={10} md={7} lg={6}>
                        <Paper
                            elevation={0}
                            sx={{
                                p: { xs: 3, sm: 5 },
                                borderRadius: 4,
                                backgroundColor: '#FFFFFF',
                                border: '1px solid #E5E7EB',
                                boxShadow: '0 20px 40px -15px rgba(0, 0, 0, 0.07)',
                            }}
                        >
                            {/* Header Title */}
                            <Box sx={{ mb: 3.5, textAlign: 'left' }}>
                                <Typography variant="h4" component="h1" sx={{ fontWeight: 800, color: '#3F342C', mb: 0.5 }}>
                                    Create Account
                                </Typography>
                                <Typography variant="body2" sx={{ color: '#64748B' }}>
                                    Register now to get started with your collaborative workspace.
                                </Typography>
                            </Box>

                            {/* Registration Form */}
                            <Box component="form" onSubmit={handleSubmit} noValidate>
                                <Grid container spacing={2.5}>

                                    {/* Full Name */}
                                    <Grid item xs={12}>
                                        <Typography variant="body2" sx={{ fontWeight: 600, color: '#374151', mb: 0.75 }}>
                                            Full Name
                                        </Typography>
                                        <TextField
                                            fullWidth
                                            id="name"
                                            name="name"
                                            placeholder="John Doe"
                                            value={formData.name}
                                            onChange={handleChange}
                                            error={Boolean(errors.name)}
                                            helperText={errors.name}
                                            InputProps={{
                                                startAdornment: (
                                                    <InputAdornment position="start">
                                                        <PersonOutlined sx={{ color: errors.name ? '#EF4444' : '#6366F1' }} />
                                                    </InputAdornment>
                                                ),
                                            }}
                                        />
                                    </Grid>

                                    {/* Email Address */}
                                    <Grid item xs={12}>
                                        <Typography variant="body2" sx={{ fontWeight: 600, color: '#374151', mb: 0.75 }}>
                                            Email Address
                                        </Typography>
                                        <TextField
                                            fullWidth
                                            id="email"
                                            name="email"
                                            type="email"
                                            placeholder="name@company.com"
                                            value={formData.email}
                                            onChange={handleChange}
                                            error={Boolean(errors.email)}
                                            helperText={errors.email}
                                            InputProps={{
                                                startAdornment: (
                                                    <InputAdornment position="start">
                                                        <EmailOutlined sx={{ color: errors.email ? '#EF4444' : '#6366F1' }} />
                                                    </InputAdornment>
                                                ),
                                            }}
                                        />
                                    </Grid>

                                    {/* Password Field */}
                                    <Grid item xs={12} sm={6}>
                                        <Typography variant="body2" sx={{ fontWeight: 600, color: '#374151', mb: 0.75 }}>
                                            Password
                                        </Typography>
                                        <TextField
                                            fullWidth
                                            id="password"
                                            name="password"
                                            type={showPassword ? 'text' : 'password'}
                                            placeholder="••••••••"
                                            value={formData.password}
                                            onChange={handleChange}
                                            error={Boolean(errors.password)}
                                            helperText={errors.password}
                                            InputProps={{
                                                startAdornment: (
                                                    <InputAdornment position="start">
                                                        <LockOutlined sx={{ color: errors.password ? '#EF4444' : '#6366F1' }} />
                                                    </InputAdornment>
                                                ),
                                                endAdornment: (
                                                    <InputAdornment position="end">
                                                        <IconButton
                                                            onClick={() => setShowPassword(!showPassword)}
                                                            edge="end"
                                                            size="small"
                                                            sx={{ color: '#94A3B8' }}
                                                        >
                                                            {showPassword ? <VisibilityOff fontSize="small" /> : <Visibility fontSize="small" />}
                                                        </IconButton>
                                                    </InputAdornment>
                                                ),
                                            }}
                                        />
                                    </Grid>

                                    {/* Confirm Password Field */}
                                    <Grid item xs={12} sm={6}>
                                        <Typography variant="body2" sx={{ fontWeight: 600, color: '#374151', mb: 0.75 }}>
                                            Confirm Password
                                        </Typography>
                                        <TextField
                                            fullWidth
                                            id="confirmPassword"
                                            name="confirmPassword"
                                            type={showConfirmPassword ? 'text' : 'password'}
                                            placeholder="••••••••"
                                            value={formData.confirmPassword}
                                            onChange={handleChange}
                                            error={Boolean(errors.confirmPassword)}
                                            helperText={errors.confirmPassword}
                                            InputProps={{
                                                startAdornment: (
                                                    <InputAdornment position="start">
                                                        <CheckCircleOutlined sx={{ color: errors.confirmPassword ? '#EF4444' : '#6366F1' }} />
                                                    </InputAdornment>
                                                ),
                                                endAdornment: (
                                                    <InputAdornment position="end">
                                                        <IconButton
                                                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                                            edge="end"
                                                            size="small"
                                                            sx={{ color: '#94A3B8' }}
                                                        >
                                                            {showConfirmPassword ? <VisibilityOff fontSize="small" /> : <Visibility fontSize="small" />}
                                                        </IconButton>
                                                    </InputAdornment>
                                                ),
                                            }}
                                        />
                                    </Grid>

                                    {/* Password Strength Indicator */}
                                    {formData.password && (
                                        <Grid item xs={12}>
                                            <Box sx={{ mt: -1 }}>
                                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.5 }}>
                                                    <Typography variant="caption" sx={{ color: '#64748B' }}>
                                                        Password Strength:
                                                    </Typography>
                                                    <Typography
                                                        variant="caption"
                                                        sx={{
                                                            fontWeight: 700,
                                                            color:
                                                                passwordStrength.label === 'Strong'
                                                                    ? '#10B981'
                                                                    : passwordStrength.label === 'Medium'
                                                                        ? '#F59E0B'
                                                                        : '#EF4444',
                                                        }}
                                                    >
                                                        {passwordStrength.label}
                                                    </Typography>
                                                </Box>
                                                <LinearProgress
                                                    variant="determinate"
                                                    value={passwordStrength.score}
                                                    color={passwordStrength.color}
                                                    sx={{
                                                        height: 6,
                                                        borderRadius: 3,
                                                        backgroundColor: '#F1F5F9',
                                                    }}
                                                />
                                            </Box>
                                        </Grid>
                                    )}

                                    {/* Terms Agreement Checkbox */}
                                    <Grid item xs={12}>
                                        <FormControlLabel
                                            control={
                                                <Checkbox
                                                    id="agreeTerms"
                                                    name="agreeTerms"
                                                    checked={formData.agreeTerms}
                                                    onChange={handleChange}
                                                    sx={{
                                                        color: errors.agreeTerms ? '#EF4444' : '#6366F1',
                                                        '&.Mui-checked': {
                                                            color: '#6366F1',
                                                        },
                                                    }}
                                                />
                                            }
                                            label={
                                                <Typography variant="body2" sx={{ color: '#64748B', fontSize: '0.875rem' }}>
                                                    I agree to the{' '}
                                                    <Typography
                                                        component="span"
                                                        variant="body2"
                                                        sx={{
                                                            color: '#6366F1',
                                                            fontWeight: 600,
                                                            cursor: 'pointer',
                                                            textDecoration: 'underline',
                                                        }}
                                                    >
                                                        Terms of Service
                                                    </Typography>{' '}
                                                    and{' '}
                                                    <Typography
                                                        component="span"
                                                        variant="body2"
                                                        sx={{
                                                            color: '#6366F1',
                                                            fontWeight: 600,
                                                            cursor: 'pointer',
                                                            textDecoration: 'underline',
                                                        }}
                                                    >
                                                        Privacy Policy
                                                    </Typography>
                                                </Typography>
                                            }
                                        />
                                        {errors.agreeTerms && (
                                            <Typography variant="caption" sx={{ color: '#EF4444', display: 'block', mt: 0.5, ml: 1 }}>
                                                {errors.agreeTerms}
                                            </Typography>
                                        )}
                                    </Grid>

                                    {/* Submit Button */}
                                    <Grid item xs={12} sx={{ mt: 1 }}>
                                        <Button
                                            type="submit"
                                            fullWidth
                                            variant="contained"
                                            size="large"
                                            disabled={loading}
                                            endIcon={!loading && <ArrowForward />}
                                            sx={{
                                                py: 1.5,
                                                fontSize: '1rem',
                                                fontWeight: 700,
                                                textTransform: 'none',
                                                letterSpacing: '0.02em',
                                            }}
                                        >
                                            {loading ? <CircularProgress size={24} sx={{ color: '#FFFFFF' }} /> : 'Create Account'}
                                        </Button>
                                    </Grid>
                                </Grid>
                            </Box>

                            {/* Divider */}
                            <Divider sx={{ my: 3, borderColor: '#F1F5F9' }}>
                                <Typography variant="caption" sx={{ color: '#94A3B8', px: 1, textTransform: 'uppercase', letterSpacing: 1 }}>
                                    or sign up with
                                </Typography>
                            </Divider>

                            {/* Social Login Buttons */}
                            <Grid container spacing={2}>
                                <Grid item xs={6}>
                                    <Button
                                        fullWidth
                                        variant="outlined"
                                        startIcon={<GoogleIcon />}
                                        onClick={() =>
                                            setSnackbar({
                                                open: true,
                                                message: 'Google Sign-Up coming soon!',
                                                severity: 'info',
                                            })
                                        }
                                        sx={{
                                            borderColor: '#E5E7EB',
                                            color: '#3F342C',
                                            '&:hover': {
                                                borderColor: '#CBD5E1',
                                                backgroundColor: '#F8FAFC',
                                            },
                                        }}
                                    >
                                        Google
                                    </Button>
                                </Grid>
                                <Grid item xs={6}>
                                    <Button
                                        fullWidth
                                        variant="outlined"
                                        startIcon={<GitHubIcon />}
                                        onClick={() =>
                                            setSnackbar({
                                                open: true,
                                                message: 'GitHub Sign-Up coming soon!',
                                                severity: 'info',
                                            })
                                        }
                                        sx={{
                                            borderColor: '#E5E7EB',
                                            color: '#3F342C',
                                            '&:hover': {
                                                borderColor: '#CBD5E1',
                                                backgroundColor: '#F8FAFC',
                                            },
                                        }}
                                    >
                                        GitHub
                                    </Button>
                                </Grid>
                            </Grid>

                            {/* Sign In Navigation Link */}
                            <Box sx={{ mt: 3, textAlign: 'center' }}>
                                <Typography variant="body2" sx={{ color: '#64748B' }}>
                                    Already have an account?{' '}
                                    <Typography
                                        component={Link}
                                        to="/login"
                                        variant="body2"
                                        sx={{
                                            color: '#6366F1',
                                            fontWeight: 700,
                                            textDecoration: 'none',
                                            '&:hover': { textDecoration: 'underline' },
                                        }}
                                    >
                                        Sign in
                                    </Typography>
                                </Typography>
                            </Box>
                        </Paper>
                    </Grid>
                </Grid>
            </Container>

            {/* Snackbar Alert Notification */}
            <Snackbar
                open={snackbar.open}
                autoHideDuration={5000}
                onClose={() => setSnackbar((prev) => ({ ...prev, open: false }))}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            >
                <Alert
                    onClose={() => setSnackbar((prev) => ({ ...prev, open: false }))}
                    severity={snackbar.severity}
                    variant="filled"
                    sx={{ width: '100%', borderRadius: 2 }}
                >
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </Box>
    );
};

export default Register;
