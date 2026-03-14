import { supabase } from './api/supabaseClient';

async function testProducts() {
  const { data, error } = await supabase.from('products').select('*');
  console.log({ data, error });
}

testProducts();
