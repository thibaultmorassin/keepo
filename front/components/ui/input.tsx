import { cn } from "@/lib/utils";
import * as React from "react";
import { TextInput, type TextInputProps } from "react-native";
import { View } from "react-native";
import { Button } from "@/components/ui/button";
import Feather from "@expo/vector-icons/Feather";

const Input = React.forwardRef<TextInput, TextInputProps>(
  ({ className, placeholderClassName, ...props }, ref) => {
    const [isVisible, setIsVisible] = React.useState(false);

    if (props.secureTextEntry) {
      return (
        <View className="relative">
          <TextInput
            className={cn(
              "web:flex h-10 native:h-12 web:w-full rounded-xl border border-accent bg-accent px-3 web:py-2 text-base lg:text-sm native:text-lg native:leading-[1.25] text-foreground placeholder:text-muted-foreground web:ring-offset-background file:border-0 file:bg-transparent file:font-medium web:focus-visible:outline-none web:focus-visible:ring-2 web:focus-visible:ring-ring web:focus-visible:ring-offset-2",
              props.editable === false && "opacity-50 web:cursor-not-allowed",
              className,
            )}
            placeholderClassName={cn(
              "text-muted-foreground",
              placeholderClassName,
            )}
            ref={ref}
            {...props}
            secureTextEntry={!isVisible}
          />
          <Button
            className="absolute right-2 bottom-1"
            onPress={() => setIsVisible(!isVisible)}
            variant="ghost"
            size="icon"
          >
            {isVisible ? (
              <Feather name="eye-off" size={18} color="black" />
            ) : (
              <Feather name="eye" size={18} color="black" />
            )}
          </Button>
        </View>
      );
    }

    return (
      <TextInput
        className={cn(
          "web:flex h-10 native:h-12 web:w-full rounded-xl border border-accent bg-accent px-3 web:py-2 text-base lg:text-sm native:text-lg native:leading-[1.25] text-foreground placeholder:text-muted-foreground web:ring-offset-background file:border-0 file:bg-transparent file:font-medium web:focus-visible:outline-none web:focus-visible:ring-2 web:focus-visible:ring-ring web:focus-visible:ring-offset-2",
          props.editable === false && "opacity-50 web:cursor-not-allowed",
          className,
        )}
        placeholderClassName={cn("text-muted-foreground", placeholderClassName)}
        ref={ref}
        {...props}
      />
    );
  },
);
Input.displayName = "Input";

export { Input };
