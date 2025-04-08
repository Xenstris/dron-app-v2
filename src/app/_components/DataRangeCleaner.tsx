import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { useGlobalProvider } from "./GlobalProvider";

export function DataRangeCleaner() {
  const { date, setDate } = useGlobalProvider();
  return (
    <Button
      className="h-10 border-2 border-red-600/40 bg-black/40 text-red-400 backdrop-blur-md transition-colors focus:border-red-600 focus:ring-red-600/30"
      disabled={!date}
      onClick={() => setDate(undefined)}
    >
      <X className="h-4 w-4" />
    </Button>
  );
}
