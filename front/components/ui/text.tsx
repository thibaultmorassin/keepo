import { cn } from "@/lib/utils";
import * as Slot from "@rn-primitives/slot";
import * as React from "react";
import { Text as RNText } from "react-native";

const TextClassContext = React.createContext<string | undefined>(undefined);

const Text = React.forwardRef<
  RNText,
  React.ComponentProps<typeof RNText> & {
    asChild?: boolean;
  }
>(({ className, asChild = false, ...props }, ref) => {
  const textClass = React.useContext(TextClassContext);
  const Component = asChild ? Slot.Text : RNText;
  return (
    <Component
      className={cn(
        "text-base text-foreground web:select-text",
        textClass,
        className,
      )}
      {...props}
      ref={ref}
    />
  );
});
Text.displayName = "Text";

export { Text, TextClassContext };
