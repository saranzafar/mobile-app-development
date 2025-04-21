// src/screens/ClientListScreen.tsx
import React, { useEffect, useState, useCallback } from 'react';
import {
    StatusBar,
    View,
    Text,
    FlatList,
    TouchableOpacity,
    StyleSheet,
    ActivityIndicator,
    RefreshControl,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../contexts/ThemeContext';
import { RootStackParamList } from '../navigations/AppNavigator';
import { Client } from '../types';
import { getClients } from '../services/measurementService';

type Props = NativeStackScreenProps<RootStackParamList, 'ClientList'>;

export default function ClientListScreen({ navigation }: Props) {
    const { theme } = useTheme();
    const insets = useSafeAreaInsets();

    const [clients, setClients] = useState<Client[]>([]);
    const [loading, setLoading] = useState(false);
    const [refreshing, setRefreshing] = useState(false);
    const [error, setError] = useState<string>('');

    const fetchClients = useCallback(async () => {
        setLoading(true);
        setError('');
        try {
            const data = await getClients();
            setClients(data);
        } catch (err: any) {
            setError(err.message || 'Error fetching clients.');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchClients();
    }, [fetchClients]);

    const onRefresh = async () => {
        setRefreshing(true);
        await fetchClients();
        setRefreshing(false);
    };

    const renderItem = ({ item }: { item: Client }) => (
        <TouchableOpacity
            style={[
                styles.card,
                {
                    borderColor: theme.colors.primary,
                    backgroundColor: theme.colors.background,
                },
            ]}
            // onPress={() => navigation.navigate('ClientDetail', { clientId: item.id })}
        >
            <Text style={[styles.name, { color: theme.colors.text }]}>{item.name}</Text>
            <Text style={[styles.measurements, { color: theme.colors.text + 'CC' }]}>
                Chest: {item.chest} · Waist: {item.waist} · Hips: {item.hips}
            </Text>
        </TouchableOpacity>
    );

    return (
        <SafeAreaView
            style={[
                styles.safe,
                { backgroundColor: theme.colors.background, paddingTop: insets.top },
            ]}
        >
            <StatusBar
                translucent
                backgroundColor="transparent"
                barStyle={theme.colors.background === '#ffffff' ? 'dark-content' : 'light-content'}
            />

            <View style={styles.wrapper}>
                {loading && !refreshing ? (
                    <ActivityIndicator size="large" color={theme.colors.primary} />
                ) : error ? (
                    <Text style={[styles.message, { color: theme.colors.error || 'red' }]}>
                        {error}
                    </Text>
                ) : (
                    <FlatList
                        data={clients}
                        keyExtractor={(c) => c.id.toString()}
                        renderItem={renderItem}
                        contentContainerStyle={clients.length === 0 && styles.emptyContainer}
                        refreshControl={
                            <RefreshControl
                                refreshing={refreshing}
                                onRefresh={onRefresh}
                                tintColor={theme.colors.primary}
                            />
                        }
                        ListEmptyComponent={
                            <Text style={[styles.message, { color: theme.colors.text + '99' }]}>
                                No clients found.
                            </Text>
                        }
                    />
                )}

                {/* + Add Client */}
                <TouchableOpacity
                    style={[
                        styles.addButton,
                        {
                            backgroundColor: theme.colors.primary,
                            bottom: insets.bottom + 16,
                        },
                    ]}
                    onPress={() => navigation.navigate('AddClient')}
                >
                    <Text style={styles.addText}>+ Add Client</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safe: {
        flex: 1,
    },
    wrapper: {
        flex: 1,
        paddingHorizontal: 16,
        paddingTop: 16,      // pull content down a bit
    },
    card: {
        borderWidth: 1,
        borderRadius: 8,
        padding: 16,
        marginBottom: 12,
    },
    name: {
        fontSize: 18,
        fontWeight: '600',
    },
    measurements: {
        fontSize: 14,
        marginTop: 4,
    },
    message: {
        fontSize: 16,
        textAlign: 'center',
        marginTop: 32,
    },
    emptyContainer: {
        flexGrow: 1,
        justifyContent: 'center',
    },
    addButton: {
        position: 'absolute',
        right: 16,
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderRadius: 25,
        elevation: 4,
    },
    addText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
});
