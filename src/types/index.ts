export interface IAlert {
    alertText: string
    alertStatus: string
}

export interface IAlertProps {
    props: IAlert
}

export interface ISpinnerprops {
    top: number
    left: number
}

export interface ICostHeaderProps {
    costs: ICost[]
}

export interface ICost {
    text: string
    price: number
    date: Date | string
    _id?: number | string
}

export interface IBaseEffectArgs {
    url: string
    token: string
}

export interface ICreateCost extends IBaseEffectArgs {
    cost: ICost
}

export interface IDeleteCost extends IBaseEffectArgs {
    id: string | number
}

export interface IUpdateCost extends IBaseEffectArgs {
    cost: ICost
    id: string
}

export interface IRefreshToken extends IBaseEffectArgs {
    userName: string
}

export interface IHandleAxiosErrorPayload {
    type: string
    craeteCost?: Partial<ICreateCost>
    getCosts?: Partial<IBaseEffectArgs>
    deleteCost?: Partial<IDeleteCost>
    updateCost?: Partial<IUpdateCost>
}

export interface ICostItemProps {
    cost: ICost
    index: number
}

