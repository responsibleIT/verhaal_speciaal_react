import { MouseEventHandler } from "react";
import SelectItem from "../atoms/SelectItem";

interface SelectListProps {
  list: string[];
  onCheck: (selected:boolean) => void;
}

export default function SelectList({ list, onCheck }: SelectListProps) {
  return (
    <div className="flex flex-col w-full shadow-purple shadow-[0px_0px_20px_5px] rounded-xl p-4">
      {list.map((item, index) => (
        <SelectItem key={index} onCheck={onCheck} text={item} classNames={index === 0 ? "" : "shadow-[0px_-1px_1px_0px]"} />
      ))}
    </div>
  );
}
