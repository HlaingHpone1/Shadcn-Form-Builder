import { FieldTypeEnum } from "@/constants";

const defaultValuesGenerator = (fields: FormField[]) => {
  return fields
      .map((f) => {
        if (f.type === FieldTypeEnum.CHECKBOX) {
          return `    ${f.name}: []`;
        }

        if (f.type === FieldTypeEnum.SELECT) {
          return `    ${f.name}: undefined`;
        }

        if (f.type === FieldTypeEnum.NUMBER) {
          return `    ${f.name}: undefined`;
        }

        return `    ${f.name}: ""`;
      })
      .join(",\n");
};

export default defaultValuesGenerator