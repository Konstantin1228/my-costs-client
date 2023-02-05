import { useEffect, useRef, useState, useMemo } from 'react'
import { useStore } from 'effector-react'
import { $costs, setCosts } from '../../context'
import { getCostsFx, refreshTokenFx } from '../../api/CostsClient'
import { getAuthDataFromLs } from '../../utils/auth'
import Spinner from '../Spinner/Spinner'
import CostsHeader from './Header/CostsHeader'
import CostsList from './CostsList/CostsList'

const CostsPage = () => {
    const [spinner, setSpinner] = useState(false)
    const store = useStore($costs)
    const shouldLoadCost = useRef(true)

    useEffect(() => {
        if (shouldLoadCost.current) {
            shouldLoadCost.current = false
            handleGetCosts()
        }
    }, [])

    const handleGetCosts = async () => {
        setSpinner(true)
        const authData = getAuthDataFromLs()

        refreshTokenFx({ url: "/auth/refresh", token: authData._acces_token, userName: authData.userName })
        const costs = await getCostsFx({
        url: "/cost",
        token: authData._acces_token
        })
        
        setSpinner(false)
        setCosts(costs)
    }

    return (
        <div className="container">
            <h2 style={{ textAlign: "center", marginBottom: 30 }}>Учет моих расходов</h2>
            {useMemo(() => <CostsHeader costs={store} />, [store])}
            <div style={{ position: "relative" }}>
                {spinner && <Spinner top={0} left={0} />}
                {useMemo(() => <CostsList costs={store} />, [store])}
                {(!spinner && !store.length) && <h2>Список расходов пуст</h2>}
            </div>
        </div>
    )
}

export default CostsPage