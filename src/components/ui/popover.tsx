import * as PopoverPrimitive from "@radix-ui/react-popover";
import clsx from "clsx";
import { X } from "lucide-react"

type PopoverProps = {
  trigger: React.ReactNode;
  children: React.ReactNode;
  className?: string;
  side?: "top" | "right" | "bottom" | "left";
  align?: "start" | "center" | "end";
  sideOffset?: number;
};

export const Popover = ({
  trigger,
  children,
  className,
  side = "top",
  align = "center",
  sideOffset = 8,
}: PopoverProps) => {
  return (
    <PopoverPrimitive.Root>
      <PopoverPrimitive.Trigger asChild>
        {trigger}
      </PopoverPrimitive.Trigger>
      <PopoverPrimitive.Portal>
        <PopoverPrimitive.Content
          side={side}
          align={align}
          sideOffset={sideOffset}
          className={clsx(
            "z-50 rounded-md bg-white p-2 shadow-lg border relative dark:bg-background",
            "animate-in fade-in zoom-in-95",
            className
          )}
        >
          {children}
          <PopoverPrimitive.Close className="absolute top-3 right-3 p-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-white/10" aria-label="Close">
            <X size={15} />
          </PopoverPrimitive.Close>
        </PopoverPrimitive.Content>
      </PopoverPrimitive.Portal>
    </PopoverPrimitive.Root>
  );
};
