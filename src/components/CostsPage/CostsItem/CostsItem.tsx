import { MutableRefObject, useRef, useState } from 'react'
import { deleteCostsFx, updateCostFx } from '../../../api/CostsClient'
import { removeCosts, updateCost } from '../../../context'
import { ICostItemProps } from '../../../types'
import { formatDate } from '../../../utils/arrayUtils'
import { getAuthDataFromLs, handleAlertMessage } from '../../../utils/auth'
import { validationInputs } from '../../../utils/validation'
import Spinner from '../../Spinner/Spinner'
import "./style.css"
const CostsItem = ({ cost, index }: ICostItemProps) => {
    const [edit, setEdit] = useState(false)
    const [deleteSpinner, setDeleteSpinner] = useState(false)
    const [editSpinner, setEditSpinner] = useState(false)

    const [newText, setNewText] = useState(cost.text)
    const [newPrice, setNewPrice] = useState<string | number>(cost.price)
    const [newDate, setNewDate] = useState(cost.date)
    const textRef = useRef() as MutableRefObject<HTMLInputElement>
    const priceRef = useRef() as MutableRefObject<HTMLInputElement>
    const dateRef = useRef() as MutableRefObject<HTMLInputElement>

    const changeText = (e: React.ChangeEvent<HTMLInputElement>) => setNewText(e.target.value)
    const changePrice = (e: React.ChangeEvent<HTMLInputElement>) => setNewPrice(e.target.value)
    const changeDate = (e: React.ChangeEvent<HTMLInputElement>) => setNewDate(e.target.value)

    const allowEditCost = () => setEdit(true)
    const cancelEditCost = () => {
        setEditSpinner(false)
        setEdit(false)
    }

    const deleteCost = async () => {
        setDeleteSpinner(true)
        const authData = getAuthDataFromLs()
        await deleteCostsFx({ url: "/cost", token: authData._acces_token, id: cost._id as string })
        setDeleteSpinner(false)
        removeCosts(cost._id as string)
        handleAlertMessage({ alertText: "Успешно удалено", alertStatus: "success" })
    }

    const handelEditCost = async () => {
        setEditSpinner(true)

        if (cost.text === newText && cost.date === newDate && +cost.price === +newPrice) {
            setEditSpinner(false)
            setEdit(false)
            return
        }

        if (!validationInputs(textRef, priceRef, dateRef)) {
            setEditSpinner(false)
            return
        }

        setEdit(false)
        const authData = getAuthDataFromLs()

        const editedCost = await updateCostFx({
            url: "/cost",
            token: authData._acces_token,
            cost: { text: newText, price: +newPrice, date: newDate },
            id: cost._id as string
        })

        setEditSpinner(false)
        if (!editedCost) return

        updateCost(editedCost)
        handleAlertMessage({ alertText: "Расход успешно изменен", alertStatus: "success" })
    }

    return (
        <li className='costsItem list-group-item d-flex justify-content-between align-items-center' id={cost._id as string}>
            <div className='cost-item-left'>
                <span>{index} Магазин</span>
                {edit ?
                    <input type="text" ref={textRef} onChange={(e) => changeText(e)} defaultValue={cost.text} className='form-control cost-item__shop-input' />
                    :
                    <span> "{cost.text}"</span>
                }
                {edit ?
                    <input type="date" ref={dateRef} onChange={(e) => changeDate(e)}
                        defaultValue={new Date(cost.date).toISOString().split("T")[0]} className='form-control cost-item__date-input' />
                    :
                    <span className='cost-date'>Дата: {formatDate(cost.date as string)}</span>
                }
            </div>
            <div className='cost-item-right d-flex align-items-center'>
                {edit ?
                    <input type="text" ref={priceRef} onChange={(e) => changePrice(e)} defaultValue={cost.price} className='form-control cost-item__price-input' />
                    :
                    <span style={{ marginRight: "10px" }}>Сумма {cost.price}</span>
                }
                {edit ?
                    <div className="btn__block-inner">
                        <button className='btn btn-success btn-save' onClick={handelEditCost}>{editSpinner ? <Spinner top={5} left={38} /> : "Сохранить"}</button>
                        <button className='btn btn-danger btn-cancel' onClick={cancelEditCost}>Отмена</button>
                    </div>
                    :
                    <>
                        <button className='btn btn-primary btn-edit' onClick={allowEditCost}>Изменить</button>
                        <button className='btn btn-danger btn-delete' onClick={deleteCost}>{deleteSpinner ? <Spinner top={5} left={7} /> : <span>&times;</span>}</button>
                    </>
                }
                {/* <button className='btn btn-primary btn-edit' onClick={() => setEdit(true)}>Изменить</button> */}
                {/* <button className='btn btn-danger btn-delete' onClick={deleteCost}><span>&times;</span></button> */}
            </div>
        </li>
    )
}

export default CostsItem