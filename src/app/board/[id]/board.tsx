"use client";

import { ListColumns } from "@/components/boards/columns";
import { Button } from "@/components/ui/button";
import { Filter, Ellipsis, Star } from "lucide-react";
import {
  DndContext,
  useSensor,
  useSensors,
  PointerSensor,
  DragOverlay,
  defaultDropAnimationSideEffects,
  closestCorners,
} from "@dnd-kit/core";
import { useEffect, useState } from "react";
import { arrayMove } from "@dnd-kit/sortable";
import { Column } from "@/components/boards/columns";
import { Card, ListCard } from "@/components/boards/card";
import { cloneDeep, isEmpty } from "lodash";
import { generatePlaceholdeCard } from "@/utils/formatters";
import API from "@/utils/axios";
import { toast } from "react-toastify";
import { useParams } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/hooks/useRedux";
import { AppDispatch, RootState } from "@/store";
import { fetchBoard, setColumn } from "@/store/boardSlice";
import { SkeletonBoardPage } from "@/components/ui/skeleton";

const TYPE_ACTIVE_DND = {
  COLUMN: "T_COLUMN",
  CARD: "T_CARD",
};

const Board = () => {
  const pointerSensor = useSensor(PointerSensor, {
    activationConstraint: {
      distance: 10,
    },
  });
  const sensors = useSensors(pointerSensor);
  const dispatch = useAppDispatch<AppDispatch>();
  const { board, columns, loading, error } = useAppSelector(
    (state: RootState) => state.board
  );
  
  const [activeDragItemId, setActiveDragItemId] = useState<string | null>(null);
  const [activeDragItemType, setActiveDragItemType] = useState<string | null>(
    null
  );
  const [activeDragItemData, setActiveDragItemData] = useState<any>(null);

  const { id } = useParams();

  useEffect(() => {
    if (!id) return;

    dispatch(fetchBoard(id));
  }, [dispatch, id]);

  const findColumn = (cardId: any) => {
    return columns?.find((column) =>
      column.cards.map((card) => card._id)?.includes(cardId)
    );
  };

  const HandleDragStart = (event: any) => {
    console.log(event);
    setActiveDragItemId(event?.active?.id);
    setActiveDragItemType(
      event?.active?.data?.current?.columnId
        ? TYPE_ACTIVE_DND.CARD
        : TYPE_ACTIVE_DND.COLUMN
    );
    setActiveDragItemData(event?.active?.data?.current);
  };

  const HandleDragOver = (event: any) => {
    if (activeDragItemType === TYPE_ACTIVE_DND.COLUMN) return;

    const { active, over } = event;

    if (!over) return;

    const {
      id: activeDrappingCardId,
      data: { current: activeDrappingCardData },
    } = active;
    const { id: overCardId } = over;

    console.log(over);

    const activeColumn = findColumn(activeDrappingCardId);
    const overColumn = findColumn(overCardId);

    if (!activeColumn || !overColumn) return;

    const overCardIndex = overColumn?.cards?.findIndex(
      (card) => card._id === overCardId
    );

    const isBelowOverItem =
      active.rect.current.translated &&
      active.rect.current.translated.top > over.rect.top + over.rect.height;
    const modifier = isBelowOverItem ? 1 : 0;
    const newCardIndex =
      overCardIndex >= 0
        ? overCardIndex + modifier
        : overColumn?.cards?.length + 1;

    const nextColumns = cloneDeep(columns);
    const nextActiveColumn = nextColumns?.find(
      (column) => column._id === activeColumn._id
    );
    const nextOverColumn = nextColumns?.find(
      (column) => column._id === overColumn._id
    );

    // xoá card đang kéo khỏi column chứa card đang kéo
    if (nextActiveColumn) {
      nextActiveColumn.cards = nextActiveColumn.cards.filter(
        (card) => card._id !== activeDrappingCardId
      );

      if (isEmpty(nextActiveColumn.cards)) {
        nextActiveColumn.cards = [generatePlaceholdeCard(nextActiveColumn)];
      }
    }

    // thêm card đang kéo vào column được thả vào
    if (nextOverColumn) {
      // nextOverColumn.card = nextOverColumn.card.filter(card => card.id !== activeDrappingCardId)
      nextOverColumn.cards.splice(newCardIndex, 0, activeDrappingCardData);

      nextOverColumn.cards = nextOverColumn.cards.filter(
        (card) => !card.FE_placeholderCard
      );
    }

    dispatch(setColumn(nextColumns));
  };

  const HandleDragEnd = async (event: any) => {
    console.log(event);

    const { active, over } = event;

    if (!over) return;

    if (activeDragItemType === TYPE_ACTIVE_DND.CARD) {
      console.log(columns);

      console.log({
        boardId: id,
        columns: columns
          ?.find((c) => c.cards.find((card) => card.FE_placeholderCard))
          ?.cards.filter((card) => !card.FE_placeholderCard),
      });

      try {
        await API.put("/card/updateOrderAndPosition", {
          boardId: id,
          columns: columns,
        });
      } catch (err: any) {
        toast.error(err?.response?.data?.message);
      }
    }

    if (activeDragItemType === TYPE_ACTIVE_DND.COLUMN && columns) {
      const oldIndex = columns?.findIndex((c) => c._id === active.id);
      const newIndex = columns?.findIndex((c) => c._id === over.id);

      const NewColumnData = arrayMove(columns, oldIndex, newIndex);
      dispatch(setColumn(NewColumnData));

      try {
        const res = await API.put(`/boards/reorderColumn/${id}`, {
          columnsOrder: NewColumnData.map((c) => c._id),
        });
        console.log(res);
      } catch (err: any) {
        toast.error(err?.response?.data?.message);
      }
    }

    setActiveDragItemId(null);
    setActiveDragItemType(null);
    setActiveDragItemData(null);
  };

  const dropAnimation = {
    sideEffects: defaultDropAnimationSideEffects({
      styles: { active: { opacity: "0.5" } },
    }),
  };

  if (loading) return <SkeletonBoardPage />;

  return (
    <div className="flex h-full gap-5">
      <DndContext>
        {/* Inbox */}

        {/* <div className="h-full bg-blue-100 dark:bg-blue-900 min-w-80 rounded-xl overflow-hidden">
                    <header className="p-5 bg-blue-50/30 dark:bg-blue-950/50 flex justify-between ">
                        <div className="flex items-center gap-2">
                            <Inbox size={18} />
                            <label className="font-bold">Inbox</label>
                        </div>
                        <div className="flex items-center">
                            <Button size="ic" variant="icon" icon={<Bell size={18} />} />
                            <Button size="ic" variant="icon" icon={<Filter size={18} />} />
                            <Button size="ic" variant="icon" icon={<Ellipsis size={18} />} />
                        </div>
                    </header>
                    <div className="w-full">
                        <DndContext
                            onDragEnd={HandleDragEnd}
                            onDragStart={HandleDragStart}
                            onDragOver={HandleDragOver}
                            sensors={sensors}
                            collisionDetection={closestCorners}>
                            
                        </DndContext>
                    </div>
                </div> */}

        {/* Boards */}

        <div
          className="relative flex-1 h-full flex flex-col overflow-hidden bg-cover bg-no-repeat bg-center"
          style={{ backgroundImage: `url('${board?.cover}')` }}
        >
          <header className="p-5 flex justify-between bg-black/20 text-white">
            <div className="flex items-center gap-2">
              <label className="font-bold">{board?.title}</label>
            </div>
            <div className="flex items-center">
              <Button size="ic" variant="icon" icon={<Filter size={18} />} />
              <Button size="ic" variant="icon" icon={<Star size={18} />} />
              <Button size="ic" variant="icon" icon={<Ellipsis size={18} />} />
            </div>
          </header>
          <div className="flex-1 relative overflow-x-auto scroll-smooth">
            <DndContext
              onDragEnd={HandleDragEnd}
              onDragStart={HandleDragStart}
              onDragOver={HandleDragOver}
              sensors={sensors}
              collisionDetection={closestCorners}
            >
              <ListColumns columns={columns ? columns : []} />
              <DragOverlay dropAnimation={dropAnimation}>
                {!activeDragItemId && null}
                {activeDragItemId &&
                  activeDragItemType === TYPE_ACTIVE_DND.COLUMN && (
                    <Column
                      label={activeDragItemData.label}
                      id={activeDragItemData.id}
                      card={activeDragItemData.card}
                      boardId={activeDragItemData.boardId}
                    >
                      <ListCard items={activeDragItemData.card} />
                    </Column>
                  )}
                {activeDragItemId &&
                  activeDragItemType === TYPE_ACTIVE_DND.CARD && (
                    <Card item={activeDragItemData} />
                  )}
              </DragOverlay>
            </DndContext>
          </div>
        </div>
      </DndContext>
    </div>
  );
};

export default Board;
