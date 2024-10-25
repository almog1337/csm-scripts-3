import React from 'react';

interface ConfirmationDialogProps {
  isOpen: boolean;
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
}

const ConfirmationDialog: React.FC<ConfirmationDialogProps> = ({
  isOpen,
  title,
  message,
  onConfirm,
  onCancel,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[9999]">
      <div className="bg-background p-4 rounded-lg shadow-lg max-w-md w-full">
        <h3 className="text-lg font-bold mb-4">{title}</h3>
        <p className="mb-4 text-text">{message}</p>
        <div className="flex justify-end space-x-2 rtl:space-x-reverse">
          <button
            onClick={onCancel}
            className="px-4 py-2 bg-border text-text rounded hover:bg-opacity-80"
          >
            ביטול
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 bg-primary text-background rounded hover:bg-opacity-80"
          >
            אישור
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationDialog;