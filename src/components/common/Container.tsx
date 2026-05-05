import React from "react";

interface ContainerProps {
    children: React.ReactNode;
    className?: string;
    variant?: string
}

const Container: React.FC<ContainerProps> = ({ children, className = "", variant }) => {
    return (
        <div className={`px-2 sm:px-6 ${variant === "admin" ? "" : "max-w-7xl mx-auto"} ${className}`}>
            {children}
        </div>
    );
};

export default Container;
