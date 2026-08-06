import React from 'react';

interface Props {
    children?: React.ReactNode; // Allow children to be passed
    className?: string;
}

const SubHeading: React.FC<Props> = ({ children, className }) => {
    return (
        <div>
            <h3 className={`text-white font-cairo  md:text-lg text-sm md:leading-[30px]  ${className}`}>{children}</h3>
        </div>
    );
};

export default SubHeading;
