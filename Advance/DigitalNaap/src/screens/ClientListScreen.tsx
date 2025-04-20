import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    FlatList,
    TouchableOpacity,
    StyleSheet,
    ActivityIndicator,
    RefreshControl,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useTheme } from '../contexts/ThemeContext';
import { RootStackParamList } from '../navigations/AppNavigator';
import { Client } from '../types/index';
import { getClients } from '../services/measurementService';

type Props = NativeStackScreenProps<RootStackParamList, 'ClientList'>;

const ClientListScreen: React.FC<Props> = ({ navigation }) => {
    const { theme } = useTheme();
    const [clients, setClients] = useState<Client[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [refreshing, setRefreshing] = useState<boolean>(false);
    const [error, setError] = useState<string>('');

    // Load clients when component mounts
    useEffect(() => {
        fetchClients();
    }, []);

    const fetchClients = async () => {
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
    };

    const handleRefresh = async () => {
        setRefreshing(true);
        await fetchClients();
        setRefreshing(false);
    };

    const renderItem = ({ item }: { item: Client }) => (
        <TouchableOpacity
            style={[
                styles.clientCard,
                {
                    backgroundColor: theme.colors.background,
                    borderColor: theme.colors.primary,
                },
            ]}
            onPress={() =>
                navigation.navigate('ClientDetail', { clientId: item.id })
            } // Adjust this if you haven't implemented ClientDetail
        >
            <Text style={[styles.clientName, { color: theme.colors.text }]}>
                {item.name}
            </Text>
            <Text style={[styles.clientMeasurements, { color: theme.colors.text }]}>
                Chest: {item.chest} | Waist: {item.waist} | Hips: {item.hips}
            </Text>
        </TouchableOpacity>
    );

    return (
        <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
            {loading && !refreshing ? (
                <ActivityIndicator size="large" color={theme.colors.primary} />
            ) : error ? (
                <Text style={[styles.errorText, { color: 'red' }]}>{error}</Text>
            ) : (
                <FlatList
                    data={clients}
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={renderItem}
                    refreshControl={
                        <RefreshControl
                            refreshing={refreshing}
                            onRefresh={handleRefresh}
                            tintColor={theme.colors.primary}
                        />
                    }
                    ListEmptyComponent={
                        <Text style={[styles.emptyText, { color: theme.colors.text }]}>
                            No clients found.
                        </Text>
                    }
                />
            )}

            <TouchableOpacity
                style={[styles.addButton, { backgroundColor: theme.colors.primary }]}
                onPress={() => navigation.navigate('AddClient')}
            >
                <Text style={[styles.addButtonText, { color: theme.colors.text }]}>
                    + Add Client
                </Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: 16,
        paddingTop: 20,
    },
    clientCard: {
        padding: 16,
        borderWidth: 1,
        borderRadius: 8,
        marginBottom: 12,
    },
    clientName: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    clientMeasurements: {
        marginTop: 8,
        fontSize: 14,
    },
    errorText: {
        fontSize: 16,
        alignSelf: 'center',
        marginTop: 20,
    },
    emptyText: {
        fontSize: 16,
        alignSelf: 'center',
        marginTop: 20,
    },
    addButton: {
        position: 'absolute',
        right: 16,
        bottom: 16,
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderRadius: 25,
        elevation: 2,
    },
    addButtonText: {
        fontSize: 16,
        fontWeight: 'bold',
    },
});

export default ClientListScreen;
