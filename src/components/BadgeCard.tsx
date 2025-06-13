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
                justifyContent: 'center',
                width: '10cm',
                height: '15cm',
                background: 'white',
                padding: '5cm 0',
                ...customStyle,
            }}
        >
            <div
                style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '10cm',
                    height: '5cm',
                    background: 'white',
                    gap: '8px',
                }}
            >
                <h2 className={styles.name}>{user.full_name}</h2>
                <p className={styles.title} style={{ marginBottom: '-8px' }}>{user.title}</p>
                <p className={styles.institution}>{user.institution}</p>
                <div
                    style={{
                        width: '3.5cm',
                        height: '3.5cm',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        background: 'white',
                        borderRadius: '8px',
                    }}
                >
                    <QRCodeSVG value={vCard} width="3.5cm" height="3.5cm" level="H" includeMargin={true} />
                </div>
            </div>
        </div>
    );
});

BadgeCard.displayName = 'BadgeCard';

export default BadgeCard; 