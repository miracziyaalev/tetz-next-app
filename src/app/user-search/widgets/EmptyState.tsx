import React from "react";

const EmptyState: React.FC = () => {
    return (
        <div className="bg-white rounded-xl shadow-md p-8 flex flex-col items-center justify-center text-gray-500 h-64">
            <div className="w-16 h-16 mb-4 flex items-center justify-center rounded-full bg-gray-100">
                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400">
                    <circle cx="12" cy="8" r="5"></circle>
                    <path d="M20 21a8 8 0 1 0-16 0"></path>
                </svg>
            </div>
            <p className="text-center">Katılımcı bilgilerini görüntülemek için arama yapın</p>
        </div>
    );
};

export default EmptyState; 