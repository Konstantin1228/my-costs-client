import { ISpinnerprops } from '../../types'
import "./style.css"

const Spinner = ({ top, left }: ISpinnerprops) => {
    return (
        <div style={{ top: `${top}px`, left: `${left}px` }} className={"spinner-border main-spinner"} role="status" />
    )
}

export default Spinner