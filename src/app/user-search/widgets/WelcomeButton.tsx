import React from "react";

interface WelcomeButtonProps {
    onWelcomeClick: () => void;
}

const WelcomeButton: React.FC<WelcomeButtonProps> = ({ onWelcomeClick }) => {
    const handleClick = () => {
        console.log("Welcome button clicked!");
        onWelcomeClick();
    };

    return (
        <button
            onClick={handleClick}
            className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl px-4 py-2 text-white/70 hover:bg-white/20 hover:text-white transition-all duration-200 cursor-pointer relative z-20"
        >
            Karşılama Ekranına Git
        </button>
    );
};

export default WelcomeButton; 