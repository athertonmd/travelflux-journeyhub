// This file is automatically generated. Do not edit it directly.
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://yiunhkcbqdbhxjrdwgaq.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlpdW5oa2NicWRiaHhqcmR3Z2FxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDE2OTA1NjAsImV4cCI6MjA1NzI2NjU2MH0.PBvJvi-zF6dy8kIous7X_qw5LAAOv4ie8S4BMuStR10";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);