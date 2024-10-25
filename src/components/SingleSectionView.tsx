import React from "react";
import { ScriptSection, ScriptInput } from "../types";
import { ChevronRight, ChevronLeft } from "lucide-react";

interface SingleSectionViewProps {
  sections: ScriptSection[];
  currentSectionIndex: number;
  setCurrentSectionIndex: React.Dispatch<React.SetStateAction<number>>;
  inputs: Record<string, string>;
  errors: Record<string, string>;
  sectionErrors: Record<string, string>;
  handleInputChange: (name: string, value: string) => void;
  renderInput: (input: ScriptInput) => React.ReactNode;
}

const SingleSectionView: React.FC<SingleSectionViewProps> = ({
  sections,
  currentSectionIndex,
  setCurrentSectionIndex,
  errors,
  sectionErrors,
  renderInput,
}) => {
  if (
    sections.length === 0 ||
    currentSectionIndex < 0 ||
    currentSectionIndex >= sections.length
  ) {
    return <div className="text-text">אין סעיפים זמינים.</div>;
  }

  const currentSection = sections[currentSectionIndex];

  const goToPreviousSection = () => {
    setCurrentSectionIndex((prev) => Math.max(0, prev - 1));
  };

  const goToNextSection = () => {
    setCurrentSectionIndex((prev) => Math.min(sections.length - 1, prev + 1));
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
                  index === currentSectionIndex ? "bg-primary" : "bg-border"
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
          {renderInput(input)}
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
