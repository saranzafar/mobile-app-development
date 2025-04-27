import { supabase } from '../supabaseClient';
import type { NewMeasurement } from '../types';
import type { PostgrestError } from '@supabase/supabase-js';

/**
 * A single measurement record as stored in Supabase.
 * » id, created_at, all of your MeasurementValues fields, plus:
 * » custom_fields: an array of { label, value } pairs
 */
export interface MeasurementRecord extends NewMeasurement {
    id: number
    created_at: string
    custom_fields: { label: string; value: string }[]
}

/**
 * Create a new measurement.
 * @param values – all the built-in fields (name, chest, waist, etc.)
 * @param customFields – any extra fields the tailor added
 */
export const addMeasurement = async (
    values: NewMeasurement,
    customFields: { label: string; value: string }[] = []
): Promise<{ data: MeasurementRecord | null; error: PostgrestError | null }> => {
    const payload = {
        ...values,
        custom_fields: customFields,
    };
    const { data, error } = await supabase
        .from<MeasurementRecord>('measurements')
        .insert([payload])
        .single();
    console.log('data: ', data);
    console.log('error: ', error);

    return { data, error };
};

/**
 * Fetch *all* measurements.
 */
export const getMeasurements = async (): Promise<{
    data: MeasurementRecord[] | null
    error: PostgrestError | null
}> => {
    const { data, error } = await supabase
        .from<MeasurementRecord>('measurements')
        .select('*')
        .order('created_at', { ascending: false });
    return { data, error };
};

/**
 * Fetch a single measurement record by its primary key.
 */
export const getMeasurementById = async (
    id: number
): Promise<{ data: MeasurementRecord | null; error: PostgrestError | null }> => {
    const { data, error } = await supabase
        .from<MeasurementRecord>('measurements')
        .select('*')
        .eq('id', id)
        .single();

    return { data, error };
};

/**
 * Update an existing measurement by its ID.
 * Pass only the fields you want to change.
 */
export const updateMeasurement = async (
    id: number,
    updates: Partial<NewMeasurement> & {
        custom_fields?: { label: string; value: string }[]
    }
): Promise<{ data: MeasurementRecord | null; error: PostgrestError | null }> => {
    const { data, error } = await supabase
        .from<MeasurementRecord>('measurements')
        .update(updates)
        .eq('id', id)
        .single();
    return { data, error };
};

/**
 * Delete a measurement by its ID.
 */
export const deleteMeasurement = async (
    id: number
): Promise<{ error: PostgrestError | null }> => {
    const { error } = await supabase
        .from('measurements')
        .delete()
        .eq('id', id);
    return { error };
};
