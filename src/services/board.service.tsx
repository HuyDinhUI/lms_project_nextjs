import API from "@/utils/axios";

export const BoardService = {
  getBoards() {
    return API.get("/boards");
  },

  createBoard(data: any) {
    return API.post("/boards", data);
  },

  getBoard(id: string) {
    return API.get(`/boards/${id}`);
  },
};
