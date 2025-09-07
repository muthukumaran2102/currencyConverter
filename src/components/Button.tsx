import React from "react";
import { type ButtonProps } from "../types/types";
const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    { children, variant = "primary", className = "", size = "medium",color='', ...rest },
    ref
  ) => {
    const baseClasses =
      "font-semibold py-2 px-4 rounded focus:outline-none focus:shadow-outline";

    const variantClasses = {
      primary: `${color ? color: 'bg-blue-500'} hover: ${color ? `${color}/300`: 'bg-blue-600'}  text-white rounded-full`,
      secondary: "bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-full",
      danger: "bg-red-500 hover:bg-red-600 text-white rounded-full",
      default:
        "bg-blue-700 text-white hover:bg-blue-800 focus-visible:ring-blue-300 rounded-full",
      destructive:
        "bg-red-700 text-white hover:bg-red-800 focus-visible:ring-red-300 rounded-full",
      outline:
        "border border-gray-900 text-dark-900 bg-white hover:bg-gray-900 hover:text-white rounded-full",
    };
    const sizeClasses = {
      small: "text-sm",
      medium: "text-base",
      large: "text-lg",
      default: "h-10 px-4 py-2",
      sm: "h-9 px-3",
      lg: "h-11 px-8",
      icon: "h-10 w-10",
    };
    // rounded-md
    const combinedClasses = `${baseClasses} ${variantClasses[variant]} ${
      sizeClasses[size]
    } ${className || ""}`;
    return (
      <button ref={ref} className={combinedClasses} {...rest}>
        {children}
      </button>
    );
  }
);

export default Button;
