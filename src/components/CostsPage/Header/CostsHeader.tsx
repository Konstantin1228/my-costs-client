import React, { useEffect, useState, MutableRefObject, useRef } from 'react'
import { useStore } from 'effector-react'
import { $totalPrice, createCost } from '../../../context'
import { ICostHeaderProps } from '../../../types'
import { countTotalPrice } from '../../../utils/arrayUtils'
import Spinner from '../../Spinner/Spinner'
import { validationInputs } from '../../../utils/validation'
import { getAuthDataFromLs, handleAlertMessage } from '../../../utils/auth'
import { createCostFx } from '../../../api/CostsClient'
import "./style.css"

const CostsHeader = ({ costs }: ICostHeaderProps) => {
    const [spinner, setSpinner] = useState(false)

    const textRef = useRef() as MutableRefObject<HTMLInputElement>
    const priceRef = useRef() as MutableRefObject<HTMLInputElement>
    const dateRef = useRef() as MutableRefObject<HTMLInputElement>

    const totalPrice = useStore($totalPrice)

    useEffect(() => {
        countTotalPrice(costs)
    }, [costs])

    const formSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        setSpinner(true)

        const textInputValue = textRef.current.value
        const priceInputValue = priceRef.current.value
        const dateInputValue = dateRef.current.value

        if (!validationInputs(textRef, priceRef, dateRef)) {
            setSpinner(false)
            return
        }

        const authData = getAuthDataFromLs()

        const cost = await createCostFx({
            url: "/cost",
            cost: {
                text: textInputValue,
                price: parseInt(priceInputValue),
                date: dateInputValue
            },
            token: authData._acces_token
        })
        console.log(cost)
        setSpinner(false)

        if (!cost) return

        createCost(cost)
        handleAlertMessage({ alertText: "Расход успешно создан", alertStatus: "success" })
    }

    return (
        <div className="costsHeader">
            <form onSubmit={formSubmit} className='d-flex mb3'>
                <div className="formItem">
                    <span className='mb-3'>Куда было потрачено:</span>
                    <input ref={textRef} type="text" className='form-control' />
                </div>
                <div className="formItem">
                    <span className='mb-3'>Сколько было потрачено:</span>
                    <input ref={priceRef} type="text" className='form-control' />
                </div>
                <div className="formItem">
                    <span className='mb-3'>Когда было потрачено:</span>
                    <input ref={dateRef} type="date" className='form-control' />
                </div>
                <button className='btn btn-primary auth-btn'>{spinner ? <Spinner top={5} left={20} /> : "Добавить расход"}</button>
            </form>
            <div style={{ textAlign: "end", marginBottom: 10 }}>
                Итого:
                <span>{isNaN(parseInt(String(totalPrice))) ? 0 : parseInt(String(totalPrice))}</span>
                p.
            </div>
        </div>
    )
}

export default CostsHeader