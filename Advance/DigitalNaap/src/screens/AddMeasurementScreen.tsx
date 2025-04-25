import React, { useState } from 'react';
import {
    SafeAreaView,
    View,
    Text,
    TextInput,
    TouchableOpacity,
    ScrollView,
    StyleSheet,
    ActivityIndicator,
    KeyboardAvoidingView,
    Platform,
    StatusBar,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Trash2, Plus } from 'lucide-react-native';
import { useTheme } from '../contexts/ThemeContext';
import { RootStackParamList } from '../navigations/AppNavigator';
import { MeasurementValues } from '../types';

type Props = NativeStackScreenProps<RootStackParamList, 'AddMeasurement'>;

// required full-width
const singleFields: {
    key: keyof MeasurementValues;
    label: string;
    placeholder: string;
    keyboardType: 'default' | 'phone-pad';
}[] = [
        { key: 'name', label: 'Client Name', placeholder: 'Enter full name', keyboardType: 'default' },
        { key: 'phone', label: 'Phone Number', placeholder: 'Enter phone number', keyboardType: 'phone-pad' },
    ];

// optional measurement pairs
const measurementRows = [
    ['neck', 'Neck', 'shoulder', 'Shoulder'],
    ['chest', 'Chest', 'waist', 'Waist'],
    ['hip', 'Hip', 'inseam', 'Inseam'],
    ['sleeve', 'Sleeve', 'bicep', 'Bicep'],
] as const;

