import { createDomain } from "effector";

const auth = createDomain()

export const setAuth = auth.createEvent<boolean>()
export const setUserName = auth.createEvent<string>()

export const $auth = auth.createStore<boolean>(false)
    .on(setAuth, (_, value) => value)

export const $userName = auth.createStore<string>("")
    .on(setUserName, (_, value) => value)
