import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://rfbdlhysrsctxgxcqtga.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJmYmRsaHlzcnNjdHhneGNxdGdhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzEyMjUwNzIsImV4cCI6MjA4NjgwMTA3Mn0.W3hcGznFUvM0yWH9O5Uvpjfiamv033au6Re4c6CPwa8';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
