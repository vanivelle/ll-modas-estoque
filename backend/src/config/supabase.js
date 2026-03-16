import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ ERRO: Variáveis SUPABASE_URL e SUPABASE_ANON_KEY não configuradas!');
  console.error('   Verifique o arquivo .env em backend/');
  process.exit(1);
}

console.log('✅ Supabase conectado!');

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
