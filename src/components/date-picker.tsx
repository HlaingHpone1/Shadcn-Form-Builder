"use client";

import { useState, useEffect, forwardRef, InputHTMLAttributes } from "react";
import { CalendarIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/utils";

// Helper functions (kept from your code)
function formatDate(date: Date | undefined) {
  if (!date) return "";
  return date.toLocaleDateString("en-US", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

function isValidDate(date: Date | undefined) {
  if (!date) return false;
  return !isNaN(date.getTime());
}

interface DatePickerInputProps extends Omit<
  InputHTMLAttributes<HTMLInputElement>,
  "value" | "onChange"
> {
  value?: Date;
  onChange: (date: Date | undefined) => void;
  disabled?: boolean;
}
export const DatePickerInput = forwardRef<
  HTMLInputElement,
  DatePickerInputProps
>(({ value, onChange, className, disabled, ...props }, ref) => {
  const [open, setOpen] = useState(false);

  const [inputValue, setInputValue] = useState("");

  const [month, setMonth] = useState<Date | undefined>(value || new Date());

  useEffect(() => {
    if (value) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setInputValue(formatDate(value));
      setMonth(value);
    } else {
      setInputValue("");
    }
  }, [value]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newText = e.target.value;
    setInputValue(newText);

    const parsedDate = new Date(newText);

    if (isValidDate(parsedDate)) {
      onChange(parsedDate);
      setMonth(parsedDate);
    } else if (newText === "") {
      onChange(undefined);
    }
  };

  const handleCalendarSelect = (selectedDate: Date | undefined) => {
    onChange(selectedDate);
    setInputValue(formatDate(selectedDate));
    setOpen(false);
  };

  return (
    <div className={cn("relative flex  items-center gap-2 w-full", className)}>
      <Input
        ref={ref}
        id="date"
        type="text"
        value={inputValue}
        className="pr-10 w-full"
        onChange={handleInputChange}
        disabled={disabled}
        autoComplete="off"
        onKeyDown={(e) => {
          if (e.key === "ArrowDown") {
            e.preventDefault();
            setOpen(true);
          }
        }}
        {...props}
      />
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7 text-muted-foreground"
            disabled={disabled}
          >
            <CalendarIcon className="size-4" />
            <span className="sr-only">Pick a date</span>
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="end">
          <Calendar
            mode="single"
            selected={value}
            month={month}
            onMonthChange={setMonth}
            onSelect={handleCalendarSelect}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
});

DatePickerInput.displayName = "DatePickerInput";
