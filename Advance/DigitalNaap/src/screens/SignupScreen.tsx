import React, { useState } from 'react';
import {
    SafeAreaView,
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    ActivityIndicator,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StatusBar,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigations/AppNavigator';
import { useTheme } from '../contexts/ThemeContext';
import { sendOtp, signUp } from '../services/authService';
import { Eye, EyeOff, ChevronLeft, User, Mail, KeyRound } from 'lucide-react-native';

type Props = NativeStackScreenProps<RootStackParamList, 'Signup'>;

const inputHeight = 56; // Slightly taller input fields for better touch targets

const SignupScreen: React.FC<Props> = ({ navigation }) => {
    const { theme } = useTheme();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    // Track focused input state
    const [focusedInput, setFocusedInput] = useState<string | null>(null);

    const handleSignup = async () => {
        setError(null);
        if (!name.trim()) { return setError('Please enter your name'); }
        if (!email.trim()) { return setError('Please enter your email'); }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) { return setError('Invalid email address'); }
        if (password.length < 6) { return setError('Password must be at least 6 characters'); }
        if (password !== confirmPassword) { return setError('Passwords do not match'); }

        try {
            setLoading(true);
            // send OTP instead of password signup
            const { error: otpError } = await sendOtp(email, true);
            if (otpError) { setError(otpError.message); }
            else { navigation.navigate('VerifyOtp', { email, flow: 'signup' }); }
        } catch (err: any) {
            setError(err.message || 'Unexpected error');
        } finally {
            setLoading(false);
        }
    };

    // Get border color based on focus state
    const getBorderColor = (inputName: string) => {
        if (focusedInput === inputName) {
            return theme.colors.primary; // Focused state color
        }
        return theme.colors.text + '30'; // Default border color
    };

    // Get icon color based on focus state
    const getIconColor = (inputName: string) => {
        if (focusedInput === inputName) {
            return theme.colors.primary; // Focused state color
        }
        return theme.colors.text + '99'; // Default icon color
    };

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
            <StatusBar
                barStyle={theme.colors.background === '#ffffff' ? 'dark-content' : 'light-content'}
                backgroundColor="transparent"
                translucent
            />

            {/* Header with back button */}
            <View style={styles.header}>
                <TouchableOpacity
                    style={styles.backButton}
                    onPress={() => navigation.goBack()}
                    accessibilityLabel="Go back"
                >
                    <ChevronLeft size={24} color={theme.colors.text} />
                </TouchableOpacity>

                <Text style={[styles.headerTitle, { color: theme.colors.text }]}>
                    Create Account
                </Text>
            </View>

            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={styles.keyboardView}
            >
                <ScrollView
                    contentContainerStyle={styles.scrollContent}
                    showsVerticalScrollIndicator={false}
                    keyboardShouldPersistTaps="handled"
                >
                    {/* App Name */}
                    <Text style={[styles.appName, { color: theme.colors.primary }]}>
                        DigitalNaap
                    </Text>

                    {/* Description */}
                    <Text style={[styles.description, { color: theme.colors.text + 'CC' }]}>
                        Create your account to start managing client measurements
                    </Text>

                    {/* Error Message */}
                    {error && (
                        <View style={styles.errorContainer}>
                            <Text style={styles.errorText}>{error}</Text>
                        </View>
                    )}

                    {/* Input Fields */}
                    <View style={styles.formContainer}>
                        {/* Name Input */}
                        <View style={[
                            styles.inputContainer,
                            { borderColor: getBorderColor('name') },
                        ]}>
                            <User
                                size={20}
                                color={getIconColor('name')}
                                style={styles.inputIcon}
                            />
                            <TextInput
                                style={[styles.input, { color: theme.colors.text }]}
                                placeholder="Full Name"
                                placeholderTextColor={theme.colors.text + '99'}
                                value={name}
                                onChangeText={setName}
                                onFocus={() => setFocusedInput('name')}
                                onBlur={() => setFocusedInput(null)}
                                returnKeyType="next"
                                accessibilityLabel="Full name input"
                            />
                        </View>

                        {/* Email Input */}
                        <View style={[
                            styles.inputContainer,
                            { borderColor: getBorderColor('email') },
                        ]}>
                            <Mail
                                size={20}
                                color={getIconColor('email')}
                                style={styles.inputIcon}
                            />
                            <TextInput
                                style={[styles.input, { color: theme.colors.text }]}
                                placeholder="Email Address"
                                placeholderTextColor={theme.colors.text + '99'}
                                autoCapitalize="none"
                                keyboardType="email-address"
                                value={email}
                                onChangeText={setEmail}
                                onFocus={() => setFocusedInput('email')}
                                onBlur={() => setFocusedInput(null)}
                                returnKeyType="next"
                                accessibilityLabel="Email address input"
                            />
                        </View>

                        {/* Password Input */}
                        <View style={[
                            styles.inputContainer,
                            { borderColor: getBorderColor('password') },
                        ]}>
                            <KeyRound
                                size={20}
                                color={getIconColor('password')}
                                style={styles.inputIcon}
                            />
                            <TextInput
                                style={[styles.input, { color: theme.colors.text }]}
                                placeholder="Password"
                                placeholderTextColor={theme.colors.text + '99'}
                                secureTextEntry={!showPassword}
                                value={password}
                                onChangeText={setPassword}
                                onFocus={() => setFocusedInput('password')}
                                onBlur={() => setFocusedInput(null)}
                                returnKeyType="next"
                                accessibilityLabel="Password input"
                            />
                            <TouchableOpacity
                                onPress={() => setShowPassword(prev => !prev)}
                                style={styles.eyeIcon}
                                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                                accessibilityLabel={showPassword ? 'Hide password' : 'Show password'}
                            >
                                {showPassword ? (
                                    <EyeOff size={20} color={theme.colors.text + 'CC'} />
                                ) : (
                                    <Eye size={20} color={theme.colors.text + 'CC'} />
                                )}
                            </TouchableOpacity>
                        </View>

                        {/* Confirm Password Input */}
                        <View style={[
                            styles.inputContainer,
                            { borderColor: getBorderColor('confirmPassword') },
                        ]}>
                            <KeyRound
                                size={20}
                                color={getIconColor('confirmPassword')}
                                style={styles.inputIcon}
                            />
                            <TextInput
                                style={[styles.input, { color: theme.colors.text }]}
                                placeholder="Confirm Password"
                                placeholderTextColor={theme.colors.text + '99'}
                                secureTextEntry={!showConfirmPassword}
                                value={confirmPassword}
                                onChangeText={setConfirmPassword}
                                onFocus={() => setFocusedInput('confirmPassword')}
                                onBlur={() => setFocusedInput(null)}
                                returnKeyType="done"
                                onSubmitEditing={handleSignup}
                                accessibilityLabel="Confirm password input"
                            />
                            <TouchableOpacity
                                onPress={() => setShowConfirmPassword(prev => !prev)}
                                style={styles.eyeIcon}
                                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                                accessibilityLabel={showConfirmPassword ? 'Hide password' : 'Show password'}
                            >
                                {showConfirmPassword ? (
                                    <EyeOff size={20} color={theme.colors.text + 'CC'} />
                                ) : (
                                    <Eye size={20} color={theme.colors.text + 'CC'} />
                                )}
                            </TouchableOpacity>
                        </View>
                    </View>

                    {/* Signup Button */}
                    <TouchableOpacity
                        style={[styles.signupButton, { backgroundColor: theme.colors.primary }]}
                        onPress={handleSignup}
                        disabled={loading}
                        accessibilityLabel="Create Account button"
                        accessibilityRole="button"
                    >
                        {loading ? (
                            <ActivityIndicator color="#FFFFFF" size="small" />
                        ) : (
                            <Text style={styles.signupButtonText}>Create Account</Text>
                        )}
                    </TouchableOpacity>

                    {/* Login Link */}
                    <View style={styles.loginLinkContainer}>
                        <Text style={[styles.loginText, { color: theme.colors.text + 'CC' }]}>
                            Already have an account?
                        </Text>
                        <TouchableOpacity
                            onPress={() => navigation.navigate('Login')}
                            accessibilityLabel="Sign in"
                            accessibilityRole="link"
                        >
                            <Text style={[styles.loginLink, { color: theme.colors.primary }]}>
                                Sign In
                            </Text>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: Platform.OS === 'android' ? 25 : 0,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingVertical: 16,
    },
    backButton: {
        padding: 4,
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: '600',
        marginLeft: 20,
    },
    keyboardView: {
        flex: 1,
    },
    scrollContent: {
        paddingHorizontal: 24,
        paddingBottom: 40,
    },
    appName: {
        fontSize: 28,
        fontWeight: '700',
        marginTop: 20,
        marginBottom: 12,
    },
    description: {
        fontSize: 16,
        marginBottom: 32,
    },
    errorContainer: {
        backgroundColor: '#FFEDED',
        borderRadius: 8,
        padding: 12,
        marginBottom: 20,
        borderLeftWidth: 4,
        borderLeftColor: '#FF4D4F',
    },
    errorText: {
        color: '#CF1322',
        fontSize: 14,
    },
    formContainer: {
        width: '100%',
        marginBottom: 24,
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        width: '100%',
        height: inputHeight,
        borderWidth: 1,
        borderRadius: 12,
        marginBottom: 16,
        paddingHorizontal: 16,
    },
    inputIcon: {
        marginRight: 12,
    },
    input: {
        flex: 1,
        height: '100%',
        fontSize: 16,
    },
    eyeIcon: {
        padding: 4,
    },
    signupButton: {
        width: '100%',
        height: inputHeight,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 24,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    signupButtonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: '600',
    },
    loginLinkContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    loginText: {
        fontSize: 14,
    },
    loginLink: {
        fontSize: 14,
        fontWeight: '600',
        marginLeft: 4,
    },
});

export default SignupScreen;
