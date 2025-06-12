import React from 'react';
import { QRCodeSVG } from 'qrcode.react';
import styles from './BadgeCard.module.css';

interface BadgeCardProps {
    user: {
        full_name: string;
        title: string;
        institution: string;
        phone_number: string;
        email: string;
        active_qr_code: string;
    };
    customStyle?: React.CSSProperties;
}

const BadgeCard = React.forwardRef<HTMLDivElement, BadgeCardProps>(({ user, customStyle }, ref) => {
    if (!user) {
        return null;
    }

    const vCard = `BEGIN:VCARD
VERSION:3.0
N:${user.full_name}
FN:${user.full_name}
TITLE:${user.title}
ORG:${user.institution}
TEL;TYPE=CELL:${user.phone_number}
EMAIL;TYPE=INTERNET:${user.email}
END:VCARD`;

    return (
        <div
            ref={ref}
            className={styles.badgeCard}
            style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'flex-start',
                width: '10cm',
                height: '15cm',
                ...customStyle,
            }}
        >
            <div className={styles.header} style={{ width: '100%' }}>
                <h4>Türkiye Eğitim Teknolojileri Zirvesi</h4>
            </div>
            <div
                style={{
                    flex: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '12px',
                    width: '100%',
                }}
            >
                <h2 className={styles.name}>{user.full_name}</h2>
                <p className={styles.title}>{user.title}</p>
                <p className={styles.institution}>{user.institution}</p>
                <div style={{ marginTop: '16px' }}>
                    <QRCodeSVG value={vCard} size={140} level={"H"} includeMargin={true} />
                </div>
            </div>
        </div>
    );
});

BadgeCard.displayName = 'BadgeCard';

export default BadgeCard; 