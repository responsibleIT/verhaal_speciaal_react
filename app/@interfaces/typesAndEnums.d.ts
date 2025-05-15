export enum Theme {
  ONE = "one",
  TWO = "two",
  THREE = "three",
}

export enum BrdrColors {
  PRIMARY = "border-black",
  SECONDARY = "border-white",
}

export type BannerVariant = "default" | "secondary";
export type BannerState = "default";

export type BorderColors = BrdrColors.PRIMARY | BrdrColors.SECONDARY;

export type childrenOutsideContainerOptions = true | false;

export type ThemeType = Theme.ONE | Theme.TWO | Theme.THREE;

export type StringNullUndefined = string | null | undefined;

export enum TextColorsPrimarySecondary {
  PRIMARY = "text-primary-text",
  SECONDARY = "text-secondary-text",
}

export type TextColorsPrimarySecondaryType =
  | TextColorsPrimarySecondary.PRIMARY
  | TextColorsPrimarySecondary.SECONDARY;

export enum BackgroundColorsPrimarySecondary {
  PRIMARY = "bg-primary-background",
  SECONDARY = "bg-secondary-background",
}

export type BackgroundColorsPrimarySecondaryType =
  | BackgroundColorsPrimarySecondary.PRIMARY
  | BackgroundColorsPrimarySecondary.SECONDARY;

export type BorderColorsPrimarySecondaryType =
  | BrdrColors.PRIMARY
  | BrdrColors.SECONDARY;

export interface ButtonType {
  customText: string;
  onClick: () => void;
}

export enum ScreenSizeVariant {
  XS = "(min-width: 0px)",
  SM = "(min-width: 640px)",
  MD = "(min-width: 768px)",
  LG = "(min-width: 1024px)",
  XL = "(min-width: 1280px)",
  XXL = "(min-width: 1536px)",
}

export type ScreenSizeVariantType =
  | ScreenSizeVariant.XS
  | ScreenSizeVariant.SM
  | ScreenSizeVariant.MD
  | ScreenSizeVariant.LG
  | ScreenSizeVariant.XL
  | ScreenSizeVariant.XXL;

// Buttons START
export type ButtonVariant = "primary";
export type ButtonSize = "sm" | "lg";
export type ButtonState = "default" | "hover" | "focus" | "disabled";
// Buttons END

export type pageTypes =
  | PagesFragment
  | PlainPagesFragment
  | CareerPagesFragment;
