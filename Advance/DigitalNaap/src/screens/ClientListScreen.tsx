import React, { useEffect, useState, useCallback, useRef } from 'react';
import {
    SafeAreaView,
    View,
    Text,
    FlatList,
    TouchableOpacity,
    StyleSheet,
    ActivityIndicator,
    RefreshControl,
    Alert,
    Animated,
} from 'react-native';
import { GestureHandlerRootView, Swipeable } from 'react-native-gesture-handler';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../contexts/ThemeContext';
import { getMeasurements, deleteMeasurement } from '../services/measurementService';
import { MeasurementValues } from '../types';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigations/AppNavigator';
import {
    ChevronRight,
    AlertCircle,
    Users,
    Plus,
    Trash2,
    Edit2,
} from 'lucide-react-native';

type Props = NativeStackScreenProps<RootStackParamList, 'ClientList'>;

const EmptyList = ({ color }: { color: string }) => (
    <View style={styles.emptyStateContainer}>
        <Users size={48} color={color + '40'} />
        <Text style={[styles.emptyStateText, { color: color + '99' }]}>No clients found</Text>
        <Text style={[styles.emptyStateSubtext, { color: color + '70' }]}>Add your first client to get started</Text>
    </View>
);

export default function ClientListScreen({ navigation }: Props) {
    const { theme } = useTheme();
    const insets = useSafeAreaInsets();
    const swipeableRefs = useRef<Map<number, Swipeable>>(new Map());

    const [data, setData] = useState<MeasurementValues[]>([]);
    const [loading, setLoading] = useState(false);
    const [refreshing, setRefreshing] = useState(false);
    const [error, setError] = useState<string>('');
    const [deletingId, setDeletingId] = useState<number | null>(null);

    const fetchMeasurements = useCallback(async () => {
        setLoading(true);
        setError('');
        try {
            const { data: measurements, error: supaError } = await getMeasurements();
            if (supaError) { throw supaError; }
            setData(measurements || []);
        } catch (err: any) {
            setError(err.message || 'Error loading data');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchMeasurements();
    }, [fetchMeasurements]);

    const onRefresh = async () => {
        setRefreshing(true);
        await fetchMeasurements();
        setRefreshing(false);
    };

    const formatDate = (d?: string) =>
        d ? new Date(d).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' }) : '';

    const closeAllExcept = (id: number) => {
        swipeableRefs.current.forEach((ref, key) => {
            if (key !== id) { ref.close(); }
        });
    };

    const confirmDelete = (id: number) =>
        Alert.alert('Delete Client?', 'This cannot be undone.', [
            {
                text: 'Cancel', style: 'cancel', onPress: () => swipeableRefs.current.get(id)?.close(),
            },
            {
                text: 'Delete', style: 'destructive', onPress: async () => {
                    setDeletingId(id);
                    try {
                        const { error: delErr } = await deleteMeasurement(id);
                        if (delErr) { throw delErr; }
                        setData((prev) => prev.filter((x) => x.id !== id));
                    } catch (e: any) {
                        Alert.alert('Error', e.message || 'Failed to delete');
                    } finally {
                        setDeletingId(null);
                    }
                }
            }
        ]);

    const renderRightActions = (
        progress: Animated.AnimatedInterpolation,
        dragX: Animated.AnimatedInterpolation,
        id: number
    ) => {
        const translateX = dragX.interpolate({ inputRange: [-120, 0], outputRange: [0, 120], extrapolate: 'clamp' });
        const opacity = progress.interpolate({ inputRange: [0, 1], outputRange: [0, 1] });
        return (
            <Animated.View style={[styles.actionsContainer, { transform: [{ translateX }], opacity }]}>
                <TouchableOpacity
                    style={[styles.swipeBtn, { backgroundColor: '#FFA500' }]}
                    onPress={() => {
                        swipeableRefs.current.get(id)?.close();
                        navigation.navigate('AddMeasurement', { id: id });
                    }}
                >
                    <Edit2 size={20} color="#fff" />
                </TouchableOpacity>
                <TouchableOpacity style={styles.swipeBtn} onPress={() => confirmDelete(id)}>
                    {deletingId === id ? (
                        <ActivityIndicator color="#fff" />
                    ) : (
                        <Trash2 size={20} color="#fff" />
                    )}
                </TouchableOpacity>
            </Animated.View>
        );
    };

    const renderItem = ({ item }: { item: MeasurementValues }) => (
        <Swipeable
            ref={(r) => r && swipeableRefs.current.set(item.id, r)}
            overshootRight={false}
            friction={3}
            rightThreshold={40}
            renderRightActions={(prog, drag) => renderRightActions(prog, drag, item.id)}
            onSwipeableWillOpen={() => closeAllExcept(item.id)}
        >
            <TouchableOpacity
                style={[styles.card, { backgroundColor: theme.colors.background, shadowColor: theme.colors.text }]}
                onPress={() => navigation.navigate('MeasurementDetail', { id: item.id })}
            >
                <View style={styles.avatarContainer}>
                    <Text style={[styles.avatarText, { backgroundColor: theme.colors.primary }]}>
                        {item.name.charAt(0).toUpperCase()}
                    </Text>
                </View>
                <View style={styles.infoContainer}>
                    <Text style={[styles.name, { color: theme.colors.text }]}>{item.name}</Text>
                    <Text style={[styles.phone, { color: theme.colors.text + '99' }]}>
                        {item.phone}
                    </Text>
                    {item.created_at && (
                        <Text style={[styles.date, { color: theme.colors.text + '70' }]}>
                            Added: {formatDate(item.created_at)}
                        </Text>
                    )}
                </View>
                <View style={styles.arrowContainer}>
                    <ChevronRight size={20} color={theme.colors.text + '60'} />
                </View>
            </TouchableOpacity>
        </Swipeable>
    );

    return (
        <GestureHandlerRootView style={{ flex: 1 }}>
            <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background, paddingTop: insets.top }]}>
                <View style={styles.content}>
                    {loading && !refreshing ? (
                        <View style={styles.loadingContainer}>
                            <ActivityIndicator size="large" color={theme.colors.primary} />
                        </View>
                    ) : error ? (
                        <View style={styles.errorContainer}>
                            <AlertCircle size={32} color={theme.colors.error} />
                            <Text style={[styles.message, { color: theme.colors.error }]}>{error}</Text>
                            <TouchableOpacity style={[styles.retryButton, { backgroundColor: theme.colors.primary }]} onPress={fetchMeasurements}>
                                <Text style={styles.retryButtonText}>Retry</Text>
                            </TouchableOpacity>
                        </View>
                    ) : (
                        <FlatList
                            data={data}
                            keyExtractor={(i) => i.id.toString()}
                            renderItem={renderItem}
                            refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={theme.colors.primary} />}
                            ListEmptyComponent={<EmptyList color={theme.colors.text} />}
                            contentContainerStyle={data.length === 0 ? styles.emptyContainer : styles.list}
                        />
                    )}
                    <TouchableOpacity style={[styles.addButton, { backgroundColor: theme.colors.primary, bottom: insets.bottom + 16 }]} onPress={() => navigation.navigate('AddMeasurement')}>
                        <Plus size={24} color="#fff" />
                    </TouchableOpacity>
                </View>
            </SafeAreaView>
        </GestureHandlerRootView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    content: { flex: 1 },
    list: { paddingHorizontal: 10, paddingTop: 8, paddingBottom: 100 },
    card: {
        flexDirection: 'row',
        alignItems: 'center',
        borderRadius: 12,
        padding: 14,
        marginVertical: 6,
        shadowOffset: { width: 1, height: 1 },
        shadowOpacity: 0.5,
        shadowRadius: 16,
        elevation: 2,
    },
    avatarContainer: { marginRight: 14 },
    avatarText: {
        width: 44,
        height: 44,
        borderRadius: 22,
        textAlign: 'center',
        textAlignVertical: 'center',
        fontSize: 18,
        fontWeight: '600',
        color: '#fff',
        lineHeight: 44,
    },
    infoContainer: { flex: 1 },
    name: { fontSize: 16, fontWeight: '600' },
    phone: { fontSize: 13, marginTop: 2 },
    date: { fontSize: 11, marginTop: 4 },
    arrowContainer: { paddingLeft: 8 },
    loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    errorContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
    message: { fontSize: 15, textAlign: 'center', marginVertical: 16 },
    retryButton: { paddingVertical: 8, paddingHorizontal: 20, borderRadius: 6 },
    retryButtonText: { color: '#fff', fontWeight: '600' },
    emptyContainer: { flexGrow: 1, justifyContent: 'center', padding: 20 },
    emptyStateContainer: { alignItems: 'center', justifyContent: 'center', padding: 20 },
    emptyStateText: { fontSize: 17, fontWeight: '600', marginTop: 14 },
    emptyStateSubtext: { fontSize: 13, textAlign: 'center', marginTop: 6 },
    addButton: {
        position: 'absolute',
        right: 16,
        width: 56,
        height: 56,
        borderRadius: 28,
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.25,
        shadowRadius: 3,
    },
    actionsContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingRight: 12,
    },
    swipeBtn: {
        width: 40,
        height: 40,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
        marginHorizontal: 4,
        backgroundColor: '#e31e29',
    },
    deleteContainer: {
        backgroundColor: '#FF3B30',
        justifyContent: 'center',
        alignItems: 'center',
        borderTopRightRadius: 12,
        borderBottomRightRadius: 12,
    },
});
