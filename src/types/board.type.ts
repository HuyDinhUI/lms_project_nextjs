import { User } from "./user.type";

export interface Board {
  _id: string | null;
  title: string;
  cover: string;
  visibility: string;
  ownerIds: User[];
  memberIds: User[];
  columns: string[];
  columnsOrder: Column[];
}

export interface Column {
  _id: string;
  title: string;
  boardId: string;
  cards: Card[];
}

type checklist = {
  label: string;
  checked: boolean;
};

export interface Card {
  _id: string;
  label: string;
  status: boolean;
  columnId: string;
  cover: string;
  description: string;
  attachments: string[];
  checklist: checklist[];
  joined: User[];
  FE_placeholderCard?: boolean;
}



