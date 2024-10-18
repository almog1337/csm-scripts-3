import React, { useState } from 'react';
import { ScriptSection, ScriptInput } from '../types';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { useTheme } from '../ThemeContext';

interface AllSectionsViewProps {
  sections: ScriptSection[];
  inputs: Record<string, string>;
  errors: Record<string, string>;
  sectionErrors: Record<string, string>;
  handleInputChange: (name: string, value: string) => void;
}

const AllSectionsView: React.FC<AllSectionsViewProps> = ({
  sections,
  inputs,
  errors,
  sectionErrors,
  handleInputChange,
}) => {
  const { theme } = useTheme();
  const [expandedSections, setExpandedSections] = useState<string[]>(sections.map(s => s.id));
  const [openAccordions, setOpenAccordions] = useState<Record<string, boolean>>({});

  const toggleSection = (sectionId: string) => {
    setExpandedSections(prev =>
      prev.includes(sectionId)
        ? prev.filter(id => id !== sectionId)
        : [...prev, sectionId]
    );
  };

  const toggleAccordion = (inputName: string) => {
    setOpenAccordions(prev => ({
      ...prev,
      [inputName]: !prev[inputName]
    }));
  };

  return (
    <div className="space-y-6">
      {sections.map((section) => (
        <div key={section.id} className="border rounded-lg overflow-hidden">
          <button
            type="button"
            onClick={() => toggleSection(section.id)}
            className="w-full flex justify-between items-center p-3 bg-primary text-background hover:bg-opacity-90 transition-colors"
          >
            <h3 className="text-lg font-semibold">{section.title}</h3>
            {expandedSections.includes(section.id) ? (
              <ChevronUp size={18} className="rtl-mirror" />
            ) : (
              <ChevronDown size={18} className="rtl-mirror" />
            )}
          </button>
          {expandedSections.includes(section.id) && (
            <div className="p-4">
              {section.inputs.map((input: ScriptInput) => (
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
                        {openAccordions[input.name] ? (
                          <ChevronUp size={18} className="rtl-mirror" />
                        ) : (
                          <ChevronDown size={18} className="rtl-mirror" />
                        )}
                      </button>
                      {openAccordions[input.name] && (
                        <div className="absolute z-10 w-full mt-1 bg-background border rounded shadow-lg">
                          {input.options.map((option) => (
                            <button
                              key={option}
                              type="button"
                              onClick={() => {
                                handleInputChange(input.name, option);
                                toggleAccordion(input.name);
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
              {sectionErrors[section.id] && (
                <p className="text-error text-sm mt-1">{sectionErrors[section.id]}</p>
              )}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default AllSectionsView;