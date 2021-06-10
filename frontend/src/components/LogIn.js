import React, { useState } from "react"
import { connect } from "react-redux"
import authActions from "../redux/actions/authActions"
import GoogleLogin from 'react-google-login'
// import FacebookLogin from 'react-facebook-login'
import { FcGoogle } from 'react-icons/fc'
import {BsEyeSlash, BsEye} from 'react-icons/bs'
import { ImKey } from 'react-icons/im'
import { HiMail } from 'react-icons/hi'
import { store } from 'react-notifications-component'
const SignIn = (props) => {
    const { userLogged } = props
    const [logIn, setLogIn] = useState({})
    const [oculto, setOculto] = useState(true)
    const input = e => {
        var value = e.target.value
        var prop = e.target.name
        setLogIn({
            ...logIn,
            [prop]: value,
            google: false,
            facebook: false,
        })
    }

    const log = async (e = null, googleUser = null, userFacebook = null) => {
        e && e.preventDefault()
        let user = e ? logIn : googleUser || userFacebook
        if (!user.email || !user.password) {
            store.addNotification({
                title: "Error",
                message: `All fields are required! `,
                type: "danger",
                insert: "top",
                container: "top-right",
                animationIn: ["animate__animated", "animate__flipInX"],
                animationOut: ["animate__animated", "animate__fadeOutDown"],
                dismiss: { duration: 3000, onScreen: true, pauseOnHover: true, showIcon: true }
            })
            return false
        }
        props.logIn(user)
    }

    const respuestaGoogle = (response) => {
        const { email, googleId } = response.profileObj
        log(null, { email: email, password: 'Aa' + googleId, google: true })
    }

    // const responseFacebook = (response) => {
    //     const {email, id} = response
    //     log(null, {email, password: "Aa"+ id, facebook: true})
    // }

    return (
        <div 
        className={
            `contenedorLogIn 
            ${props.buttonanimation === true? 'loginAnimation': props.buttonanimation === false&& 'loginAnimation2'}
            ${props.buttonSign ? 'responsiveAnimationIn':  'responsiveAnimationIn2'}
            
            `}>
            {/* <div className="contenedorHeroLogIn">
                <div className="logoFooter">
                    <div className="desklyLogo" style={{ backgroundImage: "url('https://webdesing881317710.files.wordpress.com/2021/05/desklylogo.png')" }}></div>
                    <h1>DESKLY</h1>
                </div>
                <div className="infoRegister">
                    <h2>Create an account!</h2>
                    <button className="buttonSignUp">Sign Up</button>
                </div>
            </div> */}
            {/* <div className={`contenedorFormularioLogIn ${props.buttonanimation === true && 'loginAnimation'}`}> */}
            <div className={`contenedorFormularioLogIn`}>
                <h2>Log in to DESKLY</h2>
                <span className="contenedorinput"><HiMail className="inputIcons"/><input type="text" name="email" placeholder="Email" onChange={input} autoComplete="off" /></span>
                <span className="contenedorinput"><ImKey className="inputIcons"/><input type={oculto ? "password" : "text"} name="password" placeholder="Password" onChange={input} autoComplete="off" />
                    <div onClick={() => setOculto(!oculto)} className="divEye">
                        {oculto ? <BsEyeSlash className="inputIconsEye" /> : <BsEye className="inputIconsEye"/>}
                    </div>
                </span>
                <button onClick={log} className="buttonEnviar">Log In</button>
                <GoogleLogin className="botonSignUp2"
                    render={renderProps => (
                        <button onClick={renderProps.onClick} disabled={renderProps.disabled} className="bGoogle"><FcGoogle />Log in with Google</button>
                    )}
                    clientId="81825591921-b59konhcf778namaal4as1c11cpavod7.apps.googleusercontent.com"
                    onSuccess={respuestaGoogle}
                    onFailure={respuestaGoogle}
                    cookiePolicy={'single_host_origin'}
                />
            </div>
            {/* <FacebookLogin
                appId="525627921786555"
                autoLoad={false}
                fields="name,email,picture"
                callback={responseFacebook}
                textButton="Log In with Facebook"
                icon="fa-facebook"
            /> */}
        </div>
    )
}

const mapStateToProps = state => {
    return {
        userLogged: state.authReducer.userLogged,
    }
}

const mapDispatchToProps = {
    logIn: authActions.signInUSer
}

export default connect(mapStateToProps, mapDispatchToProps)(SignIn)
