import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { TableColumn } from '../types';

interface TableDisplayProps {
  data: Record<string, string>[] | string;
  columns: TableColumn[];
}

const TableDisplay: React.FC<TableDisplayProps> = ({ data, columns }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleExpand = () => setIsExpanded(!isExpanded);

  const parseData = (data: Record<string, string>[] | string): Record<string, string>[] => {
    if (typeof data === 'string') {
      try {
        return JSON.parse(data);
      } catch {
        return [];
      }
    }
    return data;
  };

  const renderTableContent = () => {
    const parsedData = parseData(data);

    if (parsedData.length === 0) {
      return <p>No data available</p>;
    }

    return (
      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-primary text-background">
            {columns.map((col) => (
              <th key={col.key} className="p-2 text-right">{col.label}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {parsedData.map((row, rowIndex) => (
            <tr key={rowIndex} className="border-b border-border">
              {columns.map((col) => (
                <td key={col.key} className="p-2">
                  {row[col.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    );
  };

  return (
    <div className="mt-2">
      <button
        onClick={toggleExpand}
        className="flex items-center text-primary hover:text-secondary transition-colors"
      >
        {isExpanded ? (
          <>
            <ChevronUp size={20} className="ml-2 rtl-mirror" />
            הסתר טבלה
          </>
        ) : (
          <>
            <ChevronDown size={20} className="ml-2 rtl-mirror" />
            הצג טבלה
          </>
        )}
      </button>
      {isExpanded && (
        <div className="mt-2 overflow-x-auto">
          {renderTableContent()}
        </div>
      )}
    </div>
  );
};

export default TableDisplay;