import React, { useState, useMemo } from 'react';
import { ScriptExecution, User } from '../types';
import { Download, Search, ChevronDown, ChevronUp } from 'lucide-react';
import { useTheme } from '../ThemeContext';

interface ScriptDashboardProps {
  executions: ScriptExecution[];
  onDownload: (execution: ScriptExecution) => void;
  currentUser: User;
}

const ScriptDashboard: React.FC<ScriptDashboardProps> = ({ executions, onDownload, currentUser }) => {
  const { theme } = useTheme();
  const [filters, setFilters] = useState({
    scriptName: '',
    startTime: '',
    endTime: '',
    scriptType: '',
    requestedBy: '',
    approvedBy: '',
    id: '',
  });
  const [showFilters, setShowFilters] = useState(false);

  const filteredExecutions = useMemo(() => {
    return executions.filter((execution) => {
      const matchScriptName = execution.scriptName.toLowerCase().includes(filters.scriptName.toLowerCase());
      const matchStartTime = !filters.startTime || new Date(execution.startTime) >= new Date(filters.startTime);
      const matchEndTime = !filters.endTime || (execution.endTime && new Date(execution.endTime) <= new Date(filters.endTime));
      const matchScriptType = execution.scriptType.toLowerCase().includes(filters.scriptType.toLowerCase());
      const matchRequestedBy = execution.requestedBy.toLowerCase().includes(filters.requestedBy.toLowerCase());
      const matchApprovedBy = execution.approvedBy?.toLowerCase().includes(filters.approvedBy.toLowerCase()) ?? false;
      const matchId = execution.id.includes(filters.id);

      return matchScriptName && matchStartTime && matchEndTime && matchScriptType && matchRequestedBy && matchApprovedBy && matchId;
    });
  }, [executions, filters]);

  const handleFilterChange = (key: string, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const getStatusColor = (status: ScriptExecution['status']) => {
    switch (status) {
      case 'about to run':
        return 'bg-warning text-background';
      case 'running':
        return 'bg-info text-background';
      case 'completed':
        return 'bg-success text-background';
      case 'failed':
        return 'bg-error text-background';
      default:
        return 'bg-border text-text';
    }
  };

  return (
    <div className="bg-background p-4 rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-4 text-text">לוח בקרת סקריפטים</h2>
      <button
        onClick={() => setShowFilters(!showFilters)}
        className="mb-4 bg-primary text-background px-4 py-2 rounded hover:bg-opacity-90 transition-colors"
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
        </div>
      )}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-primary text-background">
              <th className="p-2">מזהה</th>
              <th className="p-2">שם הסקריפט</th>
              <th className="p-2">סטטוס</th>
              <th className="p-2">זמן התחלה</th>
              <th className="p-2">זמן סיום</th>
              <th className="p-2">פעולות</th>
            </tr>
          </thead>
          <tbody>
            {filteredExecutions.map((execution) => (
              <tr key={execution.id} className="border-b border-border">
                <td className="p-2">{execution.id}</td>
                <td className="p-2">{execution.scriptName}</td>
                <td className="p-2">
                  <span className={`px-2 py-1 rounded ${getStatusColor(execution.status)}`}>
                    {execution.status}
                  </span>
                </td>
                <td className="p-2">{new Date(execution.startTime).toLocaleString()}</td>
                <td className="p-2">{execution.endTime ? new Date(execution.endTime).toLocaleString() : '-'}</td>
                <td className="p-2">
                  {execution.status === 'completed' && (
                    <button
                      onClick={() => onDownload(execution)}
                      className="text-primary hover:text-secondary transition-colors"
                    >
                      <Download size={20} className="rtl-mirror" />
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ScriptDashboard;