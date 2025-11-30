"use client";

import * as Dropdown from "@radix-ui/react-dropdown-menu";
import { useState, type ReactNode } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import clsx from "classnames";
import { Button } from "./button";
import AlertDialogDemo from "./alert-dialog";
import type { MenuItem } from "@/types/menu-item/menu-item-type";

type DropdownSize = "sm" | "md" | "lg";
type DropdownSide = "bottom" | "top" | "right" | "left";
type DropdownAlign = "start" | "end";

type DropdownMenuProps = {
  trigger: ReactNode;
  items: MenuItem[];
  size?: DropdownSize;
  label?: string;
  side?: DropdownSide;
  align?: DropdownAlign;
};

const sizeClass: Record<DropdownSize, string> = {
  sm: "min-w-[200px]",
  md: "min-w-[300px]",
  lg: "min-w-[400px]",
};

export const DropdownMenu = ({
  trigger,
  items,
  size = "md",
  side,
  align,
  label,
}: DropdownMenuProps) => {
  const [history, setHistory] = useState<MenuItem[][]>([items]);

  const currentMenu = history[history.length - 1];

  const handleClick = (item: MenuItem) => {
    if ("separator" in item) {
      return;
    }

    setHistory((prev) => [...prev, item.children!]);
  };

  const goBack = () => {
    setHistory((prev) => prev.slice(0, prev.length - 1));
  };

  return (
    <Dropdown.Root
      onOpenChange={(open) => {
        if (!open) {
          setHistory([items]);
        }
      }}
    >
      <Dropdown.Trigger asChild>{trigger}</Dropdown.Trigger>

      <Dropdown.Portal>
        <Dropdown.Content
          className={clsx(
            sizeClass[size],
            "bg-white dark:bg-gray-800 rounded shadow-lg"
          )}
          side={side}
          align={align}
        >
          <div className="relative flex justify-center items-center px-2 py-3">
            <span>{label}</span>
            {history.length > 1 && (
              <Button
                onClick={() => goBack()}
                className="absolute left-1"
                variant="transparent"
                icon={<ChevronLeft size={15} />}
              />
            )}
          </div>

          {currentMenu.map((item, index) => {
            if ("separator" in item) {
              return (
                <Dropdown.Separator
                  key={index}
                  className="h-px my-1 bg-gray-200 dark:bg-gray-700"
                />
              );
            }

            return (
              <div key={index}>
                {item.children ? (
                  <Dropdown.Item
                    onClick={() => {
                      handleClick(item);
                    }}
                    onSelect={(e) => e.preventDefault()}
                    key={index}
                    className={clsx(
                      "flex items-center justify-between px-2 py-1.5 text-sm hover:bg-gray-100 dark:hover:bg-gray-700",
                      item.disabled && "opacity-50 pointer-events-none"
                    )}
                  >
                    {item.dialog ? (
                      <AlertDialogDemo
                        label={item.dialog.label}
                        description={item.dialog.description}
                        onclick={item.onClick}
                        trigger={
                          <Button
                            variant="item"
                            className="w-full"
                            icon={item.icon}
                            title={item.label}
                            size="sm"
                          />
                        }
                      />
                    ) : (
                      <Button
                        onClick={item.onClick}
                        variant="item"
                        icon={item.icon}
                        title={item.label}
                        size="sm"
                      />
                    )}
                    <ChevronRight size={15} />
                    {item.shortcut && (
                      <span className="text-xs text-gray-500 ml-2">
                        {item.shortcut}
                      </span>
                    )}
                    {item.element && <div>{item.element}</div>}
                  </Dropdown.Item>
                ) : (
                  <Dropdown.Item
                    onSelect={(e) => e.preventDefault()}
                    onClick={item.onClick}
                    key={index}
                    className={clsx(
                      "flex items-center px-2 py-1.5 text-sm cursor-pointer",
                      item.disabled && "opacity-50 pointer-events-none", !item.element && "hover:bg-gray-100 dark:hover:bg-gray-700"
                    )}
                  >
                    {item.dialog ? (
                      <AlertDialogDemo
                        label={item.dialog.label}
                        description={item.dialog.description}
                        onclick={item.onClick}
                        trigger={
                          <Button
                            variant="item"
                            className="w-full"
                            icon={item.icon}
                            title={item.label}
                            size="sm"
                          />
                        }
                      />
                    ) : (
                      <Button
                        variant="item"
                        icon={item.icon}
                        title={item.label}
                        size="sm"
                      />
                    )}

                    {item.shortcut && (
                      <span className="text-xs text-gray-500 ml-2">
                        {item.shortcut}
                      </span>
                    )}
                    {item.element && <div className="min-h-30">{item.element}</div>}
                  </Dropdown.Item>
                )}
              </div>
            );
          })}
        </Dropdown.Content>
      </Dropdown.Portal>
    </Dropdown.Root>
  );
};
