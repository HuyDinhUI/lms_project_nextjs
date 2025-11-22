import { Ellipsis, Plus, X } from "lucide-react"
import { useEffect, useRef, useState, type ReactNode } from "react"
import { SortableContext, horizontalListSortingStrategy, useSortable } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import type { CardType } from "@/types/board/card"
import { ListCard } from "./card"
import { Button } from "../ui/button"
import { DropdownMenu } from "../ui/dropdown"
import type { MenuItem } from "@/types/menu-item/menu-item-type"




type ColummsProps = {
    label: string,
    children: ReactNode,
    id: string,
    handleCreateCard: (label: string, columnId: string) => void
    handleUpdateLabelColumn: (title: string, columnId: string) => void
    card: CardType[]
}

export const Column = ({ label, children, id, card, handleCreateCard, handleUpdateLabelColumn }: ColummsProps) => {

    const ActionsBoardItems: MenuItem[] = [

        { label: 'Add card' },
        { label: 'Copy list' },
        { label: 'Move list' },
        { label: 'Move all card in this list' },
        {
            label: 'Sort by',
            children: [
                {
                    label: 'Date created (newest first)'
                },
                {
                    label: 'Date created (oldest first)'
                }
            ]
        },
        { separator: true },
        { label: 'Archive this list' },
        { label: 'Archive all cards in this list' }
    ];

    const [openCreate, setOpenCreate] = useState(false)
    const [openEditLabel, setOpenEditLabel] = useState(false)
    const input = useRef<HTMLTextAreaElement>(null);


    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging
    } = useSortable({ id: id, data: { label, id, card } })

    const style = {
        touchAction: 'none',
        transform: CSS.Translate.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : undefined,
    }

    const [labelInputCard, setLabelInputCard] = useState<string>('')
    const [labelInputColumn, setLabelInputColumn] = useState<string>('')

    useEffect(() => {

        const handleClickOutside = (event: MouseEvent) => {
            if (input.current && !input.current.contains(event.target as Node)) {
                handleUpdateLabelColumn(labelInputColumn, id)
                setOpenEditLabel(false);

            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [labelInputColumn]);

    return (
        <div ref={setNodeRef} style={style} {...attributes} className="w-80 h-full overflow-y-auto rounded-xl">
            <div {...listeners} className="bg-amber-100 dark:bg-column p-3 rounded-xl cursor-pointer">
                <header className="flex justify-between gap-2 items-center">
                    {/* <label className="font-bold">{label}</label> */}
                    {!openEditLabel ?
                        (
                            <Button onClick={() => setOpenEditLabel(true)} variant="transparent" size="lb" className="font-bold w-full p-2" title={label} />)
                        : (
                            <textarea defaultValue={label} onChange={(e) => setLabelInputColumn(e.target.value)} ref={input} autoFocus onBlur={() => setOpenEditLabel(false)} className="w-full resize-none p-2 bg-white dark:bg-background outline-blue-500" rows={1}></textarea>
                        )
                    }

                    <DropdownMenu side="bottom" align="start" items={ActionsBoardItems} label="List actions" trigger={<Button variant="icon" size="ic" icon={<Ellipsis size={18} />} />} />

                </header>
                <div className="pb-4 pt-3">
                    {children}
                </div>
                <footer>
                    {!openCreate ?
                        (<button onClick={() => setOpenCreate(true)} className="flex w-full items-center p-2 gap-2 opacity-70 hover:bg-amber-500/50 dark:hover:bg-white/10 rounded-md cursor-pointer">
                            <Plus size={18} />
                            <label>Add a card</label>
                        </button>
                        )
                        : (
                            <div>
                                <textarea onChange={(e) => setLabelInputCard(e.target.value)} autoFocus className="w-full resize-none p-2 rounded-md bg-white dark:bg-background shadow-md outline-blue-500" placeholder="Enter a title or past a link" />
                                <div className="w-full flex gap-2 mt-2 justify-start">
                                    <Button onClick={() => handleCreateCard(labelInputCard, id)} variant="primary" title="Add card" />
                                    <Button onClick={() => setOpenCreate(false)} variant="transparent" icon={<X />}></Button>
                                </div>
                            </div>
                        )
                    }
                </footer>
            </div>
        </div>
    )
}



export type Columns = {
    _id: string,
    title: string,
    cards: CardType[]
}

type ListColumnsProps = {
    handleCreateColumn: (title: string) => void
    handleCreateCard: (label: string, columnId: string) => void
    handleUpdateLabelColumn: (title: string, columnId: string) => void
    columns: Columns[]
}

export const ListColumns = ({ columns, handleCreateColumn, handleCreateCard, handleUpdateLabelColumn }: ListColumnsProps) => {
    const [openCreate, setOpenCreate] = useState(false)
    const [title, setTitle] = useState<string>('')

    return (
        <SortableContext items={columns.map(c => c._id)} strategy={horizontalListSortingStrategy}>
            <div className="flex p-5 gap-3 h-full">
                {columns.map(col => (
                    <Column handleUpdateLabelColumn={handleUpdateLabelColumn} handleCreateCard={handleCreateCard} key={col._id} id={col._id} label={col.title} card={col.cards}>
                        <ListCard items={col.cards} />

                    </Column>
                ))}
                <div className="w-80">
                    {!openCreate ?
                        (<button onClick={() => setOpenCreate(true)} className="flex w-full items-center text-white p-3 gap-2 opacity-70 bg-white/30 hover:bg-black/10 dark:hover:bg-white/10 rounded-xl cursor-pointer">
                            <Plus size={18} />
                            <label>Add another list</label>
                        </button>
                        )
                        : (
                            <div className="bg-background p-3 rounded-xl h-[131px]">
                                <textarea onChange={(e) => setTitle(e.target.value)} rows={1} className="w-full resize-none p-2 rounded-md bg-white dark:bg-background border-1 border-blue-500" placeholder="Enter a title or past a link" />
                                <div className="w-full flex gap-2 mt-2 justify-start">
                                    <Button onClick={() => handleCreateColumn(title)} variant="primary" title="Add list" />
                                    <Button onClick={() => setOpenCreate(false)} variant="transparent" icon={<X />}></Button>
                                </div>
                            </div>
                        )
                    }
                </div>
            </div>
        </SortableContext>
    )
}