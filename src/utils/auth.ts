import { setCosts } from "../context"
import { setAlert } from "../context/alert"
import { setAuth, setUserName } from "../context/auth"
import { IAlert } from "../types"

export const removeUser = () => {
    localStorage.removeItem("auth")
    setAuth(false)
    setUserName("")
    setCosts([])
}

export const getAuthDataFromLs = () => {
    try {
        const lsData = JSON.parse(localStorage.getItem("auth") as string)

        if (!lsData) {
            removeUser()
            return
        }

        return lsData
    } catch (error) {
        console.log(error);
        removeUser()
    }
}

export const handleAlertMessage = (alert: IAlert) => {
    setAlert(alert)
    setTimeout(() => setAlert({ alertText: "", alertStatus: "" }), 3000)
}
