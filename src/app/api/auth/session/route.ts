import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

export async function GET(request: NextRequest) {
    try {
        const authHeader = request.headers.get('authorization');

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return NextResponse.json(
                { error: 'Token gereklidir' },
                { status: 401 }
            );
        }

        const token = authHeader.split(' ')[1];

        // Token'ı doğrula
        const { data: { user }, error } = await supabase.auth.getUser(token);

        if (error || !user) {
            return NextResponse.json(
                { error: 'Geçersiz token' },
                { status: 401 }
            );
        }

        // users tablosundan kullanıcı bilgilerini al
        const { data: userData, error: userError } = await supabase
            .from('users')
            .select('*')
            .eq('email', user.email)
            .single();

        if (userError || !userData) {
            return NextResponse.json(
                { error: 'Kullanıcı bilgileri bulunamadı' },
                { status: 401 }
            );
        }

        // Admin kontrolü
        if (userData.role !== 'admin') {
            return NextResponse.json(
                { error: 'Admin yetkisi gerekli' },
                { status: 403 }
            );
        }

        return NextResponse.json({
            success: true,
            session: {
                access_token: token,
                user: {
                    id: user.id,
                    email: user.email,
                    name: userData.full_name || user.email,
                    role: userData.role
                }
            },
            user: {
                id: user.id,
                email: user.email,
                name: userData.full_name || user.email,
                role: userData.role
            }
        });

    } catch (error) {
        console.error('Session check error:', error);
        return NextResponse.json(
            { error: 'Sunucu hatası oluştu' },
            { status: 500 }
        );
    }
} 