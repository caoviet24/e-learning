import React from 'react';

export default function RenderWithCondition({
    condition,
    className,
    children,
}: {
    condition: boolean;
    className?: string;
    children: React.ReactNode;
}) {
    return <div className={className}>{condition && children}</div>;
}
