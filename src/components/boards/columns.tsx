import { Ellipsis, Plus, X } from "lucide-react";
import { useEffect, useRef, useState, type ReactNode } from "react";
import {
  SortableContext,
  horizontalListSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { ListCard } from "./card";
import { Button } from "../ui/button";
import { DropdownMenu } from "../ui/dropdown";
import type { MenuItem } from "@/types/menu-item/menu-item-type";
import { Card, Column as ColumnType } from "@/types/board.type";
import { useAppDispatch } from "@/hooks/useRedux";
import { AppDispatch } from "@/store";
import {
  addCard,
  addColumn,
  deleteColumn,
  editLabel,
  fetchBoard,
} from "@/store/boardSlice";
import { ColumnService } from "@/services/column.service";
import { CardService } from "@/services/card.service";

type ColummsProps = {
  label: string;
  children: ReactNode;
  id: string;
  boardId: string;
  card: Card[];
};

export const Column = ({
  label,
  children,
  id,
  card,
  boardId,
}: ColummsProps) => {
  const [openCreate, setOpenCreate] = useState(false);
  const [openEditLabel, setOpenEditLabel] = useState(false);
  const input = useRef<HTMLTextAreaElement>(null);
  const dispatch = useAppDispatch<AppDispatch>();

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: id, data: { label, id, card } });

  const style = {
    touchAction: "none",
    transform: CSS.Translate.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : undefined,
  };

  const [labelInputCard, setLabelInputCard] = useState<string>("");
  const [labelInputColumn, setLabelInputColumn] = useState<string>("");

  useEffect(() => {
    const handleClickOutside = async (event: MouseEvent) => {
      if (input.current && !input.current.contains(event.target as Node)) {
        dispatch(editLabel({ columnId: id, value: labelInputColumn }));
        setOpenEditLabel(false);
        setLabelInputColumn("");

        const data = {
          title: labelInputColumn,
          columnId: id,
        };

        try {
          await ColumnService.updateColumn(data);
        } catch {}
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [labelInputColumn]);

  const handleCreateCard = async () => {
    dispatch(addCard({ label: labelInputCard, columnId: id }));
    setLabelInputCard("");
    setOpenCreate(false);

    const data = {
      label: labelInputCard,
      columnId: id,
    };

    try {
      await CardService.createCard(data);
    } catch {}
  };

  const handleDeleteColumn = async () => {
    dispatch(deleteColumn({ columnId: id }));

    try {
      await ColumnService.deleteColumn(id);
    } catch {}
  };

  const ActionsBoardItems: MenuItem[] = [
    {
      label: "Add card",
      children: [
        {
          element: (
            <div className="py-3">
              <textarea
                className="w-full resize-none p-2 rounded-md bg-white dark:bg-background ring ring-gray-100 outline-blue-500"
                placeholder="Enter a title or past a link"
                autoFocus
                onChange={(e) => setLabelInputCard(e.target.value)}
              ></textarea>
              <Button
                onClick={() => handleCreateCard()}
                title="Add"
                variant="primary"
                className="mt-2"
              />
            </div>
          ),
        },
      ],
    },
    { label: "Copy list" },
    { label: "Move list" },
    { label: "Move all card in this list" },
    {
      label: "Sort by",
      children: [
        {
          label: "Date created (newest first)",
        },
        {
          label: "Date created (oldest first)",
        },
      ],
    },
    { separator: true },
    {
      label: "Archive this list",
      onClick() {
        handleDeleteColumn();
      },
    },
    { label: "Archive all cards in this list" },
  ];

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      className="w-70 rounded-xl"
    >
      <div
        {...listeners}
        className="bg-gray-100 dark:bg-column rounded-xl cursor-pointer min-h-30 max-h-[80vh] relative"
      >
        <header className="flex justify-between gap-2 items-center p-2">
          {!openEditLabel ? (
            <Button
              onClick={() => setOpenEditLabel(true)}
              variant="transparent"
              size="lb"
              className="font-bold w-full p-2"
              title={label}
            />
          ) : (
            <textarea
              defaultValue={label}
              onChange={(e) => setLabelInputColumn(e.target.value)}
              ref={input}
              autoFocus
              onBlur={() => setOpenEditLabel(false)}
              className="w-full resize-none p-2 bg-white dark:bg-background outline-blue-500"
              rows={1}
            ></textarea>
          )}

          <DropdownMenu
            side="bottom"
            align="start"
            items={ActionsBoardItems}
            label="List actions"
            trigger={
              <Button variant="icon" size="ic" icon={<Ellipsis size={18} />} />
            }
          />
        </header>
        <div className="pb-15 px-3 overflow-y-auto max-h-[70vh]">
          {children}
          {openCreate && (
            <div className="mt-5">
              <textarea
                onChange={(e) => setLabelInputCard(e.target.value)}
                autoFocus
                className="w-full resize-none p-2 rounded-md bg-white dark:bg-background shadow-md outline-blue-500"
                placeholder="Enter a title or past a link"
              />
              <div className="w-full flex gap-2 mt-2 justify-start">
                <Button
                  onClick={() => handleCreateCard()}
                  variant="primary"
                  title="Add card"
                />
                <Button
                  onClick={() => setOpenCreate(false)}
                  variant="transparent"
                  icon={<X />}
                ></Button>
              </div>
            </div>
          )}
        </div>

        {!openCreate && (
          <div className="py-2 px-3 bg-gray-100 absolute bottom-0 right-0 left-0 rounded-bl-xl rounded-br-xl">
            <Button
              onClick={() => setOpenCreate(true)}
              variant="transparent"
              title="Add a card"
              icon={<Plus />}
              className="w-full hover:bg-black/5 rounded-md"
            >
              <Plus size={18} />
              <label>Add a card</label>
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

type ListColumnsProps = {
  columns: ColumnType[];
};

export const ListColumns = ({ columns }: ListColumnsProps) => {
  const [openCreate, setOpenCreate] = useState(false);
  const [title, setTitle] = useState<string>("");
  const dispatch = useAppDispatch<AppDispatch>();

  const handleAddColumn = async () => {
    dispatch(addColumn({ title, boardId: columns[0].boardId }));
    setTitle("");
    setOpenCreate(false);

    const data = {
      title,
      boardId: columns[0].boardId,
      cards: [],
    };
    try {
      await ColumnService.createColumn(data);
    } catch {}
  };

  return (
    <SortableContext
      items={columns.map((c) => c._id)}
      strategy={horizontalListSortingStrategy}
    >
      <div className="flex p-5 gap-3 max-h-[80vh] overflow-x-scroll absolute">
        {columns.map((col) => (
          <Column
            key={col._id}
            id={col._id}
            label={col.title}
            card={col.cards}
            boardId={col.boardId}
          >
            <ListCard items={col.cards} />
          </Column>
        ))}
        <div className="w-70">
          {!openCreate ? (
            <button
              onClick={() => setOpenCreate(true)}
              className="flex w-full items-center text-white p-3 gap-2 opacity-70 bg-white/30 hover:bg-black/10 dark:hover:bg-white/10 rounded-xl cursor-pointer"
            >
              <Plus size={18} />
              <label>Add another list</label>
            </button>
          ) : (
            <div className="bg-background p-3 rounded-xl h-[131px]">
              <textarea
                onChange={(e) => setTitle(e.target.value)}
                rows={1}
                className="w-full resize-none p-2 rounded-md bg-white dark:bg-background border border-blue-500"
                placeholder="Enter a title or past a link"
              />
              <div className="w-full flex gap-2 mt-2 justify-start">
                <Button
                  onClick={() => handleAddColumn()}
                  variant="primary"
                  title="Add list"
                />
                <Button
                  onClick={() => setOpenCreate(false)}
                  variant="transparent"
                  icon={<X />}
                ></Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </SortableContext>
  );
};
