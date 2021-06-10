import Footer from '../components/Footer'
import Header from '../components/Header'
import {Link} from 'react-router-dom'
import {connect} from 'react-redux'
const Home = (props) => {
    const {userLogged} = props
    return (
        <div className="homeScroll">
            <Header />
            {/* <div>
                <img className="imgParallax1" src="https://webdesing881317710.files.wordpress.com/2021/05/2cfb3ece-fe78-492e-85bd-5e35bd75c185.png" alt="" />
                <img className="imgParallax2" src="https://webdesing881317710.files.wordpress.com/2021/05/e8a83a15-29ba-4f32-8318-a0e72d7742d2.png" alt="" />
                <img className="imgParallax3" src="https://webdesing881317710.files.wordpress.com/2021/05/2cfb3ece-fe78-492e-85bd-5e35bd75c185.png" alt="" />
                <img className="imgParallax4" src="https://webdesing881317710.files.wordpress.com/2021/05/e8a83a15-29ba-4f32-8318-a0e72d7742d2.png" alt="" />
            </div> */}
            <div className="contenedorHome">
                <div className="contenedorHeroHome">
                    <div>
                        <div className="desklyLogo" style={{ backgroundImage: "url('https://webdesing881317710.files.wordpress.com/2021/05/desklylogo.png')" }}></div>
                        <h1>DESKLY</h1>
                    </div>
                    <p>Organize and manage work efficiently. Keep track of every proyect. Make your work flow</p>
                    {!userLogged && <Link to="/sign"><button className="buttonRegister">Join Us!</button></Link>}
                </div>
                <div className="imageHero" style={{ backgroundImage: "url('https://webdesing881317710.files.wordpress.com/2021/05/s.png')" }}></div>
            </div>
            <div>
                <div className="div2">
                    <h2>Free your mental space</h2>
                    <div className="hands" style={{ backgroundImage: "url('https://webdesing881317710.files.wordpress.com/2021/05/6bcf4f9e-7b00-412f-b336-3b6241b86cb3.png')" }}></div>
                    <div className="fraseHero2">
                        <div className="circulo"></div>
                        <p>Regain clarity and calmness by getting all those tasks out of your head and onto your to-do list (no matter where you are or what device you use).</p>
                    </div>
                </div>
                <svg>
                    <clipPath id="wave" clipPathUnits="objectBoundingBox">
                        <path className="st0" d="M1,0c0,0-0.3,0.1-0.5,0.1S0.3,0,0,0.1V1h1L1,0z" />
                    </clipPath>
                </svg>
                <div className="contenedorSemiCirculo">
                    <div className="elipse"><h2>DESKLY Tools</h2></div>
                </div>
                <div className="contenedorCirculosHerramientas">
                    <div className="desklyHerramientas1">
                        <div>
                            <span className="material-icons-outlined">dashboard</span>
                            <h3>Boards</h3>
                            <p>Helps you see the big picture</p>
                        </div>
                        <div>
                            <span className="material-icons-outlined">add</span>
                            <h3>Add</h3>
                            <p>Lets you capture and organize tasks in seconds</p>
                        </div>
                        <div>
                            <span className="material-icons-outlined">task_alt</span>
                            <h3>Tasks</h3>
                            <p>Paint a portrait of how small steps add up to big accomplishments</p>
                        </div>
                    </div>
                    <div className="desklyHerramientas2">
                        <div>
                            <span className="material-icons-outlined">edit</span>
                            <h3>Edit</h3>
                            <p> Did you mistook? Don’t worry! You can edit all your tasks as many times you need!</p>
                        </div>
                        <div>
                            <span className="material-icons-outlined">delete</span>
                            <h3>Delete</h3>
                            <p>Throw away any content you don’t longer need  with just one click</p>
                        </div>
                    </div>
                </div>
                <div className="contenedorElipse2">
                    <div className="contenedorSemiCirculo">
                        <div className="fabrica" style={{ backgroundImage: "url('https://webdesing881317710.files.wordpress.com/2021/05/77cbe11a-72a2-4433-8162-8524c770d4ea.png')" }}></div>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
}
const mapStateToProps = state => {
    return{
        userLogged: state.authReducer.userLogged
    }
}
export default connect(mapStateToProps)(Home)