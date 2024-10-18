import React, { useState } from 'react';
import { ScriptSection, ScriptInput } from '../types';
import { ChevronRight, ChevronLeft, ChevronDown, ChevronUp } from 'lucide-react';
import { useTheme } from '../ThemeContext';

interface SingleSectionViewProps {
  sections: ScriptSection[];
  currentSectionIndex: number;
  setCurrentSectionIndex: React.Dispatch<React.SetStateAction<number>>;
  inputs: Record<string, string>;
  errors: Record<string, string>;
  sectionErrors: Record<string, string>;
  handleInputChange: (name: string, value: string) => void;
}

const SingleSectionView: React.FC<SingleSectionViewProps> = ({
  sections,
  currentSectionIndex,
  setCurrentSectionIndex,
  inputs,
  errors,
  sectionErrors,
  handleInputChange,
}) => {
  const { theme } = useTheme();
  const [openAccordion, setOpenAccordion] = useState<string | null>(null);

  if (sections.length === 0 || currentSectionIndex < 0 || currentSectionIndex >= sections.length) {
    return <div className="text-text">אין סעיפים זמינים.</div>;
  }

  const currentSection = sections[currentSectionIndex];

  const goToPreviousSection = () => {
    setCurrentSectionIndex((prev) => Math.max(0, prev - 1));
  };

  const goToNextSection = () => {
    setCurrentSectionIndex((prev) => Math.min(sections.length - 1, prev + 1));
  };

  const toggleAccordion = (inputName: string) => {
    setOpenAccordion(openAccordion === inputName ? null : inputName);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-text">{currentSection.title}</h3>
        <div className="flex items-center space-x-4 rtl:space-x-reverse">
          <div className="flex space-x-2 rtl:space-x-reverse">
            {sections.map((_, index) => (
              <div
                key={index}
                className={`w-2 h-2 rounded-full ${
                  index === currentSectionIndex ? 'bg-primary' : 'bg-border'
                }`}
              />
            ))}
          </div>
          <div className="flex space-x-2 rtl:space-x-reverse">
            <button
              type="button"
              onClick={goToPreviousSection}
              disabled={currentSectionIndex === 0}
              className="bg-primary text-background px-3 py-1 rounded hover:bg-opacity-90 transition-colors disabled:opacity-50"
            >
              <ChevronRight size={18} />
            </button>
            <button
              type="button"
              onClick={goToNextSection}
              disabled={currentSectionIndex === sections.length - 1}
              className="bg-primary text-background px-3 py-1 rounded hover:bg-opacity-90 transition-colors disabled:opacity-50"
            >
              <ChevronLeft size={18} />
            </button>
          </div>
        </div>
      </div>
      {currentSection.inputs.map((input: ScriptInput) => (
        <div key={input.name} className="mb-4">
          <label className="block text-sm font-medium text-text mb-1">
            {input.label}
            {input.required && <span className="text-error">*</span>}
          </label>
          {input.type === 'select' && input.options ? (
            <div className="relative">
              <button
                type="button"
                onClick={() => toggleAccordion(input.name)}
                className="w-full p-2 border rounded text-right bg-background text-text focus:ring-2 focus:ring-secondary flex justify-between items-center"
              >
                <span>{inputs[input.name] || 'בחר אפשרות'}</span>
                {openAccordion === input.name ? (
                  <ChevronUp size={18} className="rtl-mirror" />
                ) : (
                  <ChevronDown size={18} className="rtl-mirror" />
                )}
              </button>
              {openAccordion === input.name && (
                <div className="absolute z-10 w-full mt-1 bg-background border rounded shadow-lg">
                  {input.options.map((option) => (
                    <button
                      key={option}
                      type="button"
                      onClick={() => {
                        handleInputChange(input.name, option);
                        setOpenAccordion(null);
                      }}
                      className={`w-full p-2 text-right text-text hover:bg-secondary hover:bg-opacity-20 transition-colors ${
                        inputs[input.name] === option ? 'bg-secondary bg-opacity-20' : ''
                      }`}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <input
              type={input.type}
              name={input.name}
              value={inputs[input.name] || ''}
              onChange={(e) => handleInputChange(input.name, e.target.value)}
              className="w-full p-2 border rounded focus:ring-2 focus:ring-secondary bg-background text-text"
              required={input.required}
            />
          )}
          {errors[input.name] && (
            <p className="text-error text-sm mt-1">{errors[input.name]}</p>
          )}
        </div>
      ))}
      {sectionErrors[currentSection.id] && (
        <p className="text-error text-sm mt-1">{sectionErrors[currentSection.id]}</p>
      )}
    </div>
  );
};

export default SingleSectionView;