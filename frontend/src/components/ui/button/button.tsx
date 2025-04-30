"use client";

import Link from "next/link";
import clsx from "clsx";

type ButtonProps = {
  href: string;
  children: React.ReactNode;
  variant?: "default" | "primary";
  rounded?: "none" | "sm" | "md" | "lg" | "xl" | "full";
  className?: string;
};

const Button = ({
  href,
  children,
  variant = "default",
  rounded = "md",
  className,
}: ButtonProps) => {
  const baseStyles = "text-base font-medium transition duration-300 px-6 py-3";
  const variants = {
    default: "text-dark dark:text-white hover:opacity-70",
    primary:
      "bg-primary text-white shadow-btn hover:bg-primary/90 hover:shadow-btn-hover",
  };

  const roundedMap = {
    none: "rounded-none",
    sm: "rounded-sm",
    md: "rounded-md",
    lg: "rounded-lg",
    xl: "rounded-xl",
    full: "rounded-full",
  };

  return (
    <Link
      href={href}
      className={clsx(
        baseStyles,
        variants[variant],
        roundedMap[rounded],
        className,
      )}
    >
      {children}
    </Link>
  );
};

export default Button;
