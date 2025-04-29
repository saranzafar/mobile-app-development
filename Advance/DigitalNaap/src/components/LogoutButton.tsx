// src/components/LogoutButton.tsx
import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { supabase } from '../supabaseClient';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigations/AppNavigator';
import { useTheme } from '../contexts/ThemeContext';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function LogoutButton() {
    const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
    const { theme } = useTheme();

    const handleLogout = async () => {
        // 1) sign out (this also clears Supabase's storage)
        const { error } = await supabase.auth.signOut();
        if (error) {
            console.error('Logout error:', error.message);
            return;
        }

        // 2) OPTIONAL: if you really want to double-sure clear *all* Supabase keys:
        const keys = await AsyncStorage.getAllKeys();
        const supaKeys = keys.filter(k => k.startsWith('sb-'));
        await AsyncStorage.multiRemove(supaKeys);

        // 3) confirm there’s no user
        const { data: { user: currentUser } } = await supabase.auth.getUser();
        console.log('currentUser after signOut:', currentUser); // should be null

        // 4) reset nav
        navigation.reset({ index: 0, routes: [{ name: 'Landing' }] });
    };

    return (
        <TouchableOpacity onPress={handleLogout} style={styles.button}>
            <Text style={[styles.text, { color: theme.colors.error }]}>Logout</Text>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    button: { marginRight: 16, padding: 8 },
    text: { fontSize: 14, fontWeight: '600' },
});
