export interface Script {
  id: string;
  name: string;
  description: string;
  type: string;
  tags: string[];
  sections: ScriptSection[];
}

export interface ScriptSection {
  id: string;
  title: string;
  inputs: ScriptInput[];
  validate?: (sectionInputs: Record<string, string>) => string | null;
}

export interface ScriptInput {
  name: string;
  type: string;
  required: boolean;
  label: string;
  options?: string[];
  validation?: RegExp;
  isArray?: boolean;
  isTable?: boolean;
  columns?: TableColumn[];
  validateRow?: (row: Record<string, string>) => string | null;
}

export interface TableColumn {
  key: string;
  label: string;
  type: "text" | "number" | "select";
  options?: string[];
  required?: boolean;
}

export interface User {
  id: string;
  name: string;
  role: "admin" | "user";
  permissions: string[];
}

export interface ScriptExecution {
  id: string;
  scriptId: string;
  scriptName: string;
  status:
    | "pending_approval"
    | "about to run"
    | "running"
    | "completed"
    | "rejected"
    | "failed";
  startTime: Date;
  endTime?: Date;
  requestedBy: string;
  approvedBy?: string;
  rejectedBy?: string;
  rejectionReason?: string;
  scriptType: string;
  executionName: string;
  result?: string;
  inputs?: Record<string, any>;
}
