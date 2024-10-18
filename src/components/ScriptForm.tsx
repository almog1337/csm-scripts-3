import React, { useState, useEffect } from 'react';
import { Script, ScriptSection, ScriptInput } from '../types';
import SingleSectionView from './SingleSectionView';
import AllSectionsView from './AllSectionsView';
import { Eye, EyeOff } from 'lucide-react';
import { useTheme } from '../ThemeContext';

interface ScriptFormProps {
  script: Script;
  onSubmit: (scriptId: string, inputs: Record<string, string>, executionName: string) => void;
}

const ScriptForm: React.FC<ScriptFormProps> = ({ script, onSubmit }) => {
  const { theme } = useTheme();
  const [viewMode, setViewMode] = useState<'single' | 'all'>('single');
  const [currentSectionIndex, setCurrentSectionIndex] = useState(0);
  const [inputs, setInputs] = useState<Record<string, string>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [sectionErrors, setSectionErrors] = useState<Record<string, string>>({});
  const [executionName, setExecutionName] = useState('');
  const [isFormValid, setIsFormValid] = useState(false);

  const toggleViewMode = () => {
    setViewMode(prev => prev === 'single' ? 'all' : 'single');
  };

  const handleInputChange = (name: string, value: string) => {
    setInputs(prev => ({ ...prev, [name]: value }));
    validateInput(name, value);
  };

  const validateInput = (name: string, value: string) => {
    const input = script.sections.flatMap(s => s.inputs).find(i => i.name === name);
    if (input) {
      if (input.required && !value) {
        setErrors(prev => ({ ...prev, [name]: 'שדה זה הוא חובה' }));
      } else if (input.validation && !input.validation.test(value)) {
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
    }, {} as Record<string, string>);

    if (section.validate) {
      const error = section.validate(sectionInputs);
      setSectionErrors(prev => ({ ...prev, [section.id]: error || '' }));
      return !error;
    }
    return true;
  };

  const validateForm = () => {
    let isValid = true;
    
    // Validate execution name
    if (!executionName.trim()) {
      isValid = false;
    }

    // Validate all required inputs
    script.sections.forEach(section => {
      section.inputs.forEach(input => {
        if (input.required && !inputs[input.name]) {
          setErrors(prev => ({ ...prev, [input.name]: 'שדה זה הוא חובה' }));
          isValid = false;
        }
      });
    });

    // Validate all sections
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
  }, [inputs, executionName]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit(script.id, inputs, executionName);
      // Clear inputs after successful submission
      setInputs({});
      setExecutionName('');
    }
  };

  return (
    <div className="bg-background p-4 rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-text">{script.name}</h2>
        <button
          onClick={toggleViewMode}
          className="flex items-center bg-primary text-background px-3 py-1 rounded hover:bg-opacity-90 transition-colors"
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
            className="w-full p-2 border rounded focus:ring-2 focus:ring-secondary bg-background text-text"
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
          />
        ) : (
          <AllSectionsView
            sections={script.sections}
            inputs={inputs}
            errors={errors}
            sectionErrors={sectionErrors}
            handleInputChange={handleInputChange}
          />
        )}
        <button
          type="submit"
          className={`bg-primary text-background px-4 py-2 rounded transition-colors mt-4 ${
            isFormValid ? 'hover:bg-opacity-90' : 'opacity-50 cursor-not-allowed'
          }`}
          disabled={!isFormValid}
        >
          הפעל סקריפט
        </button>
      </form>
    </div>
  );
};

export default ScriptForm;