import React from "react";

interface AdminLoginButtonProps {
    onAdminLogin: () => void;
}

const AdminLoginButton: React.FC<AdminLoginButtonProps> = ({ onAdminLogin }) => {
    const handleClick = () => {
        console.log("Button clicked!");
        onAdminLogin();
    };

    return (
        <button
            onClick={handleClick}
            className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl px-4 py-2 text-white/70 hover:bg-white/20 hover:text-white transition-all duration-200 cursor-pointer relative z-20"
        >
            Yönetici
        </button>
    );
};

export default AdminLoginButton; 