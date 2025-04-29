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
import { RootStackParamList } from '../../navigations/AppNavigator';
import { useTheme } from '../../contexts/ThemeContext';
import { verifyOtp, sendOtp } from '../../services/authService';

type Props = NativeStackScreenProps<RootStackParamList, 'VerifyOtp'>;
const inputHeight = 56;

export default function OtpVerificationScreen({ route, navigation }: Props) {
    const { email, flow } = route.params;

    const { theme } = useTheme();

    const [code, setCode] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleVerify = async () => {
        if (!code.trim()) { return setError('Please enter the code'); }
        setError(null);
        setLoading(true);
        try {
            const { error: verifyError, data } = await verifyOtp(email, code);
            if (verifyError) {
                setError(verifyError.message);
            } else if (data.session) {
                if (flow === 'forgot') {
                    // Forgot‐password path → force new password
                    navigation.replace('ResetPassword');
                } else {
                    // Signup path → full login
                    // navigation.replace('ClientList');
                    // autometically navigate to client list
                }
            } else {
                setError('Unexpected response, please try again.');
            }
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleResend = async () => {
        setError(null);
        setLoading(true);
        try {
            const { error: resendError } = await sendOtp(email, flow === 'signup');
            if (resendError) { setError(resendError.message); }
            else { setError('Code resent—check your email.'); }
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    // On Android we offset by the status bar height so content doesn't jump
    const keyboardVerticalOffset = Platform.select({
        ios: 0,
        android: StatusBar.currentHeight || 0,
    });

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
            <StatusBar
                translucent
                backgroundColor="transparent"
                barStyle={theme.colors.background === '#ffffff' ? 'dark-content' : 'light-content'}
            />

            <KeyboardAvoidingView
                style={styles.avoider}
                behavior="padding"
                keyboardVerticalOffset={keyboardVerticalOffset}
            >
                <ScrollView
                    contentContainerStyle={styles.inner}
                    keyboardShouldPersistTaps="handled"
                >
                    <Text style={[styles.title, { color: theme.colors.primary }]}>
                        Enter Verification Code
                    </Text>
                    <Text style={[styles.subtitle, { color: theme.colors.text + 'CC' }]}>
                        We sent a code to {email}
                    </Text>

                    {error ? (
                        <View style={styles.errorContainer}>
                            <Text style={styles.errorText}>{error}</Text>
                        </View>
                    ) : null}

                    <TextInput
                        style={[
                            styles.input,
                            { borderColor: theme.colors.text + '30', color: theme.colors.text },
                        ]}
                        placeholder="123456"
                        placeholderTextColor={theme.colors.text + '50'}
                        keyboardType="number-pad"
                        value={code}
                        onChangeText={setCode}
                        returnKeyType="done"
                        onSubmitEditing={handleVerify}
                    />

                    <TouchableOpacity
                        style={[styles.verifyButton, { backgroundColor: theme.colors.primary }]}
                        onPress={handleVerify}
                        disabled={loading}
                    >
                        {loading ? (
                            <ActivityIndicator color="#fff" />
                        ) : (
                            <Text style={styles.verifyText}>Verify</Text>
                        )}
                    </TouchableOpacity>

                    <TouchableOpacity onPress={handleResend} style={styles.resendButton}>
                        <Text style={[styles.resendText, { color: theme.colors.primary }]}>
                            Resend Code
                        </Text>
                    </TouchableOpacity>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    avoider: { flex: 1 },
    inner: {
        flexGrow: 1,
        justifyContent: 'center',
        padding: 24,
    },
    title: { fontSize: 24, fontWeight: '700', marginBottom: 8 },
    subtitle: { fontSize: 16, marginBottom: 24 },
    input: {
        height: inputHeight,
        borderWidth: 1,
        borderRadius: 12,
        paddingHorizontal: 16,
        fontSize: 18,
        marginBottom: 20,
    },
    verifyButton: {
        height: inputHeight,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    verifyText: { color: '#fff', fontSize: 16, fontWeight: '600' },
    resendButton: { alignSelf: 'center', marginTop: 8 },
    resendText: { fontSize: 14, fontWeight: '500' },
    errorContainer: {
        backgroundColor: '#FFEDED',
        borderRadius: 8,
        padding: 12,
        marginBottom: 16,
        borderLeftWidth: 4,
        borderLeftColor: '#FF4D4F',
    },
    errorText: { color: '#CF1322', fontSize: 14, textAlign: 'center' },
});
