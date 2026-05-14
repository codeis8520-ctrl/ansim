import { forwardRef, type HTMLAttributes } from "react";
import { cn } from "@/lib/cn";

export type ContainerProps = HTMLAttributes<HTMLDivElement>;

const Container = forwardRef<HTMLDivElement, ContainerProps>(
  function Container({ className, children, ...rest }, ref) {
    return (
      <div
        ref={ref}
        className={cn(
          "mx-auto w-full max-w-[1100px] px-6 sm:px-8 lg:px-12",
          className
        )}
        {...rest}
      >
        {children}
      </div>
    );
  }
);

export default Container;
