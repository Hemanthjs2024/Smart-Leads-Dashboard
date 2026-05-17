import React from 'react';

interface TableSkeletonProps {
  rows?: number;
  cols?: number;
}

const TableSkeleton: React.FC<TableSkeletonProps> = ({ rows = 8, cols = 6 }) => {
  return (
    <>
      {Array.from({ length: rows }).map((_, rowIdx) => (
        <tr key={rowIdx} className="animate-pulse border-b border-gray-50 dark:border-navy-800">
          {/* Checkbox col */}
          <td className="px-8 py-5">
            <div className="h-4 w-4 bg-gray-100 dark:bg-navy-800 rounded" />
          </td>

          {/* Lead name + email col */}
          <td className="px-8 py-5">
            <div className="flex items-center space-x-3">
              <div className="h-10 w-10 flex-shrink-0 bg-gray-100 dark:bg-navy-800 rounded-xl" />
              <div className="space-y-2 flex-1">
                <div className="h-3.5 bg-gray-100 dark:bg-navy-800 rounded w-32" />
                <div className="h-3 bg-gray-100 dark:bg-navy-800 rounded w-24" />
              </div>
            </div>
          </td>

          {/* Remaining cols */}
          {Array.from({ length: cols - 2 }).map((_, colIdx) => (
            <td key={colIdx} className="px-8 py-5">
              <div className="h-3.5 bg-gray-100 dark:bg-navy-800 rounded w-20" />
            </td>
          ))}
        </tr>
      ))}
    </>
  );
};

export default TableSkeleton;
