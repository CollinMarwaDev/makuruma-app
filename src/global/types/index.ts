import type { ComponentType, ElementType, SVGProps } from "react";
import type { Dayjs as DayjsInstance } from "dayjs";

/** Solar icon weights (the kit mixes Solar and Heroicons). */
export type IconWeight =
    | "Bold"
    | "BoldDuotone"
    | "Broken"
    | "LineDuotone"
    | "Linear"
    | "Outline";

export interface IconProps extends SVGProps<SVGSVGElement> {
    weight?: IconWeight;
    strokeWidth?: number | string;
    color?: string;
    size?: number | string;
}

// Solar and Heroicons have slightly different prop types; accept either.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type IconType = ComponentType<any>;

export type Callable<T = void, R = void> = (value: T) => R;

export type LabelWithValue<T = string | number | boolean> = { label: string; value: T };
export type LabelWithStringValue = LabelWithValue<string>;
export type LabelWithNumberValue = LabelWithValue<number>;

export type Simplify<T> = { [K in keyof T]: T[K] } & {};

export type MillSeconds = number;

export type Dayjs = DayjsInstance;

/** Chart colour with optional opacity (0-1). */
export type Color = { color: string; opacity?: number };

export type DialogSize = "sm" | "md" | "lg" | "xl" | "2xl" | "3xl";

export type ContainerElementType = ElementType;

export type ErrorType = { message: string; status?: number };
