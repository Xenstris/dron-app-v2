"use client";

import { DataRangeCleaner } from "./_components/DataRangeCleaner";
import { DataRangePicker } from "./_components/DataRangePicker";
import LocationsTable from "./_components/LocationsTable";

export default function Page() {
  return (
    <main className="max-w-7x1 mx-auto w-full gap-4 space-y-6 p-3">
      <div className="flex flex-row gap-4">
        <DataRangePicker />
        <DataRangeCleaner />
      </div>
      <LocationsTable />
    </main>
  );
}
