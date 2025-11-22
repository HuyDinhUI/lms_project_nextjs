
import { X } from "lucide-react"
import type { ReactNode } from "react"
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";


type DialogProps = {
    trigger?: ReactNode
    children?: ReactNode
}



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
    
    const [isOpenDialog, setIsOpenDialog] = useState<boolean>(false)

    return (
        <div className="w-full">
            <div onClick={() => setIsOpenDialog(true)} className="trigger w-full">{trigger}</div>
            {isOpenDialog && <Portal>
                <div className="fixed top-0 left-0 w-screen h-screen bg-black/20"></div>
                <div className="fixed top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white dark:bg-card w-300 h-100 rounded-xl">
                {children}

                <button onClick={() => setIsOpenDialog(false)} className="bg-white rounded-full absolute top-3 right-3 p-1 cursor-pointer">
                    <X color="black"/>
                </button>
                </div>
            </Portal>}
        </div>

    )
}