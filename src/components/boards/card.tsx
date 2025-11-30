"use client";

import {
  SortableContext,
  verticalListSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { Edit, Paperclip, SquareCheckBig, Text, Trash } from "lucide-react";
import { CSS } from "@dnd-kit/utilities";
import CheckboxDemo from "../ui/checkbox";
import { Button } from "../ui/button";
import AlertDialogDemo from "../ui/alert-dialog";
import { Dialog } from "../ui/dialog";
import { CardDetail } from "../card-detail";
import { useAppDispatch } from "@/hooks/useRedux";
import { AppDispatch } from "@/store";
import { deleteCard, updateCard } from "@/store/boardSlice";
import { CardService } from "@/services/card.service";
import { Card as CardType } from "@/types/board.type";

type CardProps = {
  item: CardType;
};

export const Card = ({ item }: CardProps) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: item._id, data: { ...item } });

  const dispatch = useAppDispatch<AppDispatch>();

  const style = {
    touchAction: "none",
    transform: CSS.Translate.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : undefined,
  };

  const handleDeleteCard = async () => {
    dispatch(deleteCard({ columnId: item.columnId, cardId: item._id }));
    
    try {
      await CardService.deleteCard(item._id)
    }
    catch {}
  };

  const markCard = async (
    columnId: string,
    cardId: string,
    field: string,
    value: any
  ) => {
    const newData = { ...item, [field]: value };
    dispatch(updateCard({ columnId, cardId, field, value }));

    try {
      await CardService.updateContent(newData);
    } catch {}
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={`bg-white dark:bg-card rounded-xl group shadow-sm cursor-pointer border-2 border-transparent hover:border-blue-800 overflow-hidden relative ${
        item.FE_placeholderCard
          ? "opacity-0 h-0 p-0 mt-0 shadow-none border-none"
          : "opacity-100 mt-2"
      }`}
    >
      {/* cover */}
      {item.cover && (
        <Dialog
          trigger={
            <div
              className="min-h-35 bg-cover"
              style={{ backgroundImage: `url("${item.cover}")` }}
            ></div>
          }
        >
          <CardDetail data={item} />
        </Dialog>
      )}

      <div className="flex justify-between items-center gap-2 px-3 py-2">
        <div className="flex flex-1 items-center gap-2 group">
          <CheckboxDemo
            classname={`animate-checkbox ${
              item.status ? "" : "hidden group-hover:block"
            }`}
            onCheckedChange={(checked) => {
              markCard(item.columnId, item._id, "status", checked === true);
            }}
            checked={item.status}
          />
          <Dialog trigger={<label>{item.label}</label>}>
            <CardDetail data={item} />
          </Dialog>
        </div>
        <div className="flex gap-2 items-center opacity-0 group-hover:opacity-100 transition-opacity duration-100 absolute top-1 right-1">
          <AlertDialogDemo
            onclick={() => handleDeleteCard()}
            label="Are you sure delete this card?"
            description=""
            trigger={
              <Button
                className="bg-white rounded-full"
                variant="transparent"
                size="ic"
                icon={<Trash size={13} />}
              />
            }
          />

          <Dialog
            trigger={
              <Button
                className="bg-white rounded-full"
                variant="transparent"
                size="ic"
                icon={<Edit size={13} />}
              />
            }
          >
            <CardDetail data={item} />
          </Dialog>
        </div>
      </div>

      <div className="flex gap-3 items-center px-6">
        {item.description && (
          <div className="pb-2">
            <Text size={15} />
          </div>
        )}
        {item.attachments?.length > 0 && (
          <div className="flex items-center gap-1 pb-2">
            <Paperclip size={15} />
            <span>1</span>
          </div>
        )}
        {item.checklist?.length > 0 && (
          <div className="flex gap-1 items-center pb-2">
            <SquareCheckBig size={15} />
            <span>1/3</span>
          </div>
        )}
      </div>
    </div>
  );
};

type ListCardProps = {
  items: CardType[];
};

export const ListCard = ({ items }: ListCardProps) => {
  return (
    <SortableContext
      items={items.map((item) => item._id)}
      strategy={verticalListSortingStrategy}
    >
      <div className="flex flex-col">
        {items.map((item) => (
          <Card key={item._id} item={item} />
        ))}
      </div>
    </SortableContext>
  );
};
