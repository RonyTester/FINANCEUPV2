const { createClient } = require('@supabase/supabase-js')
require('dotenv').config()

const supabaseUrl = process.env.SUPABASE_URL
const supabaseKey = process.env.SUPABASE_KEY

if (!supabaseUrl || !supabaseKey) {
    throw new Error('As credenciais do Supabase não foram encontradas no arquivo .env')
}

const supabase = createClient(supabaseUrl, supabaseKey)

module.exports = { supabase } 