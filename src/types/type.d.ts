type FieldType =
  | "TEXT"
  | "TEXTAREA"
  | "CHECKBOX"
  | "SELECT"
  | "RADIO"
  | "DATEPICKER"
  | "COMBOBOX"
  | "NUMBER";

interface FormField {
  id: string;
  name: string;
  label: string;
  type: FieldType;
  required: boolean;
  formType?: HTMLInputTypeAttribute;
  validation?: ValidationRules;
}

type ValidationRules = {
  min?: number;
  max?: number;
  patterns?: string[];
  isEmail?: boolean;
};

interface ComponentItem {
  type: FieldType;
  label: string;
  formType: HTMLInputTypeAttribute;
}

interface ComponentInfo {
  functionName: string;
  schemaName: string;
  schemaType: string;
}
