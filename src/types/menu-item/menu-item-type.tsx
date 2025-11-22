import type { ReactNode } from "react";
import type { AlertDialog } from "../dialog/AlertDialog";

export type MenuItem =
  | {
    label: string;
    icon?: ReactNode;
    shortcut?: string;
    disabled?: boolean;
    dialog?: AlertDialog
    onClick?: () => void;
    children?: MenuItem[]; // submenu
  }
  | { separator: true };