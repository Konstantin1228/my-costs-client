import { createDomain } from "effector";
import { ICost } from "../types";

const costs = createDomain()

export const setCosts = costs.createEvent<ICost[]>()
export const createCost = costs.createEvent<ICost>()
export const updateCost = costs.createEvent<ICost>()
export const removeCosts = costs.createEvent<string | number>()
export const setTotalPrice = costs.createEvent<number>()

const handleRemoveCost = (cost: ICost[], id: string | number) => cost.filter(el => el._id !== id)

const handleUpdateCost = (cost: ICost[], id: string | number, payload: Partial<ICost>) =>
    cost.map(el => {
        if (el._id === id) return { ...el, ...payload }
        return el
    })


export const $costs = costs.createStore<ICost[]>([])
    .on(createCost, (state, value) => [...state, value])
    .on(setCosts, (_, costs) => costs)
    .on(removeCosts, (state, id) => [...handleRemoveCost(state, id)])
    .on(updateCost, (state, cost) => [...handleUpdateCost(state, cost._id as string, { text: cost.text, price: cost.price, date: cost.date })])

export const $totalPrice = costs.createStore<number>(0)
    .on(setTotalPrice, (_, value) => value)
