import { Link } from 'react-router-dom'
import { connect } from 'react-redux'
import { RiInstagramFill } from 'react-icons/ri'
import { IoMdMail } from 'react-icons/io'
const Footer = (props) => {
    return (
        <footer>
            <div className="contenedorFooter">
                <div className="logoFooter">
                    <div className="desklyLogo" style={{ backgroundImage: "url('https://webdesing881317710.files.wordpress.com/2021/05/desklylogo.png')" }}></div>
                    <h1>DESKLY</h1>
                </div>
                <div className="redesSociales">
                    <h2>Social Media</h2>
                    <div>
                        <span class="material-icons-outlined iconsFooter">facebook</span>
                        <RiInstagramFill className="iconsFooter" />
                        <IoMdMail className="iconsFooter" />
                    </div>
                </div>
                <div className="navigation">
                    <h2>Navigation</h2>
                    <Link to="/" className="navFooter">Home</Link>
                    {props.userLogged && <>
                        <Link to="/myDesk" className="navFooter">My Desk</Link></>}
                    {!props.userLogged &&
                        <Link to="/sign" className="navFooter">Account</Link>}
                </div>
            </div>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320" className="svgFooter">
                <path fill="#615ee1" fillOpacity="1" d="M0,224L80,208C160,192,320,160,480,128C640,96,800,64,960,58.7C1120,53,1280,75,1360,85.3L1440,96L1440,320L1360,320C1280,320,1120,320,960,320C800,320,640,320,480,320C320,320,160,320,80,320L0,320Z"></path>
            </svg>
        </footer>
    )
}
const mapStateToProps = state => {
    return {
        userLogged: state.authReducer.userLogged,
    }
}
export default connect(mapStateToProps)(Footer)