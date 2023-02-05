import { ICost } from '../../../types'
import CostsItem from '../CostsItem/CostsItem'

const CostsList = ({ costs }: { costs: ICost[] }) => {


    return (
        <ul className='list-group'>
            {costs.map((cost, index) =>
                <CostsItem cost={cost} index={index + 1} key={cost._id} />
            )}
        </ul>
    )
}

export default CostsList