export const PASSWORD_RULES = {
  uppercase: {
    id: "uppercase",
    label: "Require Uppercase (A-Z)",
    regex: /[A-Z]/,
    message: "Uppercase is required",
  },
  number: {
    id: "number",
    label: "Require Number (0-9)",
    regex: /\d/,
    message: "Number is required",
  },
  special: {
    id: "special",
    label: "Require Special Char (@$!%*?&)",
    regex: /[@$!%*?&]/,
    message: "Special character is required",
  },
  lowercase: {
    id: "lowercase",
    label: "Require Lowercase (a-z)",
    regex: /[a-z]/,
    message: "Lowercase is required",
  },
};

export type PasswordRuleKey = keyof typeof PASSWORD_RULES;

export const componentList: ComponentItem[] = [
  {
    type: "TEXT",
    label: "Text Box",
    formType: "text",
  },
  {
    type: "TEXTAREA",
    label: "Textarea",
    formType: "text",
  },
  {
    type: "SELECT",
    label: "Select",
    formType: "text",
  },
  {
    type: "CHECKBOX",
    label: "Checkbox",
    formType: "checkbox",
  },
  {
    type: "DATEPICKER",
    label: "Datepicker",
    formType: "text",
  },
  {
    type: "COMBOBOX",
    label: "Combobox",
    formType: "text",
  },
  {
    type: "RADIO",
    label: "Radio",
    formType: "text",
  },
];

export enum FieldTypeEnum {
  TEXT = "TEXT",
  TEXTAREA = "TEXTAREA",
  CHECKBOX = "CHECKBOX",
  SELECT = "SELECT",
  RADIO = "RADIO",
  DATEPICKER = "DATEPICKER",
  COMBOBOX = "COMBOBOX",
  NUMBER = "NUMBER",
}