import React from 'react';
import { TableCell, TableRow } from './ui/table';

export default function TableRowSkeleton() {
    return (
        <React.Fragment>
            {Array.from({ length: 5 }).map((_, index) => (
                <TableRow key={index}>
                    {Array.from({ length: 4 }).map((_, cellIndex) => (
                        <TableCell key={cellIndex}>
                            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                        </TableCell>
                    ))}
                </TableRow>
            ))}
        </React.Fragment>
    );
}
