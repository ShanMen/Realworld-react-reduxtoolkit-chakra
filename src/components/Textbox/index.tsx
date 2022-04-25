import { Input } from "@chakra-ui/react";

interface TextboxProps {
  value: string | any;
  handleChange: any;
  placeholder: any;
}

const Textbox = ({ value, handleChange, placeholder }: TextboxProps) => {
  return (
    <Input value={value} onChange={handleChange} placeholder={placeholder} />
  );
};

export { Textbox };
