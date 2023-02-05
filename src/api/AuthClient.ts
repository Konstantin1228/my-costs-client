import { setAuth, setUserName } from "../context/auth"
import { handleAxiosError } from "../utils/errors"
import api from "./axiosClient"

export class AuthClient {
    static async login(userName: string, password: string) {
        try {
            const result = await api.post("/auth/login", { userName, password })
            if (result.status === 200) {
                setAuth(true)
                localStorage.setItem("auth", JSON.stringify(result.data))
                setUserName(userName)
                return true
            }
            return false
        } catch (error) {
            handleAxiosError(error)
        }
    }

    static async registration(userName: string, password: string) {
        try {
            const result = await api.post("/auth/registration", { userName, password })
            console.log(result);
            if (result.status === 201) {
                setAuth(true)
                localStorage.setItem("auth", JSON.stringify(result.data))
                setUserName(userName)
                return true
            }
            return false
        } catch (error) {
            handleAxiosError(error)
        }
    }
}