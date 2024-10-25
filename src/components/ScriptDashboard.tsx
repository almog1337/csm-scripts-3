import React, { useState, useMemo } from 'react';
import { ScriptExecution } from '../types';
import { Download, Search, ChevronDown, ChevronUp, Eye, Check, X, RefreshCw } from 'lucide-react';
import { useTheme } from '../ThemeContext';
import { useAppContext } from '../AppContext';
import ScriptExecutionDetail from './ScriptExecutionDetail';
import ConfirmationDialog from './ConfirmationDialog';

interface ScriptDashboardProps {
  onDownload: (execution: ScriptExecution) => void;
  onApproval: (executionId: string, approve: boolean, reason?: string) => void;
}

const ScriptDashboard: React.FC<ScriptDashboardProps> = ({ onDownload, onApproval }) => {
  const { theme } = useTheme();
  const { executions, currentUser, addExecution, updateExecution } = useAppContext();
  const [filters, setFilters] = useState({
    scriptName: '',
    startTime: '',
    endTime: '',
    scriptType: '',
    requestedBy: '',
    approvedBy: '',
    id: '',
    status: '',
    executionName: '',
  });
  const [showFilters, setShowFilters] = useState(false);
  const [selectedExecution, setSelectedExecution] = useState<ScriptExecution | null>(null);
  const [rejectionReason, setRejectionReason] = useState('');
  const [showRejectionDialog, setShowRejectionDialog] = useState(false);
  const [executionToReject, setExecutionToReject] = useState<string | null>(null);
  const [showRerunConfirmation, setShowRerunConfirmation] = useState(false);
  const [executionToRerun, setExecutionToRerun] = useState<ScriptExecution | null>(null);

  const canRerunScripts = currentUser.permissions.includes('rerun_scripts');

  const filteredExecutions = useMemo(() => {
    return executions.filter((execution) => {
      const matchScriptName = execution.scriptName.toLowerCase().includes(filters.scriptName.toLowerCase());
      const matchStartTime = !filters.startTime || new Date(execution.startTime) >= new Date(filters.startTime);
      const matchEndTime = !filters.endTime || (execution.endTime && new Date(execution.endTime) <= new Date(filters.endTime));
      const matchScriptType = execution.scriptType.toLowerCase().includes(filters.scriptType.toLowerCase());
      const matchRequestedBy = execution.requestedBy.toLowerCase().includes(filters.requestedBy.toLowerCase());
      const matchApprovedBy = !filters.approvedBy || (execution.approvedBy?.toLowerCase().includes(filters.approvedBy.toLowerCase()) ?? false);
      const matchId = execution.id.includes(filters.id);
      const matchStatus = !filters.status || execution.status === filters.status;
      const matchExecutionName = execution.executionName.toLowerCase().includes(filters.executionName.toLowerCase());
      const userFilter = currentUser.role === 'admin' || execution.requestedBy === currentUser.name;

      return matchScriptName && matchStartTime && matchEndTime && matchScriptType && 
             matchRequestedBy && matchApprovedBy && matchId && matchStatus && 
             matchExecutionName && userFilter;
    });
  }, [executions, filters, currentUser]);

  const handleFilterChange = (key: string, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const handleReject = () => {
    if (executionToReject && rejectionReason.trim()) {
      onApproval(executionToReject, false, rejectionReason);
      setShowRejectionDialog(false);
      setRejectionReason('');
      setExecutionToReject(null);
    }
  };

  const handleRerun = (execution: ScriptExecution) => {
    if (!canRerunScripts) return;
    setExecutionToRerun(execution);
    setShowRerunConfirmation(true);
  };

  const confirmRerun = () => {
    if (executionToRerun && canRerunScripts) {
      const newExecution: ScriptExecution = {
        ...executionToRerun,
        id: Date.now().toString(),
        startTime: new Date(),
        endTime: undefined,
        status: currentUser.role === 'admin' ? 'about to run' : 'pending_approval',
        requestedBy: currentUser.name,
        approvedBy: currentUser.role === 'admin' ? currentUser.name : undefined,
        result: undefined,
        executionName: `${executionToRerun.executionName} (הרצה חוזרת)`,
      };

      addExecution(newExecution);

      // Simulate script execution for admin
      if (currentUser.role === 'admin') {
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

      setShowRerunConfirmation(false);
      setExecutionToRerun(null);
    }
  };

  const getStatusColor = (status: ScriptExecution['status']) => {
    switch (status) {
      case 'pending_approval':
        return 'bg-warning text-background';
      case 'about to run':
        return 'bg-info text-background';
      case 'running':
        return 'bg-info text-background';
      case 'completed':
        return 'bg-success text-background';
      case 'rejected':
        return 'bg-error text-background';
      case 'failed':
        return 'bg-error text-background';
      default:
        return 'bg-border text-text';
    }
  };

  const getStatusText = (status: ScriptExecution['status']) => {
    switch (status) {
      case 'pending_approval':
        return 'ממתין לאישור';
      case 'about to run':
        return 'מתחיל לרוץ';
      case 'running':
        return 'רץ';
      case 'completed':
        return 'הושלם';
      case 'rejected':
        return 'נדחה';
      case 'failed':
        return 'נכשל';
      default:
        return status;
    }
  };

  if (selectedExecution) {
    return (
      <ScriptExecutionDetail
        execution={selectedExecution}
        onBack={() => setSelectedExecution(null)}
      />
    );
  }

  return (
    <div className="bg-background p-4 rounded-lg shadow-md border border-accent3">
      <h2 className="text-xl font-bold mb-4 text-accent1">לוח בקרת סקריפטים</h2>
      <button
        onClick={() => setShowFilters(!showFilters)}
        className="mb-4 bg-secondary text-primary px-4 py-2 rounded hover:opacity-90 transition-all"
      >
        {showFilters ? 'הסתר מסננים' : 'הצג מסננים'}
      </button>
      {showFilters && (
        <div className="mb-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <input
            type="text"
            placeholder="שם הסקריפט"
            value={filters.scriptName}
            onChange={(e) => handleFilterChange('scriptName', e.target.value)}
            className="p-2 border rounded"
          />
          <input
            type="text"
            placeholder="שם ההרצה"
            value={filters.executionName}
            onChange={(e) => handleFilterChange('executionName', e.target.value)}
            className="p-2 border rounded"
          />
          <input
            type="datetime-local"
            placeholder="זמן התחלה"
            value={filters.startTime}
            onChange={(e) => handleFilterChange('startTime', e.target.value)}
            className="p-2 border rounded"
          />
          <input
            type="datetime-local"
            placeholder="זמן סיום"
            value={filters.endTime}
            onChange={(e) => handleFilterChange('endTime', e.target.value)}
            className="p-2 border rounded"
          />
          <input
            type="text"
            placeholder="סוג הסקריפט"
            value={filters.scriptType}
            onChange={(e) => handleFilterChange('scriptType', e.target.value)}
            className="p-2 border rounded"
          />
          {currentUser.role === 'admin' && (
            <>
              <input
                type="text"
                placeholder="מבקש הסקריפט"
                value={filters.requestedBy}
                onChange={(e) => handleFilterChange('requestedBy', e.target.value)}
                className="p-2 border rounded"
              />
              <input
                type="text"
                placeholder="מאשר הסקריפט"
                value={filters.approvedBy}
                onChange={(e) => handleFilterChange('approvedBy', e.target.value)}
                className="p-2 border rounded"
              />
            </>
          )}
          <input
            type="text"
            placeholder="מזהה"
            value={filters.id}
            onChange={(e) => handleFilterChange('id', e.target.value)}
            className="p-2 border rounded"
          />
          <select
            value={filters.status}
            onChange={(e) => handleFilterChange('status', e.target.value)}
            className="p-2 border rounded"
          >
            <option value="">כל הסטטוסים</option>
            <option value="pending_approval">ממתין לאישור</option>
            <option value="about to run">מתחיל לרוץ</option>
            <option value="running">רץ</option>
            <option value="completed">הושלם</option>
            <option value="rejected">נדחה</option>
            <option value="failed">נכשל</option>
          </select>
        </div>
      )}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-primary text-background">
              <th className="p-2">מזהה</th>
              <th className="p-2">שם הסקריפט</th>
              <th className="p-2">שם ההרצה</th>
              <th className="p-2">סטטוס</th>
              <th className="p-2">זמן התחלה</th>
              <th className="p-2">זמן סיום</th>
              <th className="p-2">מבקש</th>
              <th className="p-2">פעולות</th>
            </tr>
          </thead>
          <tbody>
            {filteredExecutions.map((execution) => (
              <tr key={execution.id} className="border-b border-border">
                <td className="p-2">{execution.id}</td>
                <td className="p-2">{execution.scriptName}</td>
                <td className="p-2">{execution.executionName}</td>
                <td className="p-2">
                  <span className={`px-2 py-1 rounded ${getStatusColor(execution.status)}`}>
                    {getStatusText(execution.status)}
                  </span>
                </td>
                <td className="p-2">{new Date(execution.startTime).toLocaleString()}</td>
                <td className="p-2">{execution.endTime ? new Date(execution.endTime).toLocaleString() : '-'}</td>
                <td className="p-2">{execution.requestedBy}</td>
                <td className="p-2">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setSelectedExecution(execution)}
                      className="text-primary hover:text-secondary transition-colors no-underline"
                      title="צפה בפרטים"
                    >
                      <Eye size={20} />
                    </button>
                    {execution.status === 'completed' && (
                      <button
                        onClick={() => onDownload(execution)}
                        className="text-primary hover:text-secondary transition-colors no-underline"
                        title="הורד תוצאות"
                      >
                        <Download size={20} className="rtl-mirror" />
                      </button>
                    )}
                    {canRerunScripts && execution.status === 'completed' && (
                      <button
                        onClick={() => handleRerun(execution)}
                        className="text-primary hover:text-secondary transition-colors no-underline"
                        title="הרץ שוב"
                      >
                        <RefreshCw size={20} />
                      </button>
                    )}
                    {currentUser.role === 'admin' && execution.status === 'pending_approval' && (
                      <>
                        <button
                          onClick={() => onApproval(execution.id, true)}
                          className="text-success hover:text-opacity-80 transition-colors no-underline"
                          title="אשר"
                        >
                          <Check size={20} />
                        </button>
                        <button
                          onClick={() => {
                            setExecutionToReject(execution.id);
                            setShowRejectionDialog(true);
                          }}
                          className="text-error hover:text-opacity-80 transition-colors no-underline"
                          title="דחה"
                        >
                          <X size={20} />
                        </button>
                      </>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Rejection Dialog */}
      {showRejectionDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[9999]">
          <div className="bg-background p-4 rounded-lg shadow-lg max-w-md w-full">
            <h3 className="text-lg font-bold mb-4">סיבת דחייה</h3>
            <textarea
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              className="w-full p-2 border rounded mb-4 min-h-[100px]"
              placeholder="הזן את סיבת הדחייה..."
            />
            <div className="flex justify-end space-x-2 rtl:space-x-reverse">
              <button
                onClick={() => {
                  setShowRejectionDialog(false);
                  setRejectionReason('');
                  setExecutionToReject(null);
                }}
                className="px-4 py-2 bg-border text-text rounded hover:bg-opacity-80"
              >
                ביטול
              </button>
              <button
                onClick={handleReject}
                className="px-4 py-2 bg-error text-background rounded hover:bg-opacity-80"
                disabled={!rejectionReason.trim()}
              >
                דחה
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Rerun Confirmation Dialog */}
      <ConfirmationDialog
        isOpen={showRerunConfirmation}
        title="אישור הרצה חוזרת"
        message="האם אתה בטוח שברצונך להריץ מחדש את הסקריפט הזה?"
        onConfirm={confirmRerun}
        onCancel={() => {
          setShowRerunConfirmation(false);
          setExecutionToRerun(null);
        }}
      />
    </div>
  );
};

export default ScriptDashboard;