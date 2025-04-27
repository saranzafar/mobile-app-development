export type NewMeasurement = Omit<MeasurementValues, 'id' | 'created_at'>;

export interface Client {
    id: number;
    name: string;
    chest: number;
    waist: number;
    hips: number;
}

export interface MeasurementValues {
    created_at: string;
    id: number;
    name: string;
    phone: string;
    neck: string;
    shoulder: string;
    chest: string;
    waist: string;
    hip: string;
    inseam: string;
    sleeve: string;
    bicep: string;
    wrist: string;
    calf: string;
}

