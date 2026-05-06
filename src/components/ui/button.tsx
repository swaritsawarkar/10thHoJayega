import {
  cloneElement,
  isValidElement,
  type ButtonHTMLAttributes,
  type ReactElement,
  type ReactNode,
} from "react";
import type { VariantProps } from "class-variance-authority";

import { buttonVariants } from "@/components/ui/button-variants";
import { cn } from "@/lib/utils";

type RenderElement = ReactElement<{
  children?: ReactNode;
  className?: string;
}>;

function Button({
  className,
  variant = "default",
  size = "default",
  render,
  nativeButton,
  children,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> &
  VariantProps<typeof buttonVariants> & {
    nativeButton?: boolean;
    render?: RenderElement;
  }) {
  const buttonClassName = cn(
    buttonVariants({ variant, size, className }),
    nativeButton === false && "",
  );

  if (render && isValidElement(render)) {
    return cloneElement(render, {
      ...props,
      className: cn(render.props.className, buttonClassName),
      children,
    });
  }

  return (
    <button data-slot="button" className={buttonClassName} {...props}>
      {children}
    </button>
  );
}

export { Button, buttonVariants };
