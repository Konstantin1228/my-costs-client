import { useStore } from 'effector-react'
import React from 'react'
import { $auth, $userName } from '../../context/auth'
import { useTheme } from '../../hooks'
import { removeUser } from '../../utils/auth'

const Header = () => {
    const { switchTheme, theme } = useTheme()
    const userName = useStore($userName)
    const loggedIn = useStore($auth)
    return (

        <header className={`navbar navbar-dark bg-${theme === "dark" ? "dark" : "primary"}`}>
            <div className="container">
                <h1 style={{ color: "white" }}>Costs App</h1>
                {userName ? <h2 style={{ color: "white" }}>{userName}</h2> : ""}
                <button onClick={switchTheme} className={`btn btn-${theme === "dark" ? "dark" : "light"}`}>
                    {theme === "dark" ? "Go light" : "Go dark"}
                </button>
                {loggedIn && <button className='btn btn-primary' onClick={removeUser}>Выйти</button>}
            </div>
        </header >
    )
}

export default Header