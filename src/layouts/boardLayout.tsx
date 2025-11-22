import { Header } from "@/components/ui/header"
import type { ReactNode } from "react";

type Props = {
  children: ReactNode;
};

const MainLayout = ({ children }: Props) => {

  return (
    <div className="wrapper h-full flex flex-col">
      <Header />
      <div className="flex-1">
        {children}
      </div>
    </div>
  )
}

export default MainLayout