// src/components/LogoutButton.tsx
import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { supabase } from '../supabaseClient';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigations/AppNavigator';
import { useTheme } from '../contexts/ThemeContext';

export default function LogoutButton() {
    const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
    const { theme } = useTheme();

    const handleLogout = async () => {
        await supabase.auth.signOut();
        navigation.reset({ index: 0, routes: [{ name: 'Landing' }] });
    };

    return (
        <TouchableOpacity onPress={handleLogout} style={styles.button}>
            <Text style={[styles.text, { color: theme.colors.primary }]}>Logout</Text>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    button: { marginRight: 16, padding: 8 },
    text: { fontSize: 14, fontWeight: '600' },
});
