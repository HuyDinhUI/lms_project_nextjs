"use client"

import { useState, type ReactNode } from "react";
import {
  ChevronDown,
  ChevronRight,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export type SidebarItem =
  | {
    type: 'item',
    label: string;
    icon?: ReactNode;
    href?: string;
    subItems?: SidebarItem[];
  }
  |
  {
    type: 'separator';
    label?: string;
  };

type SidebarItemProps = {
  items: SidebarItem[]
}



export const Sidebar = ({items}:SidebarItemProps) => {
  const location = usePathname();
  const [openMenus, setOpenMenus] = useState<string[]>([]);

  const toggleMenu = (label: string) => {
    setOpenMenus((prev) =>
      prev.includes(label) ? prev.filter((l) => l !== label) : [...prev, label]
    );
  };

  const isMenuOpen = (label: string) => openMenus.includes(label);

  

  return (
    <aside className="w-70 max-h-[90vh] scroll-auto sticky top-0 overflow-auto ps-7 py-4 space-y-2">
      {items.map((item, index) => {
        if (item.type === 'separator') {
          return item.label ? (
            <div key={index} className="px-3 py-1 text-xs font-bold tracking-wide">
              {item.label}
            </div>
          ) : (
            <hr key={index} className="my-3 border-gray-200" />
          );
        }

        const isActive = item.href === location ? true : false
        const hasSub = item.subItems && item.subItems.length > 0;

        return (
          <div key={item.label} className="">
            <button
              onClick={() => hasSub && toggleMenu(item.label)}
              className={`cursor-pointer w-full flex items-center justify-between px-3 py-2 rounded-md text-sm transition ${isActive ? "bg-blue-200/30 text-blue-800 dark:bg-blue-700/20 dark:text-blue-400" : "hover:bg-gray-800/10 dark:hover:bg-white/10"
                }`}
            >
              <span className="flex items-center gap-2 flex-1">
                {item.icon}
                {item.href ? (
                  <Link href={item.href} className="w-full text-left">{item.label}</Link>
                ) : (
                  <span>{item.label}</span>
                )}
              </span>
              {hasSub &&
                (isMenuOpen(item.label) ? (
                  <ChevronDown size={16} />
                ) : (
                  <ChevronRight size={16} />
                ))}
            </button>

            {/* Submenu */}
            {hasSub && isMenuOpen(item.label) && (
              <div className="mt-1 space-y-1 w-full">
                {item.subItems!.map((sub) => {
                  if (sub.type === 'separator') {
                    return item.label ? (
                      <div key={index} className="px-3 py-1 text-xs text-gray-500 uppercase tracking-wide">
                        {item.label}
                      </div>
                    ) : (
                      <hr key={index} className="my-3 border-gray-700" />
                    );
                  }
                  const isSubActive = location === sub.href;
                  return (
                    <Link
                      key={sub.label}
                      href={sub.href!}
                      className={`flex items-center gap-2 ps-10 px-2 py-2 text-sm rounded ${isSubActive ? "bg-blue-200/70 text-blue-600 " : "hover:bg-gray-200 dark:hover:bg-white/10"
                        }`}
                    >
                      {sub.icon}
                      {sub.label}
                    </Link>
                  );
                })}
              </div>
            )}
          </div>
        );
      })}
    </aside>
  );
};
