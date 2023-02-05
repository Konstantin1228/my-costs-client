import React, { useState, useRef, MutableRefObject } from 'react'
import { Link, useNavigate } from "react-router-dom"
import { AuthClient } from '../../api/AuthClient'
import { setAlert } from '../../context/alert'
import { handleAlertMessage } from '../../utils/auth'
import Spinner from '../Spinner/Spinner'
import "./styles.css"

const AuthPage = ({ type }: { type: "login" | "registration" }) => {
    const [spinner, setSpinner] = useState(false)
    const userNameRef = useRef() as MutableRefObject<HTMLInputElement>
    const passwordRef = useRef() as MutableRefObject<HTMLInputElement>

    const currentAuthTitle = type === "login" ? "Войти" : "Регистрация"
    const navigate = useNavigate()

    const handleAuthResponse = (result: boolean | undefined, navigatePath: string, alertText: string) => {
        setSpinner(false)

        if (!result) {
            return
        }

        navigate(navigatePath)
        handleAlertMessage({ alertText, alertStatus: 'success' });
    }

    const handleLogin = async (userName: string, password: string) => {
        if (!userName || !password) {
            setSpinner(false)
            handleAlertMessage({ alertText: "Заполните все поля", alertStatus: "warning" })
            return
        }

        const result = await AuthClient.login(userName, password)
        handleAuthResponse(result, "/costs", "Вход выполнен")
    }

    const handleRegistration = async (userName: string, password: string) => {
        if (!userName || !password) {
            handleAlertMessage({ alertText: "Заполните все поля", alertStatus: "warning" })
            setSpinner(false)
            return
        }

        if (password.length < 4) {
            setSpinner(false)
            handleAlertMessage({ alertText: "Пароль должен быть от 5 символов", alertStatus: "warning" })
            return
        }

        const result = await AuthClient.registration(userName, password)
        handleAuthResponse(result, "/costs", "Вы успешно зарегестрировались!")
    }

    const handleAuth = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setSpinner(true)
        switch (type) {
            case "login":
                handleLogin(userNameRef.current.value, passwordRef.current.value)
                return
            case "registration":
                handleRegistration(userNameRef.current.value, passwordRef.current.value)
                return
            default:
                break;
        }
    }

    return (
        <div className="container">
            <h1>{currentAuthTitle}</h1>
            <form onSubmit={handleAuth} action="">
                <label className='auth-label'>
                    Введите имя пользователя
                    <input ref={userNameRef} type="text" className='form-control' />
                </label>
                <label className='auth-label'>
                    Введите пароль
                    <input ref={passwordRef} type="password" className='form-control' />
                </label>
                <button className='btn btn-primary auth-btn'>{spinner ? <Spinner top={5} left={20} /> : currentAuthTitle}</button>
            </form>
            {type === "login" ?
                <div>
                    <span className='question_text'>Еще нет аккаунта?</span>
                    <Link to={"/registration"}>Зарегистрироваться</Link>
                </div>
                :
                <div>
                    <span className='question_text'>Уже есть аккаунт?</span>
                    <Link to={"/login"}>Войти</Link>
                </div>
            }
        </div>
    )
}

export default AuthPage