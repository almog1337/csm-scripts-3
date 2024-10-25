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
  renderInput: (input: ScriptInput) => React.ReactNode;
}

const AllSectionsView: React.FC<AllSectionsViewProps> = ({
  sections,
  inputs,
  errors,
  sectionErrors,
  handleInputChange,
  renderInput,
}) => {
  const { theme } = useTheme();
  const [expandedSections, setExpandedSections] = useState<string[]>(sections.map(s => s.id));

  const toggleSection = (sectionId: string) => {
    setExpandedSections(prev =>
      prev.includes(sectionId)
        ? prev.filter(id => id !== sectionId)
        : [...prev, sectionId]
    );
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
                  {renderInput(input)}
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