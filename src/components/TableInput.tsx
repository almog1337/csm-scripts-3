import React, { useState, useEffect } from 'react';
import { TableColumn } from '../types';
import { Plus, Trash2, AlertCircle } from 'lucide-react';
import { useTheme } from '../ThemeContext';

interface TableInputProps {
  name: string;
  label: string;
  required: boolean;
  value: any[] | string;
  onChange: (name: string, value: any[], isValid: boolean) => void;
  columns: TableColumn[];
  validateRow?: (row: Record<string, string>) => string | null;
}

const TableInput: React.FC<TableInputProps> = ({ name, label, required, value, onChange, columns, validateRow }) => {
  const { theme } = useTheme();
  const [rows, setRows] = useState<Record<string, string>[]>(
    Array.isArray(value) ? value : []
  );
  const [rowErrors, setRowErrors] = useState<(string | null)[]>([]);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [activeErrorIndex, setActiveErrorIndex] = useState<number | null>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const validateAllRows = () => {
    if (!validateRow) return true;
    const errors = rows.map(row => validateRow(row));
    setRowErrors(errors);
    return errors.every(error => error === null);
  };

  useEffect(() => {
    const isValid = validateAllRows();
    onChange(name, rows, isValid);
  }, [rows]);

  const addRow = () => {
    const newRow = columns.reduce((acc, col) => {
      acc[col.key] = '';
      return acc;
    }, {} as Record<string, string>);
    setRows([...rows, newRow]);
    if (validateRow) {
      setRowErrors([...rowErrors, validateRow(newRow)]);
    }
  };

  const updateRow = (index: number, key: string, value: string) => {
    const updatedRows = [...rows];
    updatedRows[index][key] = value;
    setRows(updatedRows);
  };

  const removeRow = (index: number) => {
    const updatedRows = rows.filter((_, i) => i !== index);
    setRows(updatedRows);
    const updatedErrors = rowErrors.filter((_, i) => i !== index);
    setRowErrors(updatedErrors);
  };

  const hasRequiredEmptyFields = (row: Record<string, string>) => {
    return columns.some(col => col.required && !row[col.key]);
  };

  return (
    <div className="mb-4">
      <div className="overflow-x-auto relative">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-primary text-background">
              {columns.map((col) => (
                <th key={col.key} className="p-2 text-right">
                  {col.label}
                  {col.required && <span className="text-error mr-1">*</span>}
                </th>
              ))}
              <th className="p-2 text-right">פעולות</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row, rowIndex) => (
              <tr key={rowIndex} className={`border-b border-border ${
                (rowErrors[rowIndex] || hasRequiredEmptyFields(row)) ? 'bg-error bg-opacity-10' : ''
              }`}>
                {columns.map((col) => (
                  <td key={col.key} className="p-2">
                    {col.type === 'select' && col.options ? (
                      <select
                        value={row[col.key]}
                        onChange={(e) => updateRow(rowIndex, col.key, e.target.value)}
                        className={`w-full p-1 border rounded bg-background text-text ${
                          col.required && !row[col.key] ? 'border-error' : ''
                        }`}
                      >
                        <option value="">בחר</option>
                        {col.options.map((option) => (
                          <option key={option} value={option}>{option}</option>
                        ))}
                      </select>
                    ) : (
                      <input
                        type={col.type}
                        value={row[col.key]}
                        onChange={(e) => updateRow(rowIndex, col.key, e.target.value)}
                        className={`w-full p-1 border rounded bg-background text-text ${
                          col.required && !row[col.key] ? 'border-error' : ''
                        }`}
                      />
                    )}
                  </td>
                ))}
                <td className="p-2">
                  <div className="flex items-center">
                    <button
                      type="button"
                      onClick={() => removeRow(rowIndex)}
                      className="text-error hover:text-opacity-80 transition-colors mr-2"
                    >
                      <Trash2 size={18} />
                    </button>
                    {(rowErrors[rowIndex] || hasRequiredEmptyFields(row)) && (
                      <div 
                        className="relative group"
                        onMouseEnter={() => setActiveErrorIndex(rowIndex)}
                        onMouseLeave={() => setActiveErrorIndex(null)}
                      >
                        <AlertCircle size={18} className="text-error cursor-help" />
                        {activeErrorIndex === rowIndex && (
                          <div 
                            className="fixed p-2 bg-error text-background text-sm rounded shadow-lg whitespace-nowrap z-[9999]"
                            style={{
                              left: `${mousePosition.x}px`,
                              top: `${mousePosition.y - 10}px`,
                              transform: 'translate(-50%, -100%)'
                            }}
                          >
                            {rowErrors[rowIndex] || 'יש למלא את כל השדות המסומנים בכוכבית'}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <button
        type="button"
        onClick={addRow}
        className="mt-2 bg-primary text-background px-3 py-1 rounded hover:bg-opacity-90 transition-colors flex items-center"
      >
        <Plus size={18} className="mr-1" />
        הוסף שורה
      </button>
      {required && rows.length === 0 && (
        <p className="text-error text-sm mt-1">חובה להוסיף לפחות שורה אחת</p>
      )}
      {rows.length > 0 && rowErrors.some(error => error !== null) && (
        <p className="text-error text-sm mt-1">יש לתקן את השגיאות בטבלה לפני שליחת הטופס</p>
      )}
    </div>
  );
};

export default TableInput;