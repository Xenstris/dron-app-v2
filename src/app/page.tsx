"use client";

import { DataRangeCleaner } from "./_components/DataRangeCleaner";
import { DataRangePicker } from "./_components/DataRangePicker";
import LocationsTable from "./_components/LocationsTable";

export default function Page() {
  return (
    <main className="mx-auto w-full max-w-7xl space-y-2 p-4">
      <div className="flex flex-row gap-2">
        <DataRangePicker />
        <DataRangeCleaner />
      </div>
      <LocationsTable />
    </main>
  );
}
