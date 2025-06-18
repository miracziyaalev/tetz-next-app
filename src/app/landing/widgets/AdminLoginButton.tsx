import React from "react";

interface AdminLoginButtonProps {
    onAdminLogin: () => void;
}

const AdminLoginButton: React.FC<AdminLoginButtonProps> = ({ onAdminLogin }) => {
    const handleClick = () => {
        console.log("AdminLoginButton clicked!");
        onAdminLogin();
    };

    return (
        <button
            onClick={handleClick}
            className="bg-white/20 backdrop-blur-sm border-2 border-white/40 rounded-xl px-4 py-2 text-white font-medium hover:bg-white/30 hover:text-white transition-all duration-200 cursor-pointer relative z-50 shadow-lg"
        >
            Yönetici
        </button>
    );
};

export default AdminLoginButton; 