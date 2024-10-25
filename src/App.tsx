import React, { useState } from 'react';
import Header from './components/Header';
import ScriptList from './components/ScriptList';
import ScriptForm from './components/ScriptForm';
import ScriptDashboard from './components/ScriptDashboard';
import UserPermissions from './components/UserPermissions';
import SuccessPopup from './components/SuccessPopup';
import { ThemeProvider } from './ThemeContext';
import { AppProvider, useAppContext } from './AppContext';
import { Script, ScriptExecution } from './types';

type ViewMode = 'combined' | 'dashboard' | 'creation' | 'permissions';

function AppContent() {
  const { currentUser, executions, addExecution, updateExecution } = useAppContext();
  const [selectedScript, setSelectedScript] = useState<Script | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>('combined');
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [lastCreatedScriptId, setLastCreatedScriptId] = useState<string | null>(null);

  const handleScriptSubmit = (scriptId: string, inputs: Record<string, any>, executionName: string) => {
    const isAdmin = currentUser.role === 'admin';
    const initialStatus = isAdmin ? 'about to run' : 'pending_approval';
    
    const newExecution: ScriptExecution = {
      id: Date.now().toString(),
      scriptId,
      scriptName: selectedScript?.name || 'Unknown Script',
      status: initialStatus,
      startTime: new Date(),
      requestedBy: currentUser.name,
      approvedBy: isAdmin ? currentUser.name : undefined,
      scriptType: selectedScript?.type || 'Unknown Type',
      executionName,
      inputs
    };

    addExecution(newExecution);
    setLastCreatedScriptId(newExecution.id);
    setShowSuccessPopup(true);

    if (isAdmin) {
      // Simulate script execution for admin
      setTimeout(() => {
        updateExecution(newExecution.id, { status: 'running' });

        setTimeout(() => {
          updateExecution(newExecution.id, {
            status: 'completed',
            result: 'Script executed successfully',
            endTime: new Date(),
          });
        }, 3000);
      }, 1000);
    }
  };

  const handleApproval = (executionId: string, approve: boolean, reason?: string) => {
    if (approve) {
      updateExecution(executionId, {
        status: 'about to run',
        approvedBy: currentUser.name,
      });

      // Simulate script execution after approval
      setTimeout(() => {
        updateExecution(executionId, { status: 'running' });

        setTimeout(() => {
          updateExecution(executionId, {
            status: 'completed',
            result: 'Script executed successfully',
            endTime: new Date(),
          });
        }, 3000);
      }, 1000);
    } else {
      updateExecution(executionId, {
        status: 'rejected',
        rejectedBy: currentUser.name,
        rejectionReason: reason,
        endTime: new Date(),
      });
    }
  };

  const handleDownload = (execution: ScriptExecution) => {
    // Simulate file download
    const content = `מזהה סקריפט: ${execution.scriptId}\nסטטוס: ${execution.status}\nתוצאה: ${execution.result}`;
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `script_execution_${execution.id}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-background text-text flex flex-col">
      <Header 
        viewMode={viewMode}
        setViewMode={setViewMode}
      />
      <main className="container mx-auto py-8 px-4 flex-grow overflow-auto">
        {viewMode === 'combined' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <ScriptList onSelectScript={setSelectedScript} />
              {selectedScript && (
                <ScriptForm script={selectedScript} onSubmit={handleScriptSubmit} />
              )}
            </div>
            <div>
              <ScriptDashboard onDownload={handleDownload} onApproval={handleApproval} />
            </div>
          </div>
        )}
        {viewMode === 'dashboard' && (
          <ScriptDashboard onDownload={handleDownload} onApproval={handleApproval} />
        )}
        {viewMode === 'creation' && (
          <div>
            <ScriptList onSelectScript={setSelectedScript} />
            {selectedScript && (
              <ScriptForm script={selectedScript} onSubmit={handleScriptSubmit} />
            )}
          </div>
        )}
        {viewMode === 'permissions' && (
          <UserPermissions />
        )}
      </main>
      {showSuccessPopup && lastCreatedScriptId && (
        <SuccessPopup 
          message={`הסקריפט ${currentUser.role === 'admin' ? 'נוצר' : 'נשלח לאישור'} בהצלחה! מזהה הסקריפט: ${lastCreatedScriptId}`}
          onClose={() => setShowSuccessPopup(false)}
        />
      )}
    </div>
  );
}

function App() {
  return (
    <ThemeProvider>
      <AppProvider>
        <AppContent />
      </AppProvider>
    </ThemeProvider>
  );
}

export default App;