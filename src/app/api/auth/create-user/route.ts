import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { email, password, full_name, title, institution, phone_number, is_in_education_sector, education_sector_type, user_state, user_province } = body;

        // Session kontrolü için admin kullanıcının token'ını al
        const authHeader = request.headers.get('authorization');
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const token = authHeader.split(' ')[1];

        // Supabase Edge Function'ı çağır
        const response = await fetch('https://yrdzcrunsaahbyalnryr.supabase.co/functions/v1/create-user', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'apikey': process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                email,
                password,
                full_name,
                title,
                institution,
                phone_number,
                is_in_education_sector,
                education_sector_type,
                user_state,
                user_province
            })
        });

        const data = await response.json();

        if (!response.ok) {
            return NextResponse.json({ error: data.error || 'Kullanıcı oluşturulamadı' }, { status: response.status });
        }

        return NextResponse.json({ success: true, data });

    } catch (error) {
        console.error('Kullanıcı oluşturma hatası:', error);
        return NextResponse.json({ error: 'Sunucu hatası' }, { status: 500 });
    }
} 