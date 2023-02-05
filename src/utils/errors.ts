import { AxiosError } from "axios";
import { createCostFx, deleteCostsFx, getCostsFx, refreshTokenFx, updateCostFx } from "../api/CostsClient";
import { ICost, IHandleAxiosErrorPayload } from "../types";
import { getAuthDataFromLs, handleAlertMessage, removeUser } from "./auth";
import { createCost, setCosts } from "../context";

export const handleAxiosError = async (error: unknown, payload: IHandleAxiosErrorPayload | null = null,) => {
    const errorMessage = ((error as AxiosError).response?.data as { message: string }).message || ((error as AxiosError).response?.data as { error: string }).error
    if (errorMessage) {
        if (errorMessage === "jwt expired") {
            const payloadData = payload as IHandleAxiosErrorPayload
            const authData = getAuthDataFromLs()
            console.log(authData);
            refreshTokenFx({ url: "/auth/refresh", token: authData.refresh_token, userName: authData.userName })
            if (payload !== null) {
                switch (payloadData.type) {
                    case "get":
                        const costs = await getCostsFx({
                            url: "/cost",
                            token: authData._acces_token
                        })
                        setCosts(costs)
                        return
                    case "delete":
                        await deleteCostsFx({
                            url: "/cost",
                            token: authData._acces_token,
                            id: payload.deleteCost?.id as string
                        })
                        return
                    case "create":
                        const cost = await createCostFx({
                            url: "/cost",
                            token: authData._acces_token,
                            cost: { ...payloadData.craeteCost?.cost } as ICost
                        })

                        if (!cost) {
                            return
                        }

                        createCost(costs)
                        handleAlertMessage({ alertText: "Расход успешно создан!", alertStatus: "success" })
                        return
                    case "update":
                        const updateCost = await updateCostFx({
                            url: "/cost",
                            token: authData._acces_token,
                            cost: { ...payloadData.updateCost?.cost } as ICost,
                            id: payloadData.updateCost?.id as string
                        })

                        if (!updateCost) {
                            return
                        }

                        updateCost(costs)
                        return
                    default:
                        break;
                }
            }
        } else {
            handleAlertMessage({ alertText: errorMessage, alertStatus: "warning" })
            removeUser()
        }
    } else {
        handleAlertMessage({ alertText: errorMessage, alertStatus: "warning" })
    }
}   