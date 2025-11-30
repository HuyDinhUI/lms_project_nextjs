"use client";

import { CreateBoard } from "@/components/create-board";
import { BoardItem, BoardContainer, BoardWorkspace } from "@/components/ui/board";
import { Button } from "@/components/ui/button";
import { Popover } from "@/components/ui/popover";
import { SkeletonBoardsPage } from "@/components/ui/skeleton";
import { Board } from "@/types/board.type";
import API from "@/utils/axios";
import { Rocket } from "lucide-react";
import { useEffect, useState } from "react";

type props = {
  board: Board[]
}

const Boards = ({board}: props) => {

  return (
    <div className="flex-1 min-h-screen pt-4 px-30">
      {/* Starred */}
      {/* <BoardContainer icon={<Star color="gray" />} title="Starred boards">
                <Board href="/b/123/mytrello" type="primary" title="My trello board" img={'https://d2k1ftgv7pobq7.cloudfront.net/images/backgrounds/gradients/rainbow.svg'} />
            </BoardContainer> */}
      {/* Viewed */}
      {/* <BoardContainer icon={<Clock color="gray" />} title="Recently viewed">
                <Board type="primary" title="My trello board" img={'https://d2k1ftgv7pobq7.cloudfront.net/images/backgrounds/gradients/rainbow.svg'} />
                <Board type="primary" title="My trello board" img={'https://d2k1ftgv7pobq7.cloudfront.net/images/backgrounds/gradients/rainbow.svg'} />
            </BoardContainer> */}
      {/* Your Workspace */}
      <BoardWorkspace label="your workspace">
        <BoardContainer icon={<Rocket />} title="Trello Workspace">
          {board.map((b: any) => {
            return (
              <BoardItem
                href={`/board/${b._id}`}
                key={b._id}
                type="primary"
                title={b.title}
                img={b.cover}
              />
            );
          })}
          <Popover
            trigger={
              <Button
                className="justify-center rounded-md dark:bg-card"
                title="Create new board"
              />
            }
            side="right"
            sideOffset={10}
          >
            <div className="dark:bg-background">
              <CreateBoard />
            </div>
          </Popover>
        </BoardContainer>
      </BoardWorkspace>
      {/* Guest Workspace */}
      {/* <BoardWorkspace label="guest workspace" icon={<Info size={18} />}>
                <BoardContainer icon={<ChartColumnBig />} title="Trello Templates">
                    <Board type="primary" title="My trello board" img={'https://d2k1ftgv7pobq7.cloudfront.net/images/backgrounds/gradients/rainbow.svg'} />
                </BoardContainer>
            </BoardWorkspace> */}
    </div>
  );
};

export default Boards;
