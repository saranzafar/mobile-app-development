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
import { RootStackParamList } from '../../navigations/AppNavigator';
import { useTheme } from '../../contexts/ThemeContext';
import { ChevronLeft, Mail } from 'lucide-react-native';
import { forgotPassword } from '../../services/authService';

type Props = NativeStackScreenProps<RootStackParamList, 'ForgotPassword'>;

const inputHeight = 56;

const ForgotPasswordScreen: React.FC<Props> = ({ navigation }) => {
    const { theme } = useTheme();
    const [email, setEmail] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    // Track focused input state
    const [focusedInput, setFocusedInput] = useState<string | null>(null);

    const handleResetPassword = async () => {
        setError(null);
        if (!email.trim()) { return setError('Please enter your email address'); }
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { return setError('Please enter a valid email'); }

        try {
            setLoading(true);
            const { error: otpError } = await forgotPassword(email);
            if (otpError) { setError(otpError.message); }
            else { navigation.navigate('VerifyOtp', { email, flow: 'forgot' }); }
        } catch (err: any) {
            setError(err.message);
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
                    Forgot Password
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
                        Enter your registered email address to receive a password reset link.
                    </Text>

                    {/* Error Message */}
                    {error && (
                        <View style={styles.errorContainer}>
                            <Text style={styles.errorText}>{error}</Text>
                        </View>
                    )}

                    {/* Input Fields */}
                    <View style={styles.formContainer}>
                        {/* Email Input */}
                        <View style={[styles.inputContainer, { borderColor: getBorderColor('email') }]}>
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
                                returnKeyType="done"
                                accessibilityLabel="Email address input"
                            />
                        </View>
                    </View>

                    {/* Reset Password Button */}
                    <TouchableOpacity
                        style={[styles.resetButton, { backgroundColor: theme.colors.primary }]}
                        onPress={handleResetPassword}
                        disabled={loading}
                        accessibilityLabel="Reset password button"
                        accessibilityRole="button"
                    >
                        {loading ? (
                            <ActivityIndicator color="#FFFFFF" size="small" />
                        ) : (
                            <Text style={styles.resetButtonText}>Reset Password</Text>
                        )}
                    </TouchableOpacity>

                    {/* Back to Sign In Link */}
                    <View style={styles.signinLinkContainer}>
                        <Text style={[styles.signinText, { color: theme.colors.text + 'CC' }]}>
                            Remember your password?
                        </Text>
                        <TouchableOpacity
                            onPress={() => navigation.navigate('Login')}
                            accessibilityLabel="Sign in"
                            accessibilityRole="link"
                        >
                            <Text style={[styles.signinLink, { color: theme.colors.primary }]}>
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
        textAlign: 'center',
    },
    errorContainer: {
        backgroundColor: '#FFEDED',
        borderRadius: 12,
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
    signinLinkContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    signinText: {
        fontSize: 14,
    },
    signinLink: {
        fontSize: 14,
        fontWeight: '600',
        marginLeft: 4,
    },
    resetButton: {
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
    resetButtonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: '600',
    },
});

export default ForgotPasswordScreen;
