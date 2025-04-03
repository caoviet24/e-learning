import React from 'react';
import { TableCell, TableRow } from './ui/table';

export default function TableRowSkeleton({ row, cell }: { row: number; cell: number }) {
    return (
        <React.Fragment>
            {Array.from({ length: row }).map((_, index) => (
                <TableRow key={index}>
                    {Array.from({ length: cell }).map((_, cellIndex) => (
                        <TableCell key={cellIndex}>
                            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                        </TableCell>
                    ))}
                </TableRow>
            ))}
        </React.Fragment>
    );
}
