import { supabase } from '../supabaseClient';
import type { Session } from '@supabase/supabase-js';

export const signUp = async (email: string, password: string) => {
    const { error, data } = await supabase.auth.signUp({
        email,
        password,
    });
    return { error, data };
};

export const logIn = async (email: string, password: string) => {
    const { error, data } = await supabase.auth.signInWithPassword({
        email,
        password,
    });
    return { error, data };
};

// sends an OTP code for the "forgot" flow
export const forgotPassword = async (email: string) => {
    const { data, error } = await supabase.auth.signInWithOtp({
        email,
        options: { shouldCreateUser: false },
    });
    return { data, error };
};

/**
 * Send a one‐time passcode (OTP) to the given email.
 * If shouldCreateUser is true, first‐time addresses auto‐get a new account.
 */
export const sendOtp = async (
    email: string,
    shouldCreateUser: boolean = true
) => {
    const { data, error } = await supabase.auth.signInWithOtp({
        email,
        options: { shouldCreateUser },
    });
    return { error, data };
};

/**
 * Verify the OTP (code) the user received via email.
 * On success, this returns data.session with a valid Supabase Session.
 */
export const verifyOtp = async (
    email: string,
    token: string
): Promise<{ error: Error | null; data: { session: Session | null } }> => {
    const { data, error } = await supabase.auth.verifyOtp({
        email,
        token,
        type: 'email',
    });
    return { error, data };
};

/**
 * Update the authenticated user’s password.
 * Requires an active session (i.e. after verifyOtp).
 */
export const updatePassword = async (newPassword: string) => {
    const { data, error } = await supabase.auth.updateUser({ password: newPassword });
    return { error, data };
};

/** Sign the current user out and clear persisted session */
export const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    return { error };
};
