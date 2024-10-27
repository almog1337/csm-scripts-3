import React, { useState, useEffect } from 'react';
import { Script, ScriptSection, ScriptInput } from '../types';
import SingleSectionView from './SingleSectionView';
import AllSectionsView from './AllSectionsView';
import { Eye, EyeOff } from 'lucide-react';
import { useTheme } from '../ThemeContext';
import { useAppContext } from '../AppContext';
import StringArrayInput from './StringArrayInput';
import TableInput from './TableInput';

interface ScriptFormProps {
  script: Script;
  onSubmit: (scriptId: string, inputs: Record<string, any>, executionName: string) => void;
}

const ScriptForm: React.FC<ScriptFormProps> = ({ script, onSubmit }) => {
  const { theme } = useTheme();
  const { currentUser } = useAppContext();
  const [viewMode, setViewMode] = useState<'single' | 'all'>('single');
  const [currentSectionIndex, setCurrentSectionIndex] = useState(0);
  const [inputs, setInputs] = useState<Record<string, any>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [sectionErrors, setSectionErrors] = useState<Record<string, string>>({});
  const [executionName, setExecutionName] = useState('');
  const [isFormValid, setIsFormValid] = useState(false);
  const [tableValidStates, setTableValidStates] = useState<Record<string, boolean>>({});

  const toggleViewMode = () => {
    setViewMode(prev => prev === 'single' ? 'all' : 'single');
  };

  const handleInputChange = (name: string, value: any, isTableValid?: boolean) => {
    setInputs(prev => ({ ...prev, [name]: value }));
    if (isTableValid !== undefined) {
      setTableValidStates(prev => ({ ...prev, [name]: isTableValid }));
    }
    validateInput(name, value);
  };

  const validateInput = (name: string, value: any) => {
    const input = script.sections.flatMap(s => s.inputs).find(i => i.name === name);
    if (input) {
      if (input.required && (value === undefined || value === '' || (Array.isArray(value) && value.length === 0))) {
        setErrors(prev => ({ ...prev, [name]: 'שדה זה הוא חובה' }));
      } else if (input.validation && !input.validation.test(String(value))) {
        setErrors(prev => ({ ...prev, [name]: 'קלט לא חוקי' }));
      } else {
        setErrors(prev => ({ ...prev, [name]: '' }));
      }
    }
  };

  const validateSection = (section: ScriptSection) => {
    const sectionInputs = section.inputs.reduce((acc, input) => {
      acc[input.name] = inputs[input.name] || '';
      return acc;
    }, {} as Record<string, any>);

    if (section.validate) {
      const error = section.validate(sectionInputs);
      setSectionErrors(prev => ({ ...prev, [section.id]: error || '' }));
      return !error;
    }
    return true;
  };

  const validateForm = () => {
    let isValid = true;
    
    if (!executionName.trim()) {
      isValid = false;
    }

    script.sections.forEach(section => {
      section.inputs.forEach(input => {
        const value = inputs[input.name];
        if (input.required && (value === undefined || value === '' || (Array.isArray(value) && value.length === 0))) {
          setErrors(prev => ({ ...prev, [input.name]: 'שדה זה הוא חובה' }));
          isValid = false;
        }
        
        if (input.isTable && !tableValidStates[input.name]) {
          isValid = false;
        }
      });
    });

    script.sections.forEach(section => {
      if (!validateSection(section)) {
        isValid = false;
      }
    });

    setIsFormValid(isValid);
    return isValid;
  };

  useEffect(() => {
    validateForm();
  }, [inputs, executionName, tableValidStates]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit(script.id, inputs, executionName);
      setInputs({});
      setExecutionName('');
      setErrors({});
      setSectionErrors({});
      setTableValidStates({});
    }
  };

  const renderInput = (input: ScriptInput) => {
    if (input.isTable && input.columns) {
      return (
        <TableInput
          key={input.name}
          name={input.name}
          label={input.label}
          required={input.required}
          value={inputs[input.name] || []}
          onChange={(name, value, isValid) => handleInputChange(name, value, isValid)}
          columns={input.columns}
          validateRow={input.validateRow}
        />
      );
    }

    if (input.isArray) {
      return (
        <StringArrayInput
          key={input.name}
          name={input.name}
          label={input.label}
          required={input.required}
          value={inputs[input.name] || []}
          onChange={(name, value) => handleInputChange(name, value)}
        />
      );
    }

    if (input.type === 'select' && input.options) {
      return (
        <select
          name={input.name}
          value={inputs[input.name] || ''}
          onChange={(e) => handleInputChange(input.name, e.target.value)}
          className="w-full p-2 border rounded focus:ring-2 focus:ring-secondary bg-background text-text hover:bg-primary hover:text-background transition-colors"
          required={input.required}
        >
          <option value="">בחר אפשרות</option>
          {input.options.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      );
    }

    const commonProps = {
      type: input.type,
      name: input.name,
      value: inputs[input.name] || '',
      onChange: (e: React.ChangeEvent<HTMLInputElement>) => handleInputChange(input.name, e.target.value),
      className: "w-full p-2 border rounded focus:ring-2 focus:ring-secondary bg-background text-text hover:border-secondary transition-colors",
      required: input.required,
    };

    if (input.type === 'date') {
      return (
        <input
          {...commonProps}
          type="datetime-local"
          step="60"
        />
      );
    }

    return <input {...commonProps} />;
  };

  return (
    <div className="bg-background p-4 rounded-lg shadow-md border border-accent1">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-accent1">{script.name}</h2>
        <button
          onClick={toggleViewMode}
          className="flex items-center bg-secondary text-primary px-3 py-1 rounded hover:opacity-90 transition-all"
        >
          {viewMode === 'single' ? (
            <>
              <Eye size={18} className="ml-2 rtl-mirror" />
              הצג הכל
            </>
          ) : (
            <>
              <EyeOff size={18} className="ml-2 rtl-mirror" />
              הצג אחד
            </>
          )}
        </button>
      </div>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-sm font-medium text-text mb-1">
            שם ההרצה
            <span className="text-error">*</span>
          </label>
          <input
            type="text"
            value={executionName}
            onChange={(e) => setExecutionName(e.target.value)}
            className="w-full p-2 border rounded focus:ring-2 focus:ring-secondary bg-background text-text hover:border-secondary transition-colors"
            required
          />
        </div>
        {viewMode === 'single' ? (
          <SingleSectionView
            sections={script.sections}
            currentSectionIndex={currentSectionIndex}
            setCurrentSectionIndex={setCurrentSectionIndex}
            inputs={inputs}
            errors={errors}
            sectionErrors={sectionErrors}
            handleInputChange={handleInputChange}
            renderInput={renderInput}
          />
        ) : (
          <AllSectionsView
            sections={script.sections}
            inputs={inputs}
            errors={errors}
            sectionErrors={sectionErrors}
            handleInputChange={handleInputChange}
            renderInput={renderInput}
          />
        )}
        <button
          type="submit"
          className={`bg-primary text-background px-4 py-2 rounded transition-all mt-4 ${
            isFormValid ? 'hover:opacity-90' : 'opacity-50 cursor-not-allowed'
          }`}
          disabled={!isFormValid}
        >
          {currentUser.role === 'admin' ? 'הפעל סקריפט' : 'שלח לאישור'}
        </button>
      </form>
    </div>
  );
};

export default ScriptForm;