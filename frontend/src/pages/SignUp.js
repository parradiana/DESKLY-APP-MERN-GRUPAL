import { useState } from "react"
import { connect } from "react-redux"
import authActions from '../redux/actions/authActions'
import GoogleLogin from 'react-google-login'
import { NavLink } from 'react-router-dom'
// import FacebookLogin from 'react-facebook-login'
import { store } from 'react-notifications-component'
import { FcGoogle } from 'react-icons/fc'
import { BsEyeSlash, BsEye } from 'react-icons/bs'
import { ImKey } from 'react-icons/im'
import { HiMail } from 'react-icons/hi'
import {FaUser, FaRegImage} from 'react-icons/fa'

const SignUp = (props) => {
    const [user, setUser] = useState({ firstName: '', lastName: '', email: '', password: '', img: '' })
    const [mistakes, setMistakes] = useState({ firstName: '', lastName: '', email: '', password: '', img: '' })
    const [oculto, setOculto] = useState(true)
    const readInputUser = (e) => {
        setUser({
            ...user,
            [e.target.name]: e.target.value
        })
    }
    const sendValueUser = async (e = null, googleUser = null, userFacebook = null) => {
        setMistakes({ firstName: '', lastName: '', email: '', password: '', img: '' })
        e && e.preventDefault()
        let userGen = e ? user : googleUser || userFacebook
        console.log(userGen)
        if (Object.values(userGen).some(value => value === "")) {
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
        } else {
            const response = await props.signUpUser(userGen)
            console.log(response)
            if (response) {
                response.details.map(error => setMistakes((prevState) => {
                    return { ...prevState, [error.context.label]: error.message }
                }))
            }
        }
    }
    const responseGoogle = (response) => {
        console.log(response.profileObj)
        const { givenName, familyName, email, googleId, imageUrl } = response.profileObj
        sendValueUser(null, { firstName: givenName, lastName: familyName, email, password: "Aa" + googleId, img: imageUrl, google: true })
    }
    // const responseFacebook = (response) => {
    //     const { name, email, id, picture } = response
    //     sendValueUser(null, { firstName: name, lastName: null, email, password: "Aa" + id, img: picture.data.url, facebook: true })
    // }

    return (
        <div  className={`contenedorLogUp
         ${props.buttonanimation === false ? 'registerAnimation': props.buttonanimation === true  && 'registerAnimation2'}
         ${props.buttonSign ? 'responsiveAnimationUp': 'responsiveAnimationUp2'}

         `}>
            {/* <div className="contenedorHeroLogIn">
                <div className="logoFooter">
                    <div className="desklyLogo" style={{ backgroundImage: "url('https://webdesing881317710.files.wordpress.com/2021/05/desklylogo.png')" }}></div>
                    <h1>DESKLY</h1>
                </div>
                <div className="infoRegister">
                    <h2>Log In!</h2>
                    <button className="buttonSignUp">Log In</button>
                </div>
            </div> */}
            <div className={`contenedorFormularioLogUp`}>
                <h2>Create account in DESKLY</h2>
                <span className="contenedorinput"> <FaUser className="inputIcons" />
                    <input type="text" placeholder="Name"
                        onChange={readInputUser} value={user.firstName} name="firstName" />
                </span>
                {mistakes.firstName ? <h6>{mistakes.firstName}</h6> : null}
                <span className="contenedorinput"><FaUser className="inputIcons" />
                    <input type="text" placeholder="Last Name"
                        onChange={readInputUser} value={user.lastName} name="lastName" />
                </span>
                {mistakes.lastName ? <h6>{mistakes.lastName}</h6> : null}
                <span className="contenedorinput"><HiMail className="inputIcons" />
                    <input type="text" placeholder="Email"
                        onChange={readInputUser} value={user.email} name="email" />
                </span>
                {mistakes.email ? <h6>{mistakes.email}</h6> : null}
                <span className="contenedorinput"><ImKey className="inputIcons" /><input type={oculto ? "password" : "text"} placeholder="Password" name="password" onChange={readInputUser} autoComplete="off" />
                    <div onClick={() => setOculto(!oculto)} className="divEye">
                        {oculto ? <BsEyeSlash className="inputIconsEye" /> : <BsEye className="inputIconsEye" />}
                    </div>
                </span>
                {mistakes.password ? <h6>{mistakes.password}</h6> : null}
                <span className="contenedorinput"><FaRegImage className="inputIcons" />
                    <input type="text" className="input image" placeholder="Please, enter the URL of your picture"
                        onChange={readInputUser} value={user.img} name="img" />
                </span>
                {mistakes.img ? <h6>{mistakes.img}</h6> : null}
                <button className="buttonEnviar" onClick={sendValueUser}>Register</button>
                <GoogleLogin
                    clientId="81825591921-b59konhcf778namaal4as1c11cpavod7.apps.googleusercontent.com"
                    render={renderProps => (
                        <button onClick={renderProps.onClick} disabled={renderProps.disabled} className="bGoogle"><FcGoogle />Register with Google</button>
                    )}
                    onSuccess={responseGoogle}
                    onFailure={responseGoogle}
                    cookiePolicy={'single_host_origin'}
                />
            </div>
            {/* <FacebookLogin
                appId="525627921786555"
                autoLoad={false}
                fields="name,email,picture"
                callback={responseFacebook}
                textButton="Sign Up with Facebook"
                icon="fa-facebook"
            /> */}

        </div>
    )
}

const mapDispatchToProps = {
    signUpUser: authActions.signUpUser

}

export default connect(null, mapDispatchToProps)(SignUp)