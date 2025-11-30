import API from "@/utils/axios"

export const AuthService = {
    Login (data: any) {
        return API.post('/authorization/login',data)
    },

    Logout () {
        return API.delete('/authorization/logout')
    },

    Signup (data: any) {
        return API.post('/authorization.signup', data)
    },

    RefreshToken () {
        return API.put('/authorization/resfresh_token')
    }
}