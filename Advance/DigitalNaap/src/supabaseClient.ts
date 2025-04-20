import { createClient } from '@supabase/supabase-js';
import AsyncStorage from '@react-native-async-storage/async-storage';
import 'react-native-url-polyfill/auto';

// It is recommended to store these keys in an environment file using packages like react-native-config,
// but here they are hardcoded for illustration purposes.
const supabaseUrl = 'https://hylzrvlxrskdwgknlaxt.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh5bHpydmx4cnNrZHdna25sYXh0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQ1Mzk4MDksImV4cCI6MjA2MDExNTgwOX0.0N6tI5CPiYVWZ1B6VKH5xpmE9ghnAOpo1fNj6hgH8iU'; // Replace with your Supabase anon key

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
        storage: AsyncStorage,       // <-- use AsyncStorage instead of localStorage
        persistSession: true,        // <-- automatically save/load the session
        autoRefreshToken: true,      // <-- automatically refresh the access token
        detectSessionInUrl: false,   // <-- only relevant for web
    },
});
