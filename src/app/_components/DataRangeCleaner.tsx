import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { useGlobalProvider } from "./GlobalProvider";

export function DataRangeCleaner() {
  const { date, setDate } = useGlobalProvider();
  return (
    <Button
      variant="destructive"
      className="h-10"
      disabled={!date}
      onClick={() => setDate(undefined)}
    >
      <X className="h-4 w-4" />
    </Button>
  );
}
