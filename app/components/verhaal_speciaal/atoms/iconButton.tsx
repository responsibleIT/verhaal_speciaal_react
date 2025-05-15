import Image from "next/image";
import { MouseEvent, ButtonHTMLAttributes } from "react";

interface IconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  icon: string;
  altText: string;
  classNames?: string; // Optioneel met standaardwaarde
}

export default function IconButton({
  icon,
  altText,
  classNames = "", // Standaardwaarde
  ...props
}: IconButtonProps) {
  return (
    <button
      {...props} // Hiermee neem je alle standaard button props over
      className={`${classNames} absolute z-[20] py-4 px-6 rounded-full bg-black shadow-[inset_0px_0px_15px_#FFF] active:shadow-[inset_0px_0px_24px_#FFF] disabled:opacity-75`}
    >
      <Image src={icon} alt={altText} height={24} width={24} />
    </button>
  );
}
