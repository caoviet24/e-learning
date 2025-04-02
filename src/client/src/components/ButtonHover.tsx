import React from 'react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { Button } from './ui/button';

interface ButtonHoverProps {
    title?: string;
    suggestText?: string;
    variant: 'default' | 'outline' | 'ghost' | 'link' | 'destructive';
    leftIcon?: React.ReactNode;
    rightIcon?: React.ReactNode;
    onClick: () => void;
}

export default function ButtonHover({ title, suggestText, variant, leftIcon, rightIcon, onClick }: ButtonHoverProps) {
    return (
        <TooltipProvider>
            <Tooltip>
                <TooltipTrigger asChild>
                    <Button
                        variant={variant || 'default'}
                        onClick={onClick}
                        className="transition-all duration-300 hover:scale-105 hover:shadow-md active:scale-95"
                    >
                        {leftIcon && <span>{leftIcon}</span>}
                        {title && <span className="hidden sm:inline">{title}</span>}
                        {rightIcon && <span>{rightIcon}</span>}
                    </Button>
                </TooltipTrigger>
                <TooltipContent side="bottom" className="font-medium">
                    {suggestText || title}
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>
    );
}
