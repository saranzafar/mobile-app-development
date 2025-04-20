// src/screens/ResetPasswordScreen.tsx
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
import { updatePassword, signOut } from '../services/authService';
import { Eye, EyeOff } from 'lucide-react-native';

type Props = NativeStackScreenProps<RootStackParamList, 'ResetPassword'>;
const inputHeight = 56;

export default function ResetPasswordScreen({ navigation }: Props) {
    const { theme } = useTheme();
    const [newPass, setNewPass] = useState('');
    const [confirm, setConfirm] = useState('');
    const [showNew, setShowNew] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const handleSave = async () => {
        setError(null);
        if (newPass.length < 6) {
            return setError('Password must be at least 6 characters');
        }
        if (newPass !== confirm) {
            return setError('Passwords do not match');
        }
        setLoading(true);
        try {
            const { error: updError } = await updatePassword(newPass);
            if (updError) { throw updError; }
            await signOut();
            navigation.replace('Login');
        } catch (err: any) {
            setError(err.message || 'Unexpected error');
        } finally {
            setLoading(false);
        }
    };

    const keyboardOffset = Platform.select({
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
                keyboardVerticalOffset={keyboardOffset}
            >
                <ScrollView
                    contentContainerStyle={styles.inner}
                    keyboardShouldPersistTaps="handled"
                >
                    <Text style={[styles.title, { color: theme.colors.primary }]}>
                        Set New Password
                    </Text>

                    {error && (
                        <View style={styles.errorContainer}>
                            <Text style={styles.errorText}>{error}</Text>
                        </View>
                    )}

                    {/* New Password Field */}
                    <View style={[styles.inputContainer, { borderColor: theme.colors.text + '30' }]}>
                        <TextInput
                            style={[styles.input, { color: theme.colors.text }]}
                            placeholder="New Password"
                            placeholderTextColor={theme.colors.text + '99'}
                            secureTextEntry={!showNew}
                            value={newPass}
                            onChangeText={setNewPass}
                            returnKeyType="next"
                        />
                        <TouchableOpacity
                            onPress={() => setShowNew(prev => !prev)}
                            style={styles.eyeIcon}
                            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                        >
                            {showNew ? (
                                <EyeOff size={20} color={theme.colors.text + '80'} />
                            ) : (
                                <Eye size={20} color={theme.colors.text + '80'} />
                            )}
                        </TouchableOpacity>
                    </View>

                    {/* Confirm Password Field */}
                    <View style={[styles.inputContainer, { borderColor: theme.colors.text + '30' }]}>
                        <TextInput
                            style={[styles.input, { color: theme.colors.text }]}
                            placeholder="Confirm Password"
                            placeholderTextColor={theme.colors.text + '99'}
                            secureTextEntry={!showConfirm}
                            value={confirm}
                            onChangeText={setConfirm}
                            returnKeyType="done"
                            onSubmitEditing={handleSave}
                        />
                        <TouchableOpacity
                            onPress={() => setShowConfirm(prev => !prev)}
                            style={styles.eyeIcon}
                            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                        >
                            {showConfirm ? (
                                <EyeOff size={20} color={theme.colors.text + '80'} />
                            ) : (
                                <Eye size={20} color={theme.colors.text + '80'} />
                            )}
                        </TouchableOpacity>
                    </View>

                    {/* Save Button */}
                    <TouchableOpacity
                        style={[styles.saveButton, { backgroundColor: theme.colors.primary }]}
                        onPress={handleSave}
                        disabled={loading}
                    >
                        {loading ? (
                            <ActivityIndicator color="#FFFFFF" />
                        ) : (
                            <Text style={styles.saveText}>Save Password</Text>
                        )}
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
    title: { fontSize: 24, fontWeight: '700', marginBottom: 16 },
    errorContainer: {
        backgroundColor: '#FFEDED',
        borderRadius: 8,
        padding: 12,
        marginBottom: 12,
        borderLeftWidth: 4,
        borderLeftColor: '#FF4D4F',
    },
    errorText: { color: '#CF1322', fontSize: 14, textAlign: 'center' },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        height: inputHeight,
        borderWidth: 1,
        borderRadius: 12,
        marginBottom: 16,
        paddingHorizontal: 16,
    },
    input: {
        flex: 1,
        fontSize: 16,
        height: '100%',
    },
    eyeIcon: {
        padding: 4,
    },
    saveButton: {
        height: inputHeight,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    saveText: { color: '#FFFFFF', fontSize: 16, fontWeight: '600' },
});
