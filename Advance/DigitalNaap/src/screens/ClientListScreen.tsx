import React, { useEffect, useState, useCallback } from 'react';
import {
    SafeAreaView,
    StatusBar,
    View,
    Text,
    FlatList,
    TouchableOpacity,
    StyleSheet,
    ActivityIndicator,
    RefreshControl,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../contexts/ThemeContext';
import { getClients } from '../services/measurementService';
import { Client } from '../types';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigations/AppNavigator';

type Props = NativeStackScreenProps<RootStackParamList, 'ClientList'>;

export default function ClientListScreen({ navigation }: Props) {
    const { theme } = useTheme();
    const insets = useSafeAreaInsets();

    const [clients, setClients] = useState<Client[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [refreshing, setRefreshing] = useState<boolean>(false);
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
        <View
            style={[
                styles.card,
                {
                    borderColor: theme.colors.primary,
                    backgroundColor: theme.colors.background,
                },
            ]}
        >
            <Text style={[styles.name, { color: theme.colors.text }]}>
                {item.name}
            </Text>
            <Text style={[styles.measurements, { color: theme.colors.text + '99' }]}>
                Chest: {item.chest} · Waist: {item.waist} · Hips: {item.hips}
            </Text>
        </View>
    );

    return (
        <SafeAreaView
            style={[
                styles.container,
                {
                    backgroundColor: theme.colors.background,
                    paddingTop: insets.top,
                },
            ]}
        >
            <StatusBar
                barStyle={
                    theme.colors.background === '#ffffff' ? 'dark-content' : 'light-content'
                }
                backgroundColor="transparent"
                translucent
            />

            <View style={styles.content}>
                {loading && !refreshing ? (
                    <ActivityIndicator size="large" color={theme.colors.primary} />
                ) : error ? (
                    <Text style={[styles.message, { color: theme.colors.error }]}>
                        {error}
                    </Text>
                ) : (
                    <FlatList
                        data={clients}
                        keyExtractor={(c) => c.id.toString()}
                        renderItem={renderItem}
                        contentContainerStyle={
                            clients.length === 0 ? styles.emptyContainer : undefined
                        }
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

                <TouchableOpacity
                    style={[
                        styles.addButton,
                        {
                            backgroundColor: theme.colors.primary,
                            bottom: insets.bottom + 16,
                        },
                    ]}
                    onPress={() => navigation.navigate('AddMeasurement')}
                >
                    <Text style={styles.addButtonText}>+ Add Naap</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    content: {
        flex: 1,
        paddingHorizontal: 16,
        paddingTop: 16,
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
    addButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
});
