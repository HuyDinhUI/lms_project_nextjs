import { Header } from "@/components/ui/header";
import { Sidebar, type SidebarItem } from "@/components/ui/side-bar";
import { slugtify } from "@/utils/formatters";
import { LayoutDashboard, Settings, SquareKanban, Home, Users2, CreditCard, Rocket } from "lucide-react";
import type { ReactNode } from "react";


type Props = {
  children: ReactNode;
};

const sidebarItems: SidebarItem[] = [
  { type: 'item', label: "Board", icon: <SquareKanban size={18} />, href: `/${slugtify(localStorage.getItem('username') ?? '')}/boards`},
  {
    type: 'item',
    label: "Template",
    icon: <LayoutDashboard size={18} />,
    href: "/templates",
    subItems: [
      { type: 'item', label: "Business", href: "#", },
      { type: 'item', label: "Design", href: "#", },
      { type: 'item', label: "Education", href: "#", },
      { type: 'item', label: "Engineering", href: "#", },
      { type: 'item', label: "Marketing", href: "#", },
      { type: 'item', label: "HR & Operations", href: "#", },
      { type: 'item', label: "Personal", href: "#", },
      { type: 'item', label: "Productivity", href: "#", },
      { type: 'item', label: "Product management", href: "#", },
      { type: 'item', label: "Project management", href: "#", },
      { type: 'item', label: "Remote work", href: "#", },
      { type: 'item', label: "Sales", href: "#", },
      { type: 'item', label: "Support", href: "#", },
      { type: 'item', label: "Team management", href: "#", },
    ]
  },
  { type: 'item', label: "Home", icon: <Home size={18} />, href: "/" },
  { type: 'separator' },
  { type: 'separator', label: 'Workspaces' },
  {
    type: 'item',
    label: "Trello Workspace",
    icon: <Rocket size={18} />,
    subItems: [
      { type: 'item', label: "Boards", href: "#", icon: <LayoutDashboard size={18} /> },
      { type: 'item', label: "Members", href: "#", icon: <Users2 size={18} /> },
      { type: 'item', label: "Settings", href: "#", icon: <Settings size={18} /> },
      { type: 'item', label: "Billing", href: "#", icon: <CreditCard size={18} /> },
    ],
  },
];

const MainLayout = ({ children }: Props) => {

  return (
    <div className="wrapper dark:bg-background">
      <Header />
      <div className="flex overflow-y-scroll max-h-[90vh] pt-5">
        <Sidebar items={sidebarItems} />
        {children}
      </div>
    </div>
  )
}

export default MainLayout

