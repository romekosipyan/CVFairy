"use client";

import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

import { TextField } from "./TextField";

import type { ReactElement } from "react";

interface DateRangePickerProps {
  id: string;
  startDate: string;
  endDate: string;
  onStartChange: (value: string) => void;
  onEndChange: (value: string) => void;
  current?: boolean;
  onCurrentChange?: (current: boolean) => void;
}

export function DateRangePicker({
  id,
  startDate,
  endDate,
  onStartChange,
  onEndChange,
  current,
  onCurrentChange,
}: DateRangePickerProps): ReactElement {
  const currentId = `${id}-current`;

  return (
    <div className="flex flex-col gap-3">
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <TextField
          id={`${id}-start`}
          label="Start date"
          type="month"
          value={startDate}
          onChange={onStartChange}
        />
        <TextField
          id={`${id}-end`}
          label="End date"
          type="month"
          value={endDate}
          onChange={onEndChange}
          disabled={Boolean(current)}
        />
      </div>
      {onCurrentChange ? (
        <div className="flex items-center gap-2">
          <Checkbox
            id={currentId}
            checked={Boolean(current)}
            onCheckedChange={(checked) => {
              onCurrentChange(checked === true);
            }}
          />
          <Label htmlFor={currentId} className="font-normal">
            Currently work here
          </Label>
        </div>
      ) : null}
    </div>
  );
}
