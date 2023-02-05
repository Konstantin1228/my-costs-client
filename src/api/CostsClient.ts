import { createEffect } from "effector";
import { ICreateCost, IBaseEffectArgs, IRefreshToken, IDeleteCost, IUpdateCost } from "../types";
import { removeUser } from "../utils/auth";
import { handleAxiosError } from "../utils/errors";
import api from "./axiosClient"

export const createCostFx = createEffect(async ({ url, cost, token }: ICreateCost) => {
    try {
        const { data } = await api.post(url, { ...cost }, { headers: { "Authorization": `Bearer ${token}` } })
        return data
    } catch (error) {
        handleAxiosError(error, { type: "create", craeteCost: { cost } })
    }
})

export const updateCostFx = createEffect(async ({ url, cost, token, id }: IUpdateCost) => {
    try {
        const { data } = await api.patch(`${url}/${id}`, { ...cost }, { headers: { "Authorization": `Bearer ${token}` } })
        return data
    } catch (error) {
        handleAxiosError(error, { type: "update", updateCost: { cost, id } })
    }
})
export const getCostsFx = createEffect(async ({ url, token }: IBaseEffectArgs) => {
    try {
        const { data } = await api.get(url, { headers: { "Authorization": `Bearer ${token}` } })
        return data
    } catch (error) {
        handleAxiosError(error, { type: "get" })
    }
})

export const deleteCostsFx = createEffect(async ({ url, token, id }: IDeleteCost) => {
    try {
        await api.delete(`${url}/${id}`, { headers: { "Authorization": `Bearer ${token}` } })
        return true
    } catch (error) {
        handleAxiosError(error, { type: "delete", deleteCost: { id } })
    }
})


export const refreshTokenFx = createEffect(async ({ url, token, userName }: IRefreshToken) => {
    try {
        const result = await api.post(url, { refresh_token: token, userName })
        if (result.status === 200) {
            localStorage.setItem("auth", JSON.stringify({ ...result.data, userName }))

            return result.data._acces_token
        } else {
            removeUser()
        }
    } catch (error) {
        console.log(error);
    }
})