export default function AddMeasurementScreen({ navigation }: Props) {
    const { theme } = useTheme();
    const [values, setValues] = useState<MeasurementValues>({
        name: '', phone: '',
        neck: '', shoulder: '',
        chest: '', waist: '',
        hip: '', inseam: '',
        sleeve: '', bicep: '',
        wrist: '', calf: '',
    });
    const [custom, setCustom] = useState<{ label: string; value: string }[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const handleChange = (k: keyof MeasurementValues, t: string) =>
        setValues(v => ({ ...v, [k]: t }));

    const addCustom = () => setCustom(c => [...c, { label: '', value: '' }]);
    const removeCustom = (i: number) =>
        setCustom(c => c.filter((_, idx) => idx !== i));
    const updateCustom = (i: number, f: 'label' | 'value', t: string) =>
        setCustom(c => c.map((e, idx) => idx === i ? { ...e, [f]: t } : e));

    const handleSave = () => {
        setError(null);
        for (let f of singleFields) {
            if (!values[f.key].trim()) {
                setError(`Please enter ${f.label.toLowerCase()}`);
                return;
            }
        }
        for (let i = 0; i < custom.length; i++) {
            if (!custom[i].label.trim() || !custom[i].value.trim()) {
                setError('Fill in or remove all custom fields');
                return;
            }
        }
        setLoading(true);
        // TODO: call your API with values + custom
        setTimeout(() => {
            setLoading(false);
            navigation.goBack();
        }, 1000);
    };

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
            <StatusBar
                translucent
                backgroundColor="transparent"
                barStyle={theme.colors.background === '#ffffff' ? 'dark-content' : 'light-content'}
            />
            <KeyboardAvoidingView
                style={styles.flex}
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            >
                <ScrollView
                    contentContainerStyle={styles.inner}
                    keyboardShouldPersistTaps="handled"
                    showsVerticalScrollIndicator={false}
                >
                    <View style={styles.header}>
                        <Text style={[styles.title, { color: theme.colors.primary }]}>
                            Add Measurement
                        </Text>
                    </View>

                    {error && (
                        <View style={styles.errorContainer}>
                            <Text style={styles.errorText}>{error}</Text>
                        </View>
                    )}

                    <View style={styles.formSection}>
                        <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
                            Client Information
                        </Text>

                        {/* full-width */}
                        {singleFields.map(f => (
                            <View key={f.key} style={styles.fullRow}>
                                <Text style={[styles.label, { color: theme.colors.text }]}>
                                    {f.label}
                                </Text>
                                <TextInput
                                    style={[styles.input, {
                                        borderColor: theme.colors.text + '30',
                                        backgroundColor: theme.colors.card,
                                        color: theme.colors.text,
                                    }]}
                                    placeholder={f.placeholder}
                                    placeholderTextColor={theme.colors.text + '50'}
                                    keyboardType={f.keyboardType}
                                    value={values[f.key]}
                                    onChangeText={t => handleChange(f.key, t)}
                                />
                            </View>
                        ))}
                    </View>

                    <View style={styles.formSection}>
                        <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
                            Measurements
                        </Text>

                        {/* measurement pairs */}
                        {measurementRows.map(([k1, l1, k2, l2], i) => (
                            <View key={i} style={styles.row}>
                                <View style={styles.half}>
                                    <Text style={[styles.label, { color: theme.colors.text }]}>{l1}</Text>
                                    <TextInput
                                        style={[styles.input, {
                                            borderColor: theme.colors.text + '30',
                                            backgroundColor: theme.colors.card,
                                            color: theme.colors.text,
                                        }]}
                                        placeholder="inches"
                                        placeholderTextColor={theme.colors.text + '50'}
                                        keyboardType="numeric"
                                        value={values[k1]}
                                        onChangeText={t => handleChange(k1, t)}
                                    />
                                </View>
                                <View style={styles.spacer} />
                                <View style={styles.half}>
                                    <Text style={[styles.label, { color: theme.colors.text }]}>{l2}</Text>
                                    <TextInput
                                        style={[styles.input, {
                                            borderColor: theme.colors.text + '30',
                                            backgroundColor: theme.colors.card,
                                            color: theme.colors.text,
                                        }]}
                                        placeholder="inches"
                                        placeholderTextColor={theme.colors.text + '50'}
                                        keyboardType="numeric"
                                        value={values[k2]}
                                        onChangeText={t => handleChange(k2, t)}
                                    />
                                </View>
                            </View>
                        ))}
                    </View>

                    <View style={styles.formSection}>
                        <View style={styles.customHeader}>
                            <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
                                Custom Measurements
                            </Text>
                            <TouchableOpacity
                                onPress={addCustom}
                                style={[styles.addCustomButton, { backgroundColor: theme.colors.primary + '20' }]}
                            >
                                <Plus size={16} color={theme.colors.primary} />
                                <Text style={[styles.addCustomText, { color: theme.colors.primary }]}>
                                    Add custom
                                </Text>
                            </TouchableOpacity>
                        </View>

                        {custom.length === 0 && (
                            <View style={styles.emptyCustom}>
                                <Text style={[styles.emptyText, { color: theme.colors.text + '70' }]}>
                                    No custom measurements added
                                </Text>
                            </View>
                        )}

                        {custom.map((f, i) => (
                            <View key={i} style={styles.row}>
                                <View style={styles.half}>
                                    <TextInput
                                        style={[styles.input, {
                                            borderColor: theme.colors.text + '30',
                                            backgroundColor: theme.colors.card,
                                            color: theme.colors.text,
                                        }]}
                                        placeholder="Label"
                                        placeholderTextColor={theme.colors.text + '50'}
                                        value={f.label}
                                        onChangeText={t => updateCustom(i, 'label', t)}
                                    />
                                </View>
                                <View style={styles.spacer} />
                                <View style={styles.customValueSection}>
                                    <TextInput
                                        style={[styles.input, {
                                            borderColor: theme.colors.text + '30',
                                            backgroundColor: theme.colors.card,
                                            color: theme.colors.text,
                                        }]}
                                        placeholder="Value"
                                        placeholderTextColor={theme.colors.text + '50'}
                                        value={f.value}
                                        onChangeText={t => updateCustom(i, 'value', t)}
                                    />
                                    <TouchableOpacity
                                        onPress={() => removeCustom(i)}
                                        style={styles.removeBtn}
                                        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                                    >
                                        <Trash2 size={18} color={theme.colors.error} />
                                    </TouchableOpacity>
                                </View>
                            </View>
                        ))}
                    </View>

                    <TouchableOpacity
                        style={[
                            styles.saveButton,
                            loading && styles.saveButtonLoading,
                        ]}
                        onPress={handleSave}
                        disabled={loading}
                    >
                        {loading
                            ? <ActivityIndicator color="#fff" />
                            : <Text style={styles.saveText}>Save Measurement</Text>
                        }
                    </TouchableOpacity>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    flex: {
        flex: 1,
    },
    container: {
        flex: 1,
    },
    inner: {
        flexGrow: 1,
        padding: 20,
        paddingBottom: 30,
    },
    header: {
        marginBottom: 16,
    },
    title: {
        fontSize: 24,
        fontWeight: '700',
        letterSpacing: 0.5,
    },
    formSection: {
        marginBottom: 24,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 12,
    },
    fullRow: {
        marginBottom: 16,
    },
    row: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        marginBottom: 16,
    },
    half: {
        flex: 1,
    },
    spacer: {
        width: 12,
    },
    customValueSection: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
    },
    label: {
        fontSize: 14,
        fontWeight: '500',
        marginBottom: 6,
        marginLeft: 2,
    },
    input: {
        height: 48,
        borderWidth: 1,
        borderRadius: 10,
        paddingHorizontal: 12,
        fontSize: 15,
    },
    customHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    addCustomButton: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 6,
        paddingHorizontal: 12,
        borderRadius: 8,
    },
    addCustomText: {
        fontSize: 14,
        fontWeight: '500',
        marginLeft: 4,
    },
    emptyCustom: {
        paddingVertical: 16,
        alignItems: 'center',
    },
    emptyText: {
        fontSize: 14,
    },
    removeBtn: {
        marginLeft: 8,
        padding: 4,
    },
    errorContainer: {
        backgroundColor: '#FFEDED',
        borderLeftWidth: 4,
        borderLeftColor: '#FF4D4F',
        padding: 12,
        marginBottom: 16,
        borderRadius: 8,
    },
    errorText: {
        color: '#CF1322',
        fontSize: 14,
    },
    saveButton: {
        height: 54,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: theme.colors.primary,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    saveButtonLoading: {
        opacity: 0.7,
    },
    saveText: {
        color: '#FFF',
        fontSize: 16,
        fontWeight: '600',
    },
});
