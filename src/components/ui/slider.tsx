import * as SliderPrimitive from "@radix-ui/react-slider";
import * as React from "react";
import { cn } from "@/lib/utils";

// Replace `Slider` component in `@components/ui/slider.tsx` with the following code to customize the appearance of the slider.
// Dodaj 'export' tutaj
export const Slider = React.forwardRef<
  // <-- TUTAJ DODANO 'export'
  React.ElementRef<typeof SliderPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof SliderPrimitive.Root> & {
    trackClassName?: string;
    rangeClassName?: string;
    thumbClassName?: string;
  }
>(
  (
    { className, trackClassName, rangeClassName, thumbClassName, ...props },
    ref,
  ) => (
    <SliderPrimitive.Root
      ref={ref}
      className={cn(
        "relative flex w-full touch-none items-center select-none",
        className,
      )}
      {...props}
    >
      <SliderPrimitive.Track
        className={cn(
          "bg-primary/20 relative h-1.5 w-full grow overflow-hidden rounded-full",
          trackClassName,
        )}
      >
        <SliderPrimitive.Range
          className={cn("bg-primary absolute h-full", rangeClassName)}
        />
      </SliderPrimitive.Track>
      <SliderPrimitive.Thumb
        className={cn(
          "border-primary/50 bg-background focus-visible:ring-ring block h-4 w-4 rounded-full border shadow transition-colors focus-visible:ring-1 focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50",
          thumbClassName,
        )}
      />
    </SliderPrimitive.Root>
  ),
);
Slider.displayName = SliderPrimitive.Root.displayName;
