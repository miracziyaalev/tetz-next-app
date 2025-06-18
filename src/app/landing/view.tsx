"use client";
import React from "react";
import Image from "next/image";
import { LandingData } from "./viewModel";
import ActionButton from "./widgets/ActionButton";
import PhonePreview from "./widgets/PhonePreview";

interface ViewProps {
    data: LandingData;
    isLoading: boolean;
    onQRGeneration: () => void;
}

const View: React.FC<ViewProps> = ({
    data,
    isLoading,
    onQRGeneration
}) => {
    return (
        <div
            className="h-screen w-screen overflow-hidden relative"
            style={{ backgroundColor: data.backgroundColor }}
        >
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-10">
                <div className="absolute top-0 left-0 w-96 h-96 bg-white rounded-full -translate-x-1/2 -translate-y-1/2"></div>
                <div className="absolute top-1/4 right-0 w-64 h-64 bg-white rounded-full translate-x-1/2"></div>
                <div className="absolute bottom-0 left-1/3 w-80 h-80 bg-white rounded-full -translate-x-1/2 translate-y-1/2"></div>
            </div>

            {/* Logo */}
            <div className="absolute top-8 left-8">
                <Image
                    src={data.logoUrl}
                    alt="TETZ Logo"
                    width={240}
                    height={80}
                    className="h-auto"
                />
            </div>

            {/* Main Content */}
            <div className="relative h-full flex flex-col lg:flex-row items-center justify-between px-8 lg:px-16">
                {/* Left Side - Text Content */}
                <div className="flex-1 w-full lg:w-1/2 flex flex-col items-center lg:items-start justify-center text-center lg:text-left">
                    <h2 className="text-2xl md:text-3xl text-white/80 font-light mb-4">
                        {data.title}
                    </h2>
                    <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
                        {data.subtitle}
                    </h1>
                    <p className="text-xl md:text-2xl text-white/90 mb-3">
                        {data.date}
                    </p>
                    <p className="text-lg md:text-xl text-white/80 mb-8">
                        {data.location}
                    </p>

                    {/* Action Button */}
                    <ActionButton
                        isLoading={isLoading}
                        onClick={onQRGeneration}
                    />
                </div>

                {/* Right Side - Phone and QR */}
                <div className="flex-1 w-full lg:w-1/2 flex justify-center items-center relative mt-12 lg:mt-0">
                    <PhonePreview qrCodeUrl={data.qrCodeUrl} />
                </div>
            </div>
        </div>
    );
};

export default View; 