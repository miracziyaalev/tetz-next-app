"use client";
import React from "react";
import Image from "next/image";
import QRCode from "./QRCode";

interface PhonePreviewProps {
    qrCodeUrl: string;
}

const PhonePreview: React.FC<PhonePreviewProps> = ({ qrCodeUrl }) => {
    return (
        <div className="relative">


            <div className="relative flex items-center">
                {/* Phone Container */}
                <div className="relative w-[320px] rounded-[3rem] overflow-hidden bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm shadow-2xl">
                    <Image
                        src="/phone.webp"
                        alt="TETZ Mobile App"
                        width={320}
                        height={640}
                        className="w-full h-auto"
                        priority
                    />
                </div>

                {/* QR Code with Animation */}
                <div className="absolute -right-24 top-1/3 animate-float">
                    <div className="transform transition-transform hover:scale-105">
                        <QRCode qrCodeUrl={qrCodeUrl} />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PhonePreview; 