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

        case FieldTypeEnum.COMBOBOX:
          const comboboxType = f.styleType ?? "base-ui";
          const isRadix = comboboxType === "radix-ui";

          if (f.isMulti) {
            return `
                    <FormField
          control={form.control}
          name="${f.name}"
          render={({ field }) => {
            const selectedItems = data.filter((item) =>
              field.value?.includes(item.id.toString()),
            );

            return (
              <FormItem className="flex flex-col">
               <FormLabel>${f.label}
      ${f.required ? ` <span className="text-red-500">*</span>` : ""}
      </FormLabel>
                <FormControl>
                  <div ref={anchorRef} className="w-full">
                    <Combobox
                      items={data}
                      multiple
                      autoHighlight
                      itemToStringLabel={(item) => item.name}
                      onValueChange={(selectedObjects: Item[]) => {
                        const ids = selectedObjects.map((obj) =>
                          obj.id.toString(),
                        );
                        field.onChange(ids);
                      }}
                    >
                      <ComboboxChips className="flex flex-wrap gap-2 p-2 w-full border rounded-md">
                        <ComboboxValue>
                          {selectedItems.map((item) => (
                            <ComboboxChip key={item.id} className="max-w-fit">
                              {item.name}
                            </ComboboxChip>
                          ))}
                        </ComboboxValue>
                        <ComboboxChipsInput className="flex-1 min-w-30" placeholder="${f.label}..." />
                      </ComboboxChips>
                      <ComboboxContent anchor={anchorRef} align="start">
                        <ComboboxEmpty>No items found.</ComboboxEmpty>
                        <ComboboxList>
                          {(item) => (
                            <ComboboxItem key={item.id} value={item}>
                              {item.name}
                            </ComboboxItem>
                          )}
                        </ComboboxList>
                      </ComboboxContent>
                    </Combobox>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            );
          }}
        />
            `;
          }
          if (isRadix) {
            return `
          <FormField
  control={form.control}
  name="${f.name}"
  render={({ field }) => {
    const selectedItem = data.find((item) => item.id.toString() === field.value);

    return (
      <FormItem className="flex flex-col">
        <FormLabel>${f.label}
        ${f.required ? ` <span className="text-red-500">*</span>` : ""}
        </FormLabel>
        <Popover modal>
          <PopoverTrigger asChild>
            <FormControl>
              <Button
                variant="outline"
                role="combobox"
                type="button"
                className={cn(
                  'h-9 w-full justify-between truncate',
                  !field.value && 'text-muted-foreground'
                )}
              >
                {field.value
                  ? selectedItem?.name
                  : "${f.label}"}
                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
              </Button>
            </FormControl>
          </PopoverTrigger>
          <PopoverContent className="w-(--radix-popover-trigger-width) p-0">
            <Command>
              <CommandInput
                placeholder="Search..."
              />
              <CommandList>
                <CommandEmpty>No items found.</CommandEmpty>
                <CommandGroup>
                  {data.map((item) => (
                    <CommandItem
                      value={item.id.toString()}
                      key={item.id}
                      onSelect={() => {
                        if (item.id.toString() === field.value) {
                          field.onChange(undefined);
                        } else {
                          field.onChange(item.id.toString());
                        }
                      }}
                    >
                      <Check
                        className={cn(
                          'mr-2 h-4 w-4',
                          item.id.toString() === field.value
                            ? 'opacity-100'
                            : 'opacity-0'
                        )}
                      />
                      {item.name}
                    </CommandItem>
                  ))}
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>
        <FormMessage />
      </FormItem>
    );
  }}
/>
          `;
          }

          return `
          <FormField
  control={form.control}
  name="${f.name}"
  render={({ field }) => (
    <FormItem className="flex flex-col">
      <FormLabel>${f.label}
      ${f.required ? ` <span className="text-red-500">*</span>` : ""}
      </FormLabel>
      
      <FormControl>
        <Combobox
          items={data}
          itemToStringValue={(data) => data.id.toString()}
          itemToStringLabel={(data: Item) => data.name}
          onValueChange={(value) =>
            field.onChange(value ? value.id.toString() : undefined)
          }>
              <ComboboxInput
                placeholder="${f.label}"
                ref={field.ref}
                showClear
              />
              <ComboboxContent>
                <ComboboxEmpty>No items found.</ComboboxEmpty>
                <ComboboxList>
                  {(item) => (
                    <ComboboxItem key={item.id} value={item}>
                      {item.name}
                    </ComboboxItem>
                  )}
                </ComboboxList>
              </ComboboxContent>
        </Combobox>
      </FormControl>
      
      <FormMessage />
    </FormItem>
  )}
/>
          `;

        default:
          return "";
      }
    })
    .join("\n");
};

export default fieldGenerator;
