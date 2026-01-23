import { FieldTypeEnum } from "@/constants";

const fieldGenerator = (fields: FormField[]): string => {
  return fields
    .map((f) => {
      switch (f.type) {
        case FieldTypeEnum.CHECKBOX:
          return `
              <FormField
                  control={form.control}
                  name="${f.name}"
                  render={({field}) => (
                    <FormItem>
                    <FormLabel>${f.label} ${
                      f.required
                        ? ` <span className="text-red-500">*</span>`
                        : ""
                    } </FormLabel>
                      {data
                        .map((item) =>
                          <div key={item.id} className="flex items-center gap-2">
                          <FormControl>
                            <Checkbox
                              id="checkbox-{item.id}"
                              checked={field.value${
                                f.required ? "" : "?"
                              }.includes(item.id)}
                              onCheckedChange={(checked) =>
                                field.onChange(
                                  checked
                                    ? [${
                                      f.required
                                        ? "...field.value"
                                        : "...(field?.value ?? [])"
                                    }, item.id]
                                    : field.value${
                                      f.required ? "" : "?"
                                    }.filter((id: number) => id !== item.id)
                                )
                              } />
                          </FormControl>
                          <label
                            htmlFor="checkbox-{item.id}"
                            className="cursor-pointer"
                          >
                            {item.name}
                          </label>
                        </div>
                        )}
                      <FormMessage />
                    </FormItem>
                )}
              />
            `;

        case FieldTypeEnum.TEXTAREA:
          return `
              <FormField
                      control={form.control}
                      name="${f.name}"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>${f.label} ${
                            f.required
                              ? ` <span className="text-red-500">*</span>`
                              : ""
                          } </FormLabel>
                          <FormControl>
                            <Textarea placeholder="${
                              f.label
                            }..."  className="resize-none" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
            `;

        case FieldTypeEnum.TEXT:
          switch (f.formType) {
            case "password":
              return `
                <FormField
                  control={form.control}
                  name="${f.name}"
                  render={({ field }) => (
                    <FormItem className="gap-3">
                      <FormLabel>
                        ${f.label}${
                          f.required
                            ? ` <span className="text-red-500">*</span>`
                            : ""
                        }
                      </FormLabel>
                      <FormControl>
                        <PasswordInput
                          autoComplete="off"
                          placeholder="${f.label}..."
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />`;
          }

          return `
                <FormField
                  control={form.control}
                  name="${f.name}"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>${f.label} ${
                        f.required
                          ? ` <span className="text-red-500">*</span>`
                          : ""
                      } </FormLabel>
                      <FormControl>
                        <Input placeholder="${f.label}..."
                          type="${f.formType ?? "text"}"
                        {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />`;

        case FieldTypeEnum.SELECT:
          return `
            <FormField
              control={form.control}
              name="${f.name}"
              render={({ field }) => (
                <FormItem>
                    <FormLabel>${f.label} ${
                      f.required
                        ? ` <span className="text-red-500">*</span>`
                        : ""
                    } </FormLabel>
                  <Select
                    onValueChange={(value) =>
                      field.onChange(value ? Number(value) : undefined)
                    }
                    defaultValue={field.value?.toString()}
                    value={field.value?.toString()}
                  >
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="${f.label}..." />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent align="start" position="popper">
                      {data.map((item) => (
                        <SelectItem
                          value={item.id.toString()}
                          key={item.id}
                        >
                          {item.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          `;

        case FieldTypeEnum.DATEPICKER:
          return `
          <FormField
          control={form.control}
          name="${f.name}"
          render={({ field }) => {
            const { value, onChange, ...rest } = field;
            return (
              <FormItem className="flex flex-col">
                <FormLabel>${f.label} ${
                  f.required ? ` <span className="text-red-500">*</span>` : ""
                } </FormLabel>
                <FormControl>
                  <DatePickerInput
                    value={value ? new Date(value) : undefined}
                    onChange={(date) => onChange(date ? date.toISOString() : undefined)}
                    {...rest}
                    placeholder="${f.label}..."
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            );
          }}
        />
          `;

        default:
          return "";
      }
    })
    .join("\n");
};

export default fieldGenerator;
