'use client';

import { format } from 'date-fns';
import { CalendarIcon } from 'lucide-react';
import { Calendar } from '@/components/ui/calendar';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';

interface InputCalendarProps {
    value: Date | undefined;
    onChange: (date: Date | undefined) => void;
    disabled?: boolean;
}

export function InputCalendar({ value, onChange, disabled }: InputCalendarProps) {
    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button variant={'outline'} className={cn('w-[240px] pl-3 text-left font-normal', !value && 'text-muted-foreground')} disabled={disabled}>
                    {value ? format(value, 'PPP') : <span>Pick a date</span>}
                    <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                    mode="single"
                    selected={value}
                    onSelect={onChange}
                    disabled={(date) => date > new Date() || date < new Date('1900-01-01')}
                    initialFocus
                />
            </PopoverContent>
        </Popover>
    );
}
