// src/navigations/AppNavigator.tsx
import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';

import LandingScreen from '../screens/LandingScreen';
import LoginScreen from '../screens/LoginScreen';
import SignupScreen from '../screens/SignupScreen';
import ForgotPasswordScreen from '../screens/ForgotPasswordScreen';
import OtpVerificationScreen from '../screens/OtpVerificationScreen';
import ResetPasswordScreen from '../screens/ResetPasswordScreen';
import ClientListScreen from '../screens/ClientListScreen';
import LogoutButton from '../components/LogoutButton';

export type RootStackParamList = {
    Landing: undefined;
    Login: undefined;
    Signup: undefined;
    ForgotPassword: undefined;
    VerifyOtp: { email: string; flow: 'signup' | 'forgot' };
    ResetPassword: undefined;
    ClientList: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export const AppNavigator: React.FC = () => {
    const { session, loading } = useAuth();
    const { theme } = useTheme();
    if (loading) { return null; } // or a splash screen

    return (
        <Stack.Navigator
            screenOptions={{
                headerStyle: { backgroundColor: theme.colors.background },
                headerTintColor: theme.colors.text,
            }}
        >
            {/* Always registered */}
            <Stack.Screen name="Landing" component={LandingScreen} options={{ headerShown: false }} />
            <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
            <Stack.Screen name="Signup" component={SignupScreen} options={{ headerShown: false }} />
            <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} options={{ headerShown: false }} />
            <Stack.Screen name="VerifyOtp" component={OtpVerificationScreen} options={{ headerShown: false }} />
            <Stack.Screen name="ResetPassword" component={ResetPasswordScreen} options={{ headerShown: false }} />

            {/* ClientList always registered too */}
            <Stack.Screen
                name="ClientList"
                component={ClientListScreen}
                options={{
                    headerRight: () => <LogoutButton />,
                    title: 'Clients',
                }}
            />
        </Stack.Navigator>

    );
};

export default AppNavigator;
