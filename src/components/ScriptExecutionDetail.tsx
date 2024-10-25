import React from 'react';
import { ScriptExecution, ScriptInput } from '../types';
import { useAppContext } from '../AppContext';
import { ArrowLeft, AlertCircle } from 'lucide-react';
import TableDisplay from './TableDisplay';

interface ScriptExecutionDetailProps {
  execution: ScriptExecution;
  onBack: () => void;
}

const ScriptExecutionDetail: React.FC<ScriptExecutionDetailProps> = ({ execution, onBack }) => {
  const { scripts } = useAppContext();

  const script = scripts.find(s => s.id === execution.scriptId);

  const renderInputValue = (input: ScriptInput, inputValue: any) => {
    if (!inputValue) return 'לא הוזן';

    if (input.isTable && input.columns) {
      return (
        <TableDisplay
          data={inputValue}
          columns={input.columns}
        />
      );
    } else if (input.isArray) {
      return Array.isArray(inputValue) ? inputValue.join(', ') : String(inputValue);
    } else {
      return String(inputValue);
    }
  };

  const renderInputs = () => {
    if (!execution.inputs) {
      return <p className="text-text">לא נמצאו ערכי קלט</p>;
    }

    // If script found, display structured inputs
    return script.sections.map(section => (
      <div key={section.id} className="mb-4">
        <h4 className="font-medium mb-2">{section.title}</h4>
        <div className="space-y-2">
          {section.inputs.map(input => {
            const inputValue = execution.inputs?.[input.name];
            return (
              <div key={input.name}>
                <strong>{input.label}:</strong>{' '}
                {renderInputValue(input, inputValue)}
              </div>
            );
          })}
        </div>
      </div>
    ));
  };

  return (
    <div className="bg-background p-4 rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-text">פרטי הרצת סקריפט</h2>
        <button
          onClick={onBack}
          className="flex items-center text-primary hover:text-secondary transition-colors"
        >
          <ArrowLeft size={20} className="ml-2 rtl-mirror" />
          חזרה לרשימה
        </button>
      </div>

      {execution.status === 'rejected' && execution.rejectionReason && (
        <div className="mb-4 p-4 bg-error bg-opacity-10 rounded-lg border border-error">
          <div className="flex items-start">
            <AlertCircle size={24} className="text-error ml-2 mt-1 flex-shrink-0" />
            <div>
              <h3 className="font-semibold text-error mb-1">סיבת הדחייה:</h3>
              <p className="text-text">{execution.rejectionReason}</p>
              {execution.rejectedBy && (
                <p className="text-sm text-text mt-1">
                  נדחה על ידי: {execution.rejectedBy}
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div>
          <h3 className="font-semibold mb-2 text-text">פרטי ההרצה</h3>
          <div className="space-y-2">
            <p><strong>מזהה:</strong> {execution.id}</p>
            <p><strong>שם הסקריפט:</strong> {execution.scriptName}</p>
            <p><strong>סטטוס:</strong> {execution.status}</p>
            <p><strong>זמן התחלה:</strong> {new Date(execution.startTime).toLocaleString()}</p>
            {execution.endTime && (
              <p><strong>זמן סיום:</strong> {new Date(execution.endTime).toLocaleString()}</p>
            )}
            <p><strong>מבקש:</strong> {execution.requestedBy}</p>
            {execution.approvedBy && (
              <p><strong>מאשר:</strong> {execution.approvedBy}</p>
            )}
            <p><strong>סוג סקריפט:</strong> {execution.scriptType}</p>
            <p><strong>שם ההרצה:</strong> {execution.executionName}</p>
          </div>
        </div>
        <div>
          <h3 className="font-semibold mb-2 text-text">ערכי קלט</h3>
          {renderInputs()}
        </div>
      </div>
      {execution.result && (
        <div>
          <h3 className="font-semibold mb-2 text-text">פלט הסקריפט</h3>
          <pre className="bg-hoverBackground p-4 rounded overflow-x-auto">
            {execution.result}
          </pre>
        </div>
      )}
    </div>
  );
};

export default ScriptExecutionDetail;