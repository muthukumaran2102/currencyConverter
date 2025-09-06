import Select, { components, type SingleValueProps } from "react-select";
import type { CustomDropdownProps, DropdownOption } from "../types/InputTypes";

const DropDown: React.FC<CustomDropdownProps> = ({
  options,
  errorMessage,
  name,
  selectedValue,
  onSelect,
  placeholder = "Select an option",
}) => {
  const handleSelect = (option: any) => {
    onSelect(option as DropdownOption, name);
  };

  const CustomOption = (props: any) => {
    const { innerProps, innerRef, data } = props;
    return (
      <div ref={innerRef} {...innerProps} className="flex p-3 items-center gap-3">
        <img
          src={`https://flagcdn.com/16x12/${data.flag}.png`}
          srcSet={`https://flagcdn.com/32x24/${data.flag}.png 2x,
                     https://flagcdn.com/48x36/${data.flag}.png 3x`}
          width="16"
          height="12"
          alt="Ukraine"
        />
        <div>{data.label}</div>
      </div>
    );
  };

 const CustomSingleValue = (props: SingleValueProps<DropdownOption>) => (
  <components.SingleValue {...props}>
    {props.data.flag && <img
          src={`https://flagcdn.com/16x12/${props.data.flag}.png`}
          srcSet={`https://flagcdn.com/32x24/${props.data.flag}.png 2x,
                     https://flagcdn.com/48x36/${props.data.flag}.png 3x`}
          width="16"
          height="12"
          alt="Ukraine"
        />}
    {props.children}
  </components.SingleValue>
);


  return (
    <>
    <Select
      options={options}
      name={name}
      placeholder={placeholder}
      classNames={{
        control: (state: any) =>
          `border-0 border-b-2 ${
            state.isFocused ? "border-blue-500" : "border-gray-300"
          } rounded-md p-2`,
        option: (state: any) =>
          `p-2 cursor-pointer ${
            state.isSelected ? "bg-blue-200" : "hover:bg-gray-100"
          }`,
        menu: () => "shadow-lg rounded-md mt-2",
        singleValue: () => "text-gray-800 flex gap-2",
        input: () => "text-gray-900",
      }}
      value={selectedValue?.value ? selectedValue: []}
      onChange={handleSelect}
      components={{ Option: CustomOption, SingleValue : CustomSingleValue }}
    />
    {errorMessage && (
          <p className="text-red-500 text-xs italic mt-1">{errorMessage}</p>
        )}
    </>
  );
};

export default DropDown;
