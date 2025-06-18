import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

// Environment variables kontrolü
if (!supabaseUrl || !supabaseServiceKey) {
    console.error('Missing Supabase environment variables');
    throw new Error('Supabase configuration is missing. Please check your environment variables.');
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

export async function POST(request: NextRequest) {
    try {
        const authHeader = request.headers.get('authorization');

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return NextResponse.json(
                { error: 'Token gereklidir' },
                { status: 401 }
            );
        }

        const token = authHeader.split(' ')[1];

        // Supabase ile logout yap
        const { error } = await supabase.auth.admin.signOut(token);

        if (error) {
            console.error('Logout error:', error);
            return NextResponse.json(
                { error: 'Çıkış yapılırken hata oluştu' },
                { status: 500 }
            );
        }

        return NextResponse.json({
            success: true,
            message: 'Başarıyla çıkış yapıldı'
        });

    } catch (error) {
        console.error('Logout API error:', error);
        return NextResponse.json(
            { error: 'Sunucu hatası oluştu' },
            { status: 500 }
        );
    }
} 