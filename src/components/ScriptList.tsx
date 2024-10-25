import React, { useState } from 'react';
import { Script } from '../types';
import { Search } from 'lucide-react';
import { useTheme } from '../ThemeContext';
import { useAppContext } from '../AppContext';

interface ScriptListProps {
  onSelectScript: (script: Script) => void;
}

const ScriptList: React.FC<ScriptListProps> = ({ onSelectScript }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const { theme } = useTheme();
  const { scripts } = useAppContext();

  const filteredScripts = scripts.filter(script => 
    script.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    script.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="bg-background p-4 rounded-lg shadow-md border border-accent1">
      <h2 className="text-xl font-bold mb-4 text-primary">סקריפטים זמינים</h2>
      <div className="mb-4 relative">
        <input
          type="text"
          placeholder="חיפוש סקריפטים..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full p-2 pr-10 border border-primary rounded focus:ring-2 focus:ring-secondary bg-hoverBackground text-text"
        />
        <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-accent3" />
      </div>
      <ul>
        {filteredScripts.map((script) => (
          <li key={script.id} className="mb-2">
            <button
              onClick={() => onSelectScript(script)}
              className="w-full text-right p-2 rounded hover:bg-hoverBackground transition-colors border border-accent3"
            >
              <span className="font-semibold text-primary">{script.name}</span>
              <p className="text-sm text-text opacity-70">{script.description}</p>
              <div className="mt-1">
                {script.tags.map((tag, index) => (
                  <span key={index} className="inline-block bg-accent3 text-background text-xs px-2 py-1 rounded mr-1 mb-1">
                    {tag}
                  </span>
                ))}
              </div>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ScriptList;