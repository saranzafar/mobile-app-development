import {
    Image,
    KeyboardAvoidingView,
    Platform,
    SafeAreaView,
    StyleSheet,
    Text,
    View,
    TextInput,
    ScrollView,
    TouchableOpacity,
} from 'react-native';
import React, { useContext, useState } from 'react';
import Snackbar from 'react-native-snackbar';
import { AppwriteContext } from '../appwrite/AppwriteContext';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { AuthStackParamList } from '../routes/AuthStack';

type LoginScreenProps = NativeStackScreenProps<AuthStackParamList, 'Login'>;

const Login = ({ navigation }: LoginScreenProps) => {
    const { appwrite, setIsLoggedIn } = useContext(AppwriteContext);
    const [error, setError] = useState<string>('');
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');

    const handleLogin = () => {
        if (!email || !password) {
            setError('All fields are required');
            return;
        }

        const user = { email, password };
        appwrite.login(user)
            .then((response) => {
                if (response) {
                    setIsLoggedIn(true);
                    Snackbar.show({
                        text: 'Login Successful',
                        duration: Snackbar.LENGTH_SHORT,
                    });
                }
            })
            .catch(e => {
                console.log('Login Error: ', e);
                setError('Incorrect Email or Password');
            });
    };

    return (
        <SafeAreaView style={styles.container}>
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={styles.keyboardAvoid}
            >
                <ScrollView
                    contentContainerStyle={styles.scrollContainer}
                    keyboardShouldPersistTaps="handled"
                >
                    <Image
                        source={{ uri: 'https://appwrite.io/images-ee/blog/og-private-beta.png' }}
                        style={styles.logo}
                        resizeMode="contain"
                    />

                    <Text style={styles.title}>Welcome Back</Text>

                    <View style={styles.formContainer}>
                        <Text style={styles.inputLabel}>Email Address</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="john@example.com"
                            placeholderTextColor="#999"
                            value={email}
                            onChangeText={setEmail}
                            keyboardType="email-address"
                            autoCapitalize="none"
                        />

                        <Text style={styles.inputLabel}>Password</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="••••••••"
                            placeholderTextColor="#999"
                            value={password}
                            onChangeText={setPassword}
                            secureTextEntry
                        />

                        {error ? <Text style={styles.errorText}>{error}</Text> : null}

                        <TouchableOpacity
                            style={styles.loginButton}
                            onPress={handleLogin}
                        >
                            <Text style={styles.buttonText}>Sign In</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={styles.signupLink}
                            onPress={() => navigation.navigate('Signup')}
                        >
                            <Text style={styles.signupText}>
                                Don't have an account? <Text style={styles.signupLinkText}>Sign Up</Text>
                            </Text>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
};

export default Login;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f8f9fa',
    },
    keyboardAvoid: {
        flex: 1,
    },
    scrollContainer: {
        flexGrow: 1,
        paddingBottom: 40,
    },
    logo: {
        width: 200,
        height: 100,
        alignSelf: 'center',
        marginTop: 40,
        marginBottom: 20,
    },
    title: {
        fontSize: 28,
        fontWeight: '700',
        color: '#2D4158',
        textAlign: 'center',
        marginBottom: 30,
    },
    formContainer: {
        paddingHorizontal: 24,
    },
    inputLabel: {
        fontSize: 14,
        color: '#2D4158',
        marginBottom: 8,
        fontWeight: '600',
    },
    input: {
        height: 50,
        backgroundColor: '#FFFFFF',
        borderWidth: 1,
        borderColor: '#e3e4e6',
        borderRadius: 8,
        paddingHorizontal: 16,
        marginBottom: 20,
        fontSize: 16,
        color: '#2D4158',
    },
    errorText: {
        color: '#ff4d4f',
        fontSize: 14,
        marginBottom: 15,
        textAlign: 'center',
    },
    loginButton: {
        backgroundColor: '#f02e65',
        height: 50,
        borderRadius: 8,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 10,
        elevation: 2,
    },
    buttonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: '600',
    },
    signupLink: {
        marginTop: 24,
    },
    signupText: {
        color: '#6c757d',
        textAlign: 'center',
        fontSize: 15,
    },
    signupLinkText: {
        color: '#f02e65',
        fontWeight: '600',
    },
});
