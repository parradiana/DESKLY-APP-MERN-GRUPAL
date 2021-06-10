import { useState } from 'react'
import LogIn from '../components/LogIn'
import SignUp from './SignUp'
import {Link} from 'react-router-dom'
const Sign = () => {
    const [buttonSign, setButtonSign] = useState(true)
    const [buttonanimation, setbuttonanimation] = useState()

    let classFormSign = buttonSign ? 'signHeroRegistrar' : 'signHeroIniciarSesion'
    let classFormSign2 = buttonanimation === false ? 'signHeroRegistrarAnimation' : buttonanimation === true && 'signHeroIniciarSesionAnimation'

    const changeStatesButtons = (section) => {
        setButtonSign(!buttonSign)
        if (section === 'in') {
            setbuttonanimation(false)
        } else {
            setbuttonanimation(true)
        }
    }

    return (
        <>
            {/* <Header/> */}
            <div className="contenedorSign">
                <div className={`${classFormSign} ${classFormSign2}  `}>
                    {/* <button onClick={() => setButtonSign(!buttonSign)}   >Toca</button> */}

                    {
                        buttonSign
                            ? <div className={"contenedorHeroLogIn"}>
                                <Link to="/"><span className="material-icons-outlined homeIconMenu2">home</span></Link>       
                                <div className="logoFooter">
                                  <div className="desklyLogoSign" style={{ backgroundImage: "url('/assets/register.png')" }}></div>
                                  {/* <div className="desklyLogoSign" style={{ backgroundImage: "url(https://webdesing881317710.files.wordpress.com/2021/05/register.png)" }}></div> */}
                                </div>
                                <div className="infoRegister1">
                                    <h2>Already have an account?</h2>
                                    <button className="buttonSignUp" onClick={() => changeStatesButtons('in')}>Log in here!</button>
                                </div>
                            </div>
                            : <div className="contenedorHeroLogIn">
                                <Link to="/"><span className="material-icons-outlined homeIconMenu3">home</span></Link> 
                                <div className="logoFooter">
                                    {/* <div className="desklyLogoSign" style={{ backgroundImage: "url(https://webdesing881317710.files.wordpress.com/2021/05/register.png)" }}></div> */}
                                    <div className="desklyLogoSign" style={{ backgroundImage: "url('/assets/register.png')" }}></div>
                                </div>
                                <div className="infoRegister2">
                                    <h2> Dont have an account yet?</h2>
                                    <button className="buttonSignUp" onClick={() => changeStatesButtons('up')}>Register here!</button>
                                </div>
                            </div>
                    }


                </div>
                <SignUp buttonanimation={buttonanimation} buttonSign={buttonSign}/>
                <LogIn buttonanimation={buttonanimation} buttonSign={buttonSign}/>
            </div>
        </>
    )
}

export default Sign;