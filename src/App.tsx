import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import ScriptList from './components/ScriptList';
import ScriptForm from './components/ScriptForm';
import ScriptDashboard from './components/ScriptDashboard';
import UserPermissions from './components/UserPermissions';
import SuccessPopup from './components/SuccessPopup';
import { ThemeProvider } from './ThemeContext';
import { scripts } from './data/scripts';
import { users } from './data/users';
import { Script, ScriptExecution, User } from './types';

type ViewMode = 'combined' | 'dashboard' | 'creation' | 'permissions';

function App() {
  const [currentUser, setCurrentUser] = useState<User>(users[0]);
  const [selectedScript, setSelectedScript] = useState<Script | null>(null);
  const [executions, setExecutions] = useState<ScriptExecution[]>([]);
  const [viewMode, setViewMode] = useState<ViewMode>('combined');
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [lastCreatedScriptId, setLastCreatedScriptId] = useState<string | null>(null);

  const handleUserChange = (userId: string) => {
    const user = users.find((u) => u.id === userId);
    if (user) {
      setCurrentUser(user);
    }
  };

  const handleScriptSubmit = (scriptId: string, inputs: Record<string, string>, executionName: string) => {
    if (currentUser.permissions.includes('run_scripts')) {
      const newExecution: ScriptExecution = {
        id: Date.now().toString(),
        scriptId,
        scriptName: scripts.find(s => s.id === scriptId)?.name || 'Unknown Script',
        status: 'about to run',
        startTime: new Date(),
        requestedBy: currentUser.name,
        approvedBy: currentUser.role === 'admin' ? currentUser.name : undefined,
        scriptType: scripts.find(s => s.id === scriptId)?.type || 'Unknown Type',
        executionName
      };
      setExecutions((prev) => [...prev, newExecution]);
      setLastCreatedScriptId(newExecution.id);
      setShowSuccessPopup(true);

      // Simulate script execution
      setTimeout(() => {
        setExecutions((prev) =>
          prev.map((exe) =>
            exe.id === newExecution.id
              ? { ...exe, status: 'running' }
              : exe
          )
        );

        setTimeout(() => {
          setExecutions((prev) =>
            prev.map((exe) =>
              exe.id === newExecution.id
                ? {
                    ...exe,
                    status: 'completed',
                    result: 'Script executed successfully',
                    endTime: new Date(),
                  }
                : exe
            )
          );
        }, 3000);
      }, 1000);
    } else {
      alert('אין לך הרשאה להפעיל סקריפטים.');
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
    <ThemeProvider>
      <div className="min-h-screen bg-background text-text flex flex-col">
        <Header 
          currentUser={currentUser} 
          onUserChange={handleUserChange} 
          viewMode={viewMode}
          setViewMode={setViewMode}
        />
        <main className="container mx-auto py-8 px-4 flex-grow overflow-auto">
          {viewMode === 'combined' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <ScriptList scripts={scripts} onSelectScript={setSelectedScript} />
                {selectedScript && (
                  <ScriptForm script={selectedScript} onSubmit={handleScriptSubmit} />
                )}
              </div>
              <div>
                <ScriptDashboard executions={executions} onDownload={handleDownload} currentUser={currentUser} />
              </div>
            </div>
          )}
          {viewMode === 'dashboard' && (
            <ScriptDashboard executions={executions} onDownload={handleDownload} currentUser={currentUser} />
          )}
          {viewMode === 'creation' && (
            <div>
              <ScriptList scripts={scripts} onSelectScript={setSelectedScript} />
              {selectedScript && (
                <ScriptForm script={selectedScript} onSubmit={handleScriptSubmit} />
              )}
            </div>
          )}
          {viewMode === 'permissions' && (
            <UserPermissions user={currentUser} />
          )}
        </main>
        {showSuccessPopup && lastCreatedScriptId && (
          <SuccessPopup 
            message={`הסקריפט נוצר בהצלחה! מזהה הסקריפט: ${lastCreatedScriptId}`}
            onClose={() => setShowSuccessPopup(false)}
          />
        )}
      </div>
    </ThemeProvider>
  );
}

export default App;