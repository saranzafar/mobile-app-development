import React, {
    createContext,
    useState,
    useEffect,
    useContext,
    ReactNode,
} from 'react';
import { supabase } from '../supabaseClient';
import type { Session } from '@supabase/supabase-js';

interface AuthContextData {
    session: Session | null;
    loading: boolean;
}

const AuthContext = createContext<AuthContextData>({
    session: null,
    loading: true,
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [session, setSession] = useState<Session | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // 1) Load initial session
        supabase.auth.getSession().then(({ data }) => {
            if (data.session && data?.session.expires_at * 1000 < Date.now()) {
                supabase.auth.signOut();
            } else {
                setSession(data.session);
            }
            setLoading(false);
        });

        // 2) Subscribe to auth changes
        const {
            data: { subscription },
        } = supabase.auth.onAuthStateChange((_event, newSession) => {
            setSession(newSession);
        });

        // 3) Clean up on unmount
        return () => {
            subscription.unsubscribe();
        };
    }, []);

    return (
        <AuthContext.Provider value={{ session, loading }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
