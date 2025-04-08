"use client";

import type * as React from "react";
import { CalendarIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format } from "@formkit/tempo";
import { useGlobalProvider } from "./GlobalProvider";

export function DataRangePicker({
  className,
}: React.HTMLAttributes<HTMLDivElement>) {
  const { date, setDate } = useGlobalProvider();

  return (
    <div className={cn("grid gap-2", className)}>
      <Popover>
        <PopoverTrigger asChild>
          <div className="group relative inline-block overflow-hidden rounded-xl border border-slate-800/40 bg-black/40 backdrop-blur-md transition-all duration-300 hover:border-cyan-900/50 hover:shadow-lg hover:shadow-cyan-500/10">
            <div className="absolute inset-0 -z-10 bg-gradient-to-r from-cyan-500/5 via-purple-500/5 to-blue-500/5 opacity-0 blur-xl transition-all duration-500 group-hover:opacity-100" />
            <Button
              variant="secondary"
              id="date"
              className={cn(
                "relative flex h-10 w-[250px] items-center justify-start gap-3 px-4",
                "bg-transparent text-base font-medium text-slate-200 transition-colors duration-300",
                "hover:bg-black/30 focus:bg-black/30 active:bg-black/30",
                !date && "text-muted-foreground",
              )}
            >
              <div className="relative flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-slate-800/70">
                <CalendarIcon className="h-4 w-4 text-cyan-400" />
                <div className="absolute inset-0 -z-10 rounded-full bg-gradient-to-r from-cyan-500/20 to-blue-500/20 opacity-0 blur-sm transition-all duration-300 group-hover:opacity-100" />
              </div>

              <span
                className={cn(
                  "text-sm font-medium transition-colors duration-300",
                  date?.from
                    ? "bg-gradient-to-r from-cyan-300 to-blue-300 bg-clip-text text-transparent"
                    : "text-slate-300",
                )}
              >
                {date?.from ? (
                  date.to ? (
                    <>
                      {format(date.from, { date: "medium" })} –{" "}
                      {format(date.to, { date: "medium" })}
                    </>
                  ) : (
                    format(date.from, { date: "medium" })
                  )
                ) : (
                  <span>Choose date range</span>
                )}
              </span>
            </Button>
          </div>
        </PopoverTrigger>

        <PopoverContent
          className="relative w-auto overflow-hidden rounded-xl border border-slate-800/40 bg-black/80 p-3 text-slate-300 shadow-lg shadow-black/40 backdrop-blur-xl"
          align="start"
        >
          <div className="absolute inset-0 -z-10 bg-gradient-to-r from-cyan-500/5 via-purple-500/5 to-blue-500/5 opacity-30 blur-xl" />
          <Calendar
            initialFocus
            mode="range"
            defaultMonth={date?.from}
            selected={date}
            onSelect={setDate}
            numberOfMonths={2}
            classNames={{
              months: "space-y-4",
              month: "space-y-4",
              caption: "flex justify-center pt-1 relative items-center",
              caption_label: "text-sm font-medium text-slate-200",
              nav: "space-x-1 flex items-center",
              nav_button:
                "h-7 w-7 bg-slate-800/70 rounded-full hover:bg-slate-700/90 transition-colors duration-200 inline-flex justify-center items-center text-slate-300 hover:text-white",
              nav_button_previous: "absolute left-1",
              nav_button_next: "absolute right-1",
              table: "w-full border-collapse space-y-1",
              head_row: "flex",
              head_cell:
                "text-slate-400 rounded-md w-9 font-normal text-[0.8rem]",
              row: "flex w-full mt-2",
              cell: "h-9 w-9 text-center text-sm relative p-0 focus-within:relative focus-within:z-20 [&:has([aria-selected])]:bg-slate-800/30 rounded-md",
              day: "h-9 w-9 p-0 flex items-center justify-center rounded-md text-sm transition-colors duration-200 hover:bg-slate-800/70 aria-selected:opacity-100",
              day_range_start:
                "bg-gradient-to-r from-cyan-600 to-blue-600 text-white hover:bg-none",
              day_range_end:
                "bg-gradient-to-r from-cyan-600 to-blue-600 text-white hover:bg-none",
              day_range_middle:
                "bg-slate-800/70 text-slate-200 hover:bg-slate-700/90 hover:text-white",
              day_selected:
                "bg-gradient-to-r from-cyan-600 to-blue-600 text-white hover:bg-none",
              day_today:
                "ring-2 ring-cyan-500/50 ring-offset-1 ring-offset-black",
              day_outside: "text-slate-500 opacity-50",
              day_disabled: "text-slate-500 opacity-50",
              day_hidden: "invisible",
            }}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}
