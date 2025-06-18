import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Supabase client oluştur
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
        const { email, password } = await request.json();

        // Email ve password validation
        if (!email || !password) {
            return NextResponse.json(
                { error: 'Email ve şifre gereklidir' },
                { status: 400 }
            );
        }

        // Supabase ile giriş yap
        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });

        if (error) {
            console.error('Login error:', error);
            return NextResponse.json(
                { error: 'Giriş başarısız: ' + error.message },
                { status: 401 }
            );
        }

        if (!data.user) {
            return NextResponse.json(
                { error: 'Kullanıcı bulunamadı' },
                { status: 401 }
            );
        }

        // users tablosundan kullanıcının admin olup olmadığını kontrol et
        const { data: userData, error: userError } = await supabase
            .from('users')
            .select('*')
            .eq('email', email)
            .single();

        if (userError) {
            console.error('User lookup error:', userError);
            return NextResponse.json(
                { error: 'Kullanıcı bilgileri bulunamadı' },
                { status: 401 }
            );
        }

        // Admin kontrolü - role field'ını kontrol et
        if (userData.role !== 'admin') {
            return NextResponse.json(
                { error: 'Bu sayfaya erişim yetkiniz yok. Sadece admin kullanıcılar giriş yapabilir.' },
                { status: 403 }
            );
        }

        // Session bilgilerini döndür
        return NextResponse.json({
            success: true,
            user: {
                id: data.user.id,
                email: data.user.email,
                name: userData.full_name || userData.email,
                role: userData.role
            },
            session: {
                access_token: data.session?.access_token,
                refresh_token: data.session?.refresh_token,
            }
        });

    } catch (error) {
        console.error('Login API error:', error);
        return NextResponse.json(
            { error: 'Sunucu hatası oluştu' },
            { status: 500 }
        );
    }
} 