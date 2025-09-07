import type { InputHTMLAttributes } from "react";

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  errorMessage?: string;
  type?: string;
  name: string;
  value: string | number;
  placeholder?: string;
}

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?:
    | "primary"
    | "secondary"
    | "danger"
    | "destructive"
    | "default"
    | "outline";
  size?: "small" | "medium" | "large" | "sm" | "lg" | "icon" | "default";
  children: React.ReactNode;
  color?: string;
}

export interface DropdownOption {
  value: string;
  label: string;
  flag: string
}

export interface CustomDropdownProps {
  options: DropdownOption[];
  onSelect: (value: DropdownOption, name: string) => void;
  placeholder?: string;
  errorMessage?: string;
  selectedValue: DropdownOption
  name: string
}

export interface exchangerates  { [key: string]: string };
export interface detail  {
  money: string;
  fromCountry: DropdownOption;
  toCountry: DropdownOption;
};
export interface errorType {
      money: string;
      fromCountry: string;
      toCountry: string;
      [key: string]: string;
}