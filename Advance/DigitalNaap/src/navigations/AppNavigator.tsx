// src/navigations/AppNavigator.tsx
import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';

import LandingScreen from '../screens/LandingScreen';
import LoginScreen from '../screens/auth/LoginScreen';
import SignupScreen from '../screens/auth/SignupScreen';
import ForgotPasswordScreen from '../screens/auth/ForgotPasswordScreen';
import OtpVerificationScreen from '../screens/auth/OtpVerificationScreen';
import ResetPasswordScreen from '../screens/auth/ResetPasswordScreen';
import ClientListScreen from '../screens/ClientListScreen';
import LogoutButton from '../components/LogoutButton';
import AddMeasurementScreen from '../screens/AddMeasurementScreen';

export type RootStackParamList = {
    Landing: undefined;
    Login: undefined;
    Signup: undefined;
    ForgotPassword: undefined;
    VerifyOtp: { email: string; flow: 'signup' | 'forgot' };
    ResetPassword: undefined;
    ClientList: undefined;
    AddMeasurement: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export const AppNavigator: React.FC = () => {
    const { session, loading } = useAuth();

    const { theme } = useTheme();

    if (loading) { return null; } // or <SplashScreen />

    return (
        <Stack.Navigator
            screenOptions={{
                headerStyle: { backgroundColor: theme.colors.background },
                headerTintColor: theme.colors.text,
                // ensure header is opaque (no bleed-through)
                headerTransparent: false,
                headerTitleAlign: 'center',
            }}
        >
            {session ? (
                // ───── Authenticated ─────
                <>
                    <Stack.Screen
                        name="ClientList"
                        component={ClientListScreen}
                        options={{
                            title: 'Clients',
                            headerRight: () => <LogoutButton />,
                        }}
                    />

                    <Stack.Screen
                        name="AddMeasurement"
                        component={AddMeasurementScreen}
                        options={{
                            title: 'Add Measurement',
                            headerShown: true,
                        }}
                    />
                </>
            ) : (
                // ───── Unauthenticated ─────
                <>
                    <Stack.Screen
                        name="Landing"
                        component={LandingScreen}
                        options={{ headerShown: false }}
                    />
                    <Stack.Screen
                        name="Login"
                        component={LoginScreen}
                        options={{ headerShown: false }}
                    />
                    <Stack.Screen
                        name="Signup"
                        component={SignupScreen}
                        options={{ headerShown: false }}
                    />
                    <Stack.Screen
                        name="ForgotPassword"
                        component={ForgotPasswordScreen}
                        options={{ headerShown: false }}
                    />
                    <Stack.Screen
                        name="VerifyOtp"
                        component={OtpVerificationScreen}
                        options={{ headerShown: false }}
                    />
                    <Stack.Screen
                        name="ResetPassword"
                        component={ResetPasswordScreen}
                        options={{ headerShown: false }}
                    />
                </>
            )}
        </Stack.Navigator>
    );
};

export default AppNavigator;
