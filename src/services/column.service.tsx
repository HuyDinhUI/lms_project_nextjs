import API from "@/utils/axios"

export const ColumnService = {
    createColumn (data: any) {
        return API.post(`/column`, data)
    },

    updateColumn (data: any) {
        return API.put(`/column`, data)
    },

    deleteColumn (id: string) {
        return API.delete(`/column/${id}`)
    }

}