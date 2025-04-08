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
    return condition && children;
}
