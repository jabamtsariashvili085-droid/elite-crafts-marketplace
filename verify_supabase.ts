
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://rfbdlhysrsctxgxcqtga.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJmYmRsaHlzcnNjdHhneGNxdGdhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzEyMjUwNzIsImV4cCI6MjA4NjgwMTA3Mn0.W3hcGznFUvM0yWH9O5Uvpjfiamv033au6Re4c6CPwa8';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

async function testConnection() {
    console.log('Testing connection to:', SUPABASE_URL);
    try {
        const { data, error } = await supabase.from('products').select('*').limit(1);

        if (error) {
            console.error('Connection failed:', error.message);
        } else {
            console.log('Connection successful!');
            console.log('Data received:', data);
        }
    } catch (err) {
        console.error('Unexpected error:', err);
    }
}

testConnection();
