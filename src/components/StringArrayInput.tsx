import React, { useState, useRef, useEffect } from 'react';
import { useTheme } from '../ThemeContext';
import { X, Search, Plus } from 'lucide-react';

interface StringArrayInputProps {
  name: string;
  label: string;
  required: boolean;
  value: string[] | string;
  onChange: (name: string, value: string[]) => void;
}

const StringArrayInput: React.FC<StringArrayInputProps> = ({ name, label, required, value, onChange }) => {
  const { theme } = useTheme();
  const [values, setValues] = useState<string[]>(Array.isArray(value) ? value : []);
  const [inputValue, setInputValue] = useState('');
  const [searchValue, setSearchValue] = useState('');
  const [isSearchMode, setIsSearchMode] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const valuesContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    onChange(name, values);
  }, [values]);

  const addValue = (val: string) => {
    if (val.trim()) {
      setValues([...values, val.trim()]);
      setInputValue('');
    }
  };

  const removeValue = (index: number) => {
    setValues(values.filter((_, i) => i !== index));
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (isSearchMode) {
        setIsSearchMode(false);
        setSearchValue('');
      } else {
        addValue(inputValue);
      }
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedText = e.clipboardData.getData('text');
    const newValues = pastedText
      .split('\n')
      .map(row => row.trim())
      .filter(row => row !== '');
    setValues([...values, ...newValues]);
  };

  const filteredValues = values.filter(val => 
    val.toLowerCase().includes(searchValue.toLowerCase())
  );

  const handleButtonClick = () => {
    if (isSearchMode) {
      setIsSearchMode(false);
      setSearchValue('');
      setInputValue('');
    } else {
      if (inputValue.trim()) {
        addValue(inputValue);
      } else {
        setIsSearchMode(true);
      }
    }
  };

  return (
    <div className="mb-4">
      <div className="border rounded focus-within:ring-2 focus-within:ring-secondary bg-background p-2">
        <div className="flex items-center mb-2">
          <input
            ref={inputRef}
            type="text"
            value={isSearchMode ? searchValue : inputValue}
            onChange={(e) => isSearchMode ? setSearchValue(e.target.value) : setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            onPaste={handlePaste}
            className="flex-grow p-1 bg-transparent focus:outline-none"
            placeholder={isSearchMode ? "חפש ערכים..." : "הזן ערך ולחץ Enter, או הדבק מספר שורות"}
          />
          <button
            type="button"
            onClick={handleButtonClick}
            className="p-1 text-primary hover:text-secondary transition-colors"
            title={isSearchMode ? "חפש" : "הוסף ערך"}
          >
            {isSearchMode ? <Search size={20} /> : <Plus size={20} />}
          </button>
        </div>
        <div 
          ref={valuesContainerRef}
          className="flex flex-wrap gap-2 max-h-40 overflow-y-auto"
        >
          {(isSearchMode ? filteredValues : values).map((val, index) => (
            <div key={index} className="bg-primary text-background px-2 py-1 rounded-full flex items-center">
              <span className="mr-1">{val}</span>
              <button
                type="button"
                onClick={() => removeValue(index)}
                className="text-background hover:text-error transition-colors"
              >
                <X size={14} />
              </button>
            </div>
          ))}
        </div>
      </div>
      <p className="text-sm text-text mt-1">
        הזן ערכים בודדים ולחץ Enter או על סמל הפלוס, או הדבק מספר שורות מאקסל. לחץ על סמל החיפוש לחיפוש בערכים קיימים.
      </p>
    </div>
  );
};

export default StringArrayInput;