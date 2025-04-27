import React, { useEffect, useState } from 'react';
import {
    SafeAreaView,
    StatusBar,
    View,
    Text,
    StyleSheet,
    ActivityIndicator,
    TouchableOpacity,
    Animated,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../contexts/ThemeContext';
import { getMeasurementById, MeasurementRecord } from '../services/measurementService';
import { RootStackParamList } from '../navigations/AppNavigator';
import { ChevronLeft, Calendar, AlertCircle } from 'lucide-react-native';

type Props = NativeStackScreenProps<RootStackParamList, 'MeasurementDetail'>;

export default function MeasurementDetailScreen({ route, navigation }: Props) {
    const { id } = route.params;
    const { theme } = useTheme();
    const insets = useSafeAreaInsets();

    const [item, setItem] = useState<MeasurementRecord | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const scrollY = new Animated.Value(0);

    // Animation values
    const headerOpacity = scrollY.interpolate({
        inputRange: [0, 100],
        outputRange: [0, 1],
        extrapolate: 'clamp',
    });

    const avatarScale = scrollY.interpolate({
        inputRange: [0, 100],
        outputRange: [1, 0.8],
        extrapolate: 'clamp',
    });

    useEffect(() => {
        (async () => {
            try {
                setLoading(true);
                const { data, error: supaError } = await getMeasurementById(id);
                if (supaError) { throw supaError; }
                setItem(data);
            } catch (e: any) {
                setError(e.message || 'Failed to load details');
            } finally {
                setLoading(false);
            }
        })();
    }, [id]);

    if (loading) {
        return (
            <SafeAreaView style={[styles.loadingContainer, { backgroundColor: theme.colors.background }]}>
                <ActivityIndicator size="large" color={theme.colors.primary} />
                <Text style={[styles.loadingText, { color: theme.colors.text }]}>Loading details...</Text>
            </SafeAreaView>
        );
    }

    if (error || !item) {
        return (
            <SafeAreaView
                style={[styles.container, { backgroundColor: theme.colors.background, paddingTop: insets.top }]}
            >
                <StatusBar
                    translucent
                    backgroundColor="transparent"
                    barStyle={theme.colors.background === '#ffffff' ? 'dark-content' : 'light-content'}
                />
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButtonError}>
                    <ChevronLeft size={24} color={theme.colors.text} />
                </TouchableOpacity>
                <View style={styles.errorContainer}>
                    <AlertCircle size={48} color={theme.colors.error} style={styles.errorIcon} />
                    <Text style={[styles.errorText, { color: theme.colors.error }]}>{error || 'Details not found'}</Text>
                    <TouchableOpacity
                        style={[styles.retryButton, { backgroundColor: theme.colors.primary }]}
                        onPress={() => navigation.goBack()}
                    >
                        <Text style={styles.retryButtonText}>Go Back</Text>
                    </TouchableOpacity>
                </View>
            </SafeAreaView>
        );
    }

    const renderSingleField = (label: string, value: string | number) => (
        <View style={styles.singleFieldRow} key={label}>
            <Text style={[styles.fieldLabel, { color: theme.colors.text }]}>{label}</Text>
            <Text style={[styles.fieldValue, { color: theme.colors.text }]}>{value || 'Not provided'}</Text>
        </View>
    );

    const renderTwoFieldsRow = (field1: [string, any], field2: [string, any]) => (
        <View style={styles.twoFieldsRow} key={`${field1[0]}-${field2[0]}`}>
            <View style={styles.fieldHalf}>
                <Text style={[styles.fieldLabel, { color: theme.colors.text }]}>
                    {field1[0].charAt(0).toUpperCase() + field1[0].slice(1).replace(/_/g, ' ')}
                </Text>
                <Text style={[styles.fieldValue, { color: theme.colors.text }]}>
                    {field1[1] || 'Not provided'}
                </Text>
            </View>
            <View style={styles.fieldSeparator} />
            <View style={styles.fieldHalf}>
                <Text style={[styles.fieldLabel, { color: theme.colors.text }]}>
                    {field2[0].charAt(0).toUpperCase() + field2[0].slice(1).replace(/_/g, ' ')}
                </Text>
                <Text style={[styles.fieldValue, { color: theme.colors.text }]}>
                    {field2[1] || 'Not provided'}
                </Text>
            </View>
        </View>
    );

    // build a list of all built-ins except the header fields + custom_fields
    const builtIns = (Object.entries(item) as [keyof MeasurementRecord, any][])
        .filter(
            ([key]) =>
                !['id', 'name', 'phone', 'created_at', 'custom_fields'].includes(key)
        );

    // Format built-in fields for two-column layout when applicable
    const renderBuiltInFields = () => {
        const fields = [...builtIns];
        const renderedFields = [];

        for (let i = 0; i < fields.length; i += 2) {
            if (i + 1 < fields.length) {
                // Render two fields in one row
                renderedFields.push(
                    <React.Fragment key={`pair-${i}`}>
                        {renderTwoFieldsRow(fields[i], fields[i + 1])}
                        {i + 2 < fields.length && (
                            <View style={[styles.fieldDivider, { backgroundColor: theme.colors.border }]} />
                        )}
                    </React.Fragment>
                );
            } else {
                // Render single field in the last row if odd number
                renderedFields.push(
                    <React.Fragment key={`single-${i}`}>
                        {renderSingleField(
                            fields[i][0].charAt(0).toUpperCase() + fields[i][0].slice(1).replace(/_/g, ' '),
                            fields[i][1] ?? ''
                        )}
                    </React.Fragment>
                );
            }
        }

        return renderedFields;
    };

    // Format custom fields for two-column layout when applicable
    const renderCustomFields = () => {
        if (!item.custom_fields || item.custom_fields.length === 0) { return null; }

        const fields = [...item.custom_fields];
        const renderedFields = [];

        for (let i = 0; i < fields.length; i += 2) {
            if (i + 1 < fields.length) {
                // Render two fields in one row
                renderedFields.push(
                    <React.Fragment key={`custom-pair-${i}`}>
                        {renderTwoFieldsRow(
                            [fields[i].label, fields[i].value],
                            [fields[i + 1].label, fields[i + 1].value]
                        )}
                        {i + 2 < fields.length && (
                            <View style={[styles.fieldDivider, { backgroundColor: theme.colors.border }]} />
                        )}
                    </React.Fragment>
                );
            } else {
                // Render single field in the last row if odd number
                renderedFields.push(
                    <React.Fragment key={`custom-single-${i}`}>
                        {renderSingleField(fields[i].label, fields[i].value)}
                    </React.Fragment>
                );
            }
        }

        return renderedFields;
    };

    return (
        <SafeAreaView
            style={[styles.container, { backgroundColor: theme.colors.background }]}
        // edges={['left', 'right']}
        >
            <StatusBar
                translucent
                backgroundColor="transparent"
                barStyle={theme.colors.background === '#ffffff' ? 'dark-content' : 'light-content'}
            />

            {/* Animated header */}
            <Animated.View
                style={[
                    styles.animatedHeader,
                    {
                        backgroundColor: theme.colors.background,
                        borderBottomColor: theme.colors.border,
                        opacity: headerOpacity,
                        paddingTop: insets.bottom,
                    },
                ]}
            >
                <Text style={[styles.headerTitle, { color: theme.colors.text }]} numberOfLines={1}>
                    {item.name}
                </Text>
            </Animated.View>

            {/* Static back button */}
            <View style={[styles.backButtonContainer, { paddingTop: insets.top }]}>
                <TouchableOpacity
                    onPress={() => navigation.goBack()}
                    style={[styles.backButton, { backgroundColor: theme.colors.card }]}
                >
                    <ChevronLeft size={20} color={theme.colors.text} />
                </TouchableOpacity>
            </View>

            <Animated.ScrollView
                contentContainerStyle={[styles.content, { paddingTop: insets.top + 20 }]}
                showsVerticalScrollIndicator={false}
                scrollEventThrottle={16}
                onScroll={Animated.event(
                    [{ nativeEvent: { contentOffset: { y: scrollY } } }],
                    { useNativeDriver: true }
                )}
            >
                <Animated.View
                    style={[
                        styles.avatarContainer,
                        { transform: [{ scale: avatarScale }] },
                    ]}
                >
                    <Text
                        style={[
                            styles.avatarText,
                            {
                                backgroundColor: theme.colors.primary,
                                shadowColor: theme.colors.primary,
                            },
                        ]}
                    >
                        {item.name.charAt(0).toUpperCase()}
                    </Text>
                </Animated.View>

                <View style={styles.profileInfoContainer}>
                    <Text style={[styles.name, { color: theme.colors.text }]}>{item.name}</Text>
                    <Text style={[styles.phone, { color: theme.colors.text + 'CC' }]}>{item.phone}</Text>

                    {item.created_at && (
                        <View style={styles.dateContainer}>
                            <Calendar size={14} color={theme.colors.text + '99'} />
                            <Text style={[styles.date, { color: theme.colors.text + '99' }]}>
                                Added on {new Date(item.created_at).toLocaleDateString('en-US', {
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric',
                                })}
                            </Text>
                        </View>
                    )}
                </View>

                <View style={[styles.card, { backgroundColor: theme.colors.card, shadowColor: theme.colors.text }]}>
                    <Text style={[styles.cardTitle, { color: theme.colors.text }]}>Basic Measurements</Text>

                    {builtIns.length > 0 ? (
                        renderBuiltInFields()
                    ) : (
                        <Text style={[styles.emptyText, { color: theme.colors.text + '99' }]}>
                            No basic measurements recorded
                        </Text>
                    )}
                </View>

                {item.custom_fields && item.custom_fields.length > 0 && (
                    <View style={[styles.card, { backgroundColor: theme.colors.card, shadowColor: theme.colors.text }]}>
                        <Text style={[styles.cardTitle, { color: theme.colors.text }]}>Custom Measurements</Text>
                        {renderCustomFields()}
                    </View>
                )}

                <View style={styles.bottomPadding} />
            </Animated.ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    loadingText: {
        marginTop: 12,
        fontSize: 16,
    },
    errorContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 24,
    },
    errorIcon: {
        marginBottom: 16,
    },
    errorText: {
        fontSize: 16,
        textAlign: 'center',
        marginBottom: 24,
    },
    retryButton: {
        paddingVertical: 12,
        paddingHorizontal: 24,
        borderRadius: 8,
    },
    retryButtonText: {
        color: '#fff',
        fontWeight: '600',
    },
    backButtonError: {
        position: 'absolute',
        top: 48,
        left: 16,
        zIndex: 10,
    },

    animatedHeader: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: 80,
        justifyContent: 'flex-end',
        paddingBottom: 6,
        borderBottomWidth: 1,
        zIndex: 100,
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: '600',
        textAlign: 'center',
    },

    backButtonContainer: {
        position: 'absolute',
        top: -10,
        left: 16,
        zIndex: 200,
    },
    backButton: {
        height: 36,
        width: 36,
        borderRadius: 18,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },

    content: {
        paddingBottom: 24,
        paddingHorizontal: 16,
    },
    avatarContainer: {
        alignItems: 'center',
        marginBottom: 20,
    },
    avatarText: {
        width: 80,
        height: 80,
        borderRadius: 40,
        textAlign: 'center',
        textAlignVertical: 'center',
        fontSize: 32,
        fontWeight: '600',
        color: '#fff',
        lineHeight: 80,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
        elevation: 5,
    },

    profileInfoContainer: {
        alignItems: 'center',
        marginBottom: 24,
    },
    name: {
        fontSize: 24,
        fontWeight: '700',
        marginBottom: 4,
        textAlign: 'center',
    },
    phone: {
        fontSize: 16,
        marginBottom: 8,
    },
    dateContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    date: {
        fontSize: 13,
        marginLeft: 4,
    },

    card: {
        borderRadius: 12,
        padding: 16,
        marginBottom: 16,
        width: '100%',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 8,
        elevation: 2,
    },
    cardTitle: {
        fontSize: 18,
        fontWeight: '600',
        marginBottom: 16,
    },

    // Single field row styles
    singleFieldRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 12,
    },

    // Two fields in one row styles
    twoFieldsRow: {
        flexDirection: 'row',
        paddingVertical: 12,
    },
    fieldHalf: {
        flex: 1,
    },
    fieldSeparator: {
        width: 16,
    },

    fieldLabel: {
        fontSize: 14,
        fontWeight: '500',
        marginBottom: 4,
        color: '#666',
    },
    fieldValue: {
        fontSize: 15,
        fontWeight: '400',
    },
    fieldDivider: {
        height: 1,
        width: '100%',
    },

    emptyText: {
        textAlign: 'center',
        fontSize: 14,
        fontStyle: 'italic',
        paddingVertical: 12,
    },

    bottomPadding: {
        height: 40,
    },
});
