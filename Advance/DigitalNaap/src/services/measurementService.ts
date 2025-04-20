import { Client } from '../types';

export const getClients = async (): Promise<Client[]> => {
    // Dummy client list for testing purposes
    const dummyClients: Client[] = [
        { id: 1, name: 'Alice Johnson', chest: 34, waist: 28, hips: 36 },
        { id: 2, name: 'Bob Smith', chest: 40, waist: 32, hips: 42 },
        { id: 3, name: 'Carol White', chest: 36, waist: 30, hips: 38 },
    ];

    // Simulate API delay
    return new Promise(resolve => {
        setTimeout(() => {
            resolve(dummyClients);
        }, 1000);
    });
};
