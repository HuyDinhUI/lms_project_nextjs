import { BoardService } from "@/services/board.service";
import { Board, Card, Column } from "@/types/board.type";
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { v4 as uuid } from "uuid";

const board: Board = {
  _id: "",
  title: "",
  cover: "",
  visibility: "",
  ownerIds: [],
  memberIds: [],
  columns: [],
  columnsOrder: [],
};

const columns: Column[] = [];

export const fetchBoard = createAsyncThunk("board/get", async (id: any) => {
  const res = await BoardService.getBoard(id);
  return res.data;
});

const boardSlice = createSlice({
  name: "board",
  initialState: {
    board,
    columns,
    loading: false,
    error: "",
  },
  reducers: {
    //================================================//
    //================== BOARD =======================//
    //================================================//

    setBoard(state, action) {
      state.board = action.payload;
    },

    //=================================================//
    //================== COLUMN =======================//
    //=================================================//

    setColumn(state, action) {
      state.columns = action.payload;
    },

    addColumn(state, action) {
      state.columns = [
        ...state.columns,
        {
          _id: uuid(),
          title: action.payload.title,
          boardId: action.payload.boardId,
          cards: [],
        },
      ];
    },

    editLabel(state, action) {
      state.columns = state.columns.map((col) =>
        col._id === action.payload.columnId
          ? {
              ...col,
              title: action.payload.value,
            }
          : col
      );
    },

    deleteColumn(state, action) {
      state.columns = state.columns.filter(
        (col) => col._id !== action.payload.columnId
      );
    },

    //===============================================//
    //================== CARD =======================//
    //===============================================//

    addCard(state, action) {
      state.columns = state.columns.map((col) =>
        col._id === action.payload.columnId
          ? {
              ...col,
              cards: [
                ...col.cards,
                {
                  _id: uuid(),
                  label: action.payload.label,
                  status: false,
                  columnId: col._id,
                  cover: "",
                  description: "",
                  attachments: [],
                  checklist: [],
                  joined: [],
                  FE_placeholderCard: false,
                },
              ],
            }
          : col
      );
    },

    updateCard(state, action) {
      state.columns = state.columns.map((col) =>
        col._id === action.payload.columnId
          ? {
              ...col,
              cards: col.cards.map((c: Card) =>
                c._id === action.payload.cardId
                  ? { ...c, [action.payload.field]: action.payload.value }
                  : c
              ),
            }
          : col
      );
    },

    deleteCard(state, action) {
      state.columns = state.columns.map((col) =>
        col._id === action.payload.columnId
          ? {
              ...col,
              cards: col.cards.filter(
                (c) => c._id !== action.payload.cardId
              ),
            }
          : col
      );
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(fetchBoard.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchBoard.fulfilled, (state, action) => {
        state.loading = false;
        state.board = action.payload;
        state.columns = action.payload.columnsOrder;
      })
      .addCase(fetchBoard.rejected, (state) => {
        state.loading = false;
      });
  },
});

export const {
  setBoard,
  addColumn,
  setColumn,
  editLabel,
  deleteColumn,
  addCard,
  updateCard,
  deleteCard,
} = boardSlice.actions;

export default boardSlice.reducer;
