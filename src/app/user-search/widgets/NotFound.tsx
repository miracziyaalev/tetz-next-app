import React from "react";

const NotFound: React.FC = () => {
    return (
        <div className="bg-red-500/30 backdrop-blur-md rounded-2xl shadow-lg border border-red-400/30 p-4 flex flex-col items-center justify-center w-64 mx-auto">
            <div className="w-10 h-10 mb-2 flex items-center justify-center rounded-full bg-red-500/40">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-red-200">
                    <circle cx="12" cy="12" r="10"></circle>
                    <line x1="15" y1="9" x2="9" y2="15"></line>
                    <line x1="9" y1="9" x2="15" y2="15"></line>
                </svg>
            </div>
            <span className="text-sm font-medium text-white text-center">Kullanıcı bulunamadı</span>
        </div>
    );
};

export default NotFound; 