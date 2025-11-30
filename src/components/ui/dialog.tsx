"use client";

import { X } from "lucide-react";
import type { ReactNode } from "react";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

type DialogProps = {
  trigger?: ReactNode;
  children?: ReactNode;
};

function Portal({ children }: { children: React.ReactNode }) {
  const [container] = useState(() => document.createElement("div"));

  useEffect(() => {
    document.body.appendChild(container);
    return () => {
      document.body.removeChild(container);
    };
  }, [container]);

  return createPortal(children, container);
}

export const Dialog = ({ children, trigger }: DialogProps) => {
  const [isOpenDialog, setIsOpenDialog] = useState<boolean>(false);

  return (
    <div className="w-full">
      <div onClick={() => setIsOpenDialog(true)} className="trigger w-full">
        {trigger}
      </div>
      {isOpenDialog && (
        <Portal>
          <div onClick={() => setIsOpenDialog(false)} className="fixed top-0 left-0 w-screen h-screen bg-black/40"></div>
          <div className="fixed top-0 left-1/2 -translate-x-1/2 dark:bg-card mt-10">
            <div className="w-270">{children}</div>
            <button
              onClick={() => setIsOpenDialog(false)}
              className="bg-white rounded-full absolute top-4 right-3 p-1 cursor-pointer"
            >
              <X size={20} color="black" />
            </button>
          </div>
        </Portal>
      )}
    </div>
  );
};
