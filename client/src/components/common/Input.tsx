import React from "react";

interface InputProps {
  placeholder: string;
  value?: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const Input: React.FC<InputProps> = ({
  placeholder,
  value,
  onChange
}) => {
  return (
    <input
      value={value}
      placeholder={placeholder}
      onChange={onChange}
      className="border border-gray-300 rounded-lg p-2 w-full mb-3 focus:outline-none focus:ring-2 focus:ring-blue-400"
    />
  );
};

export default Input;