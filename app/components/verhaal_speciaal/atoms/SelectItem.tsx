import { MouseEventHandler, useState } from "react";

interface SelectItemProps {
  classNames?: string;
  text: string;
  onCheck: (selected: boolean) => void;
}

export default function SelectItem({
  text,
  classNames,
  onCheck,
}: SelectItemProps) {
  const [checked, setChecked] = useState<boolean>(true);

  return (
    <div
      className={`w-full shadow-purple justify-between max-w-3xl bg-black flex ${classNames}`}
    >
      <p className={`text-h6 text-white ${checked ? "" : "line-through"}`}>
        {text}
      </p>
      <input
        className=" p-2 w-4 accent-purple"
        type="checkbox"
        checked={checked}
        onClick={(event) => {
          onCheck(!checked);
          setChecked(!checked);
        }}
      />
    </div>
  );
}
