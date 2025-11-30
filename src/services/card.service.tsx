import API from "@/utils/axios"

export const CardService = {
    getCard (id: string) {
        return API.get(`/card/get/card/${id}`)
    },

    createCard (data: any) {
        return API.post(`/card`,data)
    },

    updateOrderAndPosition (data: any) {
        return API.put(`/card/updateOrderAndPosition`, data)
    },

    updateContent (data: any) {
        return API.put(`/card/update/content`,data)
    },

    deleteCard (id: string) {
        return API.delete(`/card/delete/${id}`)
    }

}