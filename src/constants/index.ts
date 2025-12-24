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
