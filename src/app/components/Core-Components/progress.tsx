import * as React from "react";
import * as ProgressPrimitive from "@radix-ui/react-progress";
import { cn } from "../../lib/utils";

const Progress = React.forwardRef<
  React.ElementRef<typeof ProgressPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof ProgressPrimitive.Root> & { value?: number }
>(({ className, value = 0, ...props }, ref) => {
  // Calculate color based on value (0% green, 100% red)
  const clampedValue = Math.min(100, value);
  const red = Math.min(255, Math.round((255 * clampedValue) / 100));
  const green = Math.min(255, Math.round((255 * (100 - clampedValue)) / 100));
  const progressBarColor = value > 100 ? "rgb(255, 0, 0)" : `rgb(${red}, ${green}, 0)`;

  return (
    <ProgressPrimitive.Root
      ref={ref}
      className={cn("relative h-4 w-full rounded-full bg-gray-800 overflow-hidden", className)}
      {...props}
    >
      <ProgressPrimitive.Indicator
        className="h-full flex-1 transition-all duration-300 ease-in-out"
        style={{
          transform: `translateX(-${100 - clampedValue}%)`,
          backgroundColor: progressBarColor,
        }}
      />
    </ProgressPrimitive.Root>
  );
});

Progress.displayName = ProgressPrimitive.Root.displayName;

export { Progress };
