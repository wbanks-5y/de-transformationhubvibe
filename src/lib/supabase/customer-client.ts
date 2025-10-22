import { createClient } from '@supabase/supabase-js';
import type { Database } from '@/integrations/supabase/types';

// Customer Database Connection - gvrxydwedhppmvppqwwm
// This is the shared database where all customer users are created
const CUSTOMER_URL = "https://gvrxydwedhppmvppqwwm.supabase.co";
const CUSTOMER_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imd2cnh5ZHdlZGhwcG12cHBxd3dtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTg1MDk2MjQsImV4cCI6MjA3NDA4NTYyNH0.PmyU_j94vVwvumJS8GfIHxKPe5ntLUpyqJXzkBEFO_o";

export const customerClient = createClient<Database>(CUSTOMER_URL, CUSTOMER_KEY);
