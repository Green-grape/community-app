import React from "react";
import cls from "classnames";

interface InputGroupProps {
  className?: string;
  type?: string;
  placeholder?: string;
  value?: string;
  error?: string | undefined;
  setValue?: (str: string) => void;
}

const InputGroup: React.FC<InputGroupProps> = ({
  className = "mb-2",
  type = "text",
  placeholder = "",
  value = "",
  error,
  setValue = (s) => {},
}) => {
  return (
    <div className={className}>
      <input
        value={value}
        type={type}
        placeholder={placeholder}
        onChange={(e) => {
          setValue(e.target.value);
        }}
        className={cls(
          `w-full transition duration 200 border pl-2 py-2 mb-1 border-gray-400 rounded bg-gray-50 focues:bg-white hover:bg-white`,
          {
            "border-red-500": error,
          }
        )}
      />
      <small className="font-medium text-red-500">{error}</small>
    </div>
  );
};

export default InputGroup;
