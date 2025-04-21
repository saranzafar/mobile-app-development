// src/screens/LoginScreen.tsx
import React, { useState } from 'react';
import {
    SafeAreaView,
    StatusBar,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    View,
    Text,
    TextInput,
    TouchableOpacity,
    ActivityIndicator,
    StyleSheet,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigations/AppNavigator';
import { useTheme } from '../contexts/ThemeContext';
import { logIn } from '../services/authService';
import { Eye, EyeOff, KeyRound, Mail, ChevronLeft } from 'lucide-react-native';

type Props = NativeStackScreenProps<RootStackParamList, 'Login'>;
const inputHeight = 56;

export default function LoginScreen({ navigation }: Props) {
    const { theme } = useTheme();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPass, setShowPass] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const handleLogin = async () => {
        setError(null);
        if (!email.trim()) { return setError('Please enter your email'); }
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { return setError('Please enter a valid email'); }
        if (!password) { return setError('Please enter your password'); }

        setLoading(true);
        try {
            const { error: authError } = await logIn(email, password);
            if (authError) { setError(authError.message); }
            else { navigation.replace('ClientList'); }
        } catch (e: any) {
            setError(e.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
            <StatusBar
                barStyle={theme.colors.background === '#ffffff' ? 'dark-content' : 'light-content'}
                backgroundColor="transparent"
                translucent
            />

            <KeyboardAvoidingView
                style={styles.keyboardView}
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            >
                <ScrollView
                    contentContainerStyle={styles.scrollContent}
                    keyboardShouldPersistTaps="handled"
                >
                    {/* Header */}
                    <View style={styles.header}>
                        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                            <ChevronLeft size={24} color={theme.colors.text} />
                        </TouchableOpacity>
                        <Text style={[styles.headerTitle, { color: theme.colors.text }]}>Sign In</Text>
                    </View>

                    {/* Branding */}
                    <Text style={[styles.appName, { color: theme.colors.primary }]}>DigitalNaap</Text>
                    <Text style={[styles.description, { color: theme.colors.text + 'CC' }]}>
                        Sign in to access your client measurements
                    </Text>

                    {error ? (
                        <View style={styles.errorContainer}>
                            <Text style={styles.errorText}>{error}</Text>
                        </View>
                    ) : null}

                    {/* Email Field */}
                    <View style={[styles.inputContainer, { borderColor: theme.colors.text + '30' }]}>
                        <Mail size={20} color={theme.colors.text + '99'} style={styles.inputIcon} />
                        <TextInput
                            style={[styles.input, { color: theme.colors.text }]}
                            placeholder="Email Address"
                            placeholderTextColor={theme.colors.text + '99'}
                            keyboardType="email-address"
                            autoCapitalize="none"
                            value={email}
                            onChangeText={setEmail}
                            returnKeyType="next"
                        />
                    </View>

                    {/* Password Field */}
                    <View style={[styles.inputContainer, { borderColor: theme.colors.text + '30' }]}>
                        <KeyRound size={20} color={theme.colors.text + '99'} style={styles.inputIcon} />
                        <TextInput
                            style={[styles.input, { color: theme.colors.text }]}
                            placeholder="Password"
                            placeholderTextColor={theme.colors.text + '99'}
                            secureTextEntry={!showPass}
                            value={password}
                            onChangeText={setPassword}
                            returnKeyType="done"
                            onSubmitEditing={handleLogin}
                        />
                        <TouchableOpacity
                            onPress={() => setShowPass(v => !v)}
                            style={styles.eyeBtn}
                            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                        >
                            {showPass
                                ? <EyeOff size={20} color={theme.colors.text + '80'} />
                                : <Eye size={20} color={theme.colors.text + '80'} />}
                        </TouchableOpacity>
                    </View>

                    {/* Forgot link */}
                    <TouchableOpacity
                        onPress={() => navigation.navigate('ForgotPassword')}
                        style={styles.forgotLink}
                    >
                        <Text style={[styles.forgotText, { color: theme.colors.primary }]}>
                            Forgot Password?
                        </Text>
                    </TouchableOpacity>

                    {/* Login Button */}
                    <TouchableOpacity
                        style={[styles.loginBtn, { backgroundColor: theme.colors.primary }]}
                        onPress={handleLogin}
                        disabled={loading}
                    >
                        {loading
                            ? <ActivityIndicator color="#fff" />
                            : <Text style={styles.loginText}>Sign In</Text>}
                    </TouchableOpacity>

                    {/* Signup link */}
                    <View style={styles.signUpRow}>
                        <Text style={[styles.signUpPrompt, { color: theme.colors.text + 'CC' }]}>
                            Don't have an account?
                        </Text>
                        <TouchableOpacity onPress={() => navigation.navigate('Signup')}>
                            <Text style={[styles.signUpLink, { color: theme.colors.primary }]}>
                                Create Account
                            </Text>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: Platform.OS === 'android' ? 45 : 0, // Fixed top padding for Android
    },
    keyboardView: {
        flex: 1,
    },
    scrollContent: {
        paddingHorizontal: 24,
        paddingBottom: 40,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 24,
    },
    backButton: {
        padding: 4,
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: '600',
        marginLeft: 16,
    },
    appName: {
        fontSize: 28,
        fontWeight: '700',
        marginBottom: 8,
    },
    description: {
        fontSize: 16,
        marginBottom: 24,
        textAlign: 'center',
    },
    errorContainer: {
        backgroundColor: '#FFEDED',
        borderLeftWidth: 4,
        borderLeftColor: '#FF4D4F',
        borderRadius: 8,
        padding: 12,
        marginBottom: 16,
    },
    errorText: {
        color: '#CF1322',
        fontSize: 14,
        textAlign: 'center',
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
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
        fontSize: 16,
        height: '100%',
    },
    eyeBtn: {
        padding: 4,
    },
    forgotLink: {
        alignSelf: 'flex-end',
        marginBottom: 24,
    },
    forgotText: {
        fontSize: 14,
        fontWeight: '500',
    },
    loginBtn: {
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
    loginText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
    signUpRow: {
        flexDirection: 'row',
        justifyContent: 'center',
    },
    signUpPrompt: {
        fontSize: 14,
    },
    signUpLink: {
        fontSize: 14,
        fontWeight: '600',
        marginLeft: 4,
    },
});
