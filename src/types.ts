import { ReactNode } from 'react';

export interface Script {
  id: string;
  name: string;
  description: string;
  type: string;
  tags: string[]; // Add this line
  sections: ScriptSection[];
}

// ... rest of the file remains unchanged