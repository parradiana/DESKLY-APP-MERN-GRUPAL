import {NavLink, Link} from 'react-router-dom'
import NotificationsPanel from './NotificationsPanel'
import { connect } from 'react-redux'
import authActions from '../redux/actions/authActions'

const Header = (props) => {
    return (
        <div className="contenedorHeader">
            <NavLink exact to="/" className="navegadores">Home</NavLink>
            {props.userLogged && <>
                <NavLink to="/mydesk" className="navegadores">MyDesk</NavLink>
                <Link  to="/" className="navegadores"><span onClick={() => props.signOut()}> Log out</span></Link></>}
            {!props.userLogged && <>
                <NavLink to="/sign" className="navegadores">Account</NavLink>
                {/* <NavLink to="/sign" className="navegadores">Sign</NavLink> */}
                {/* <NavLink to="/signup" className="navegadores"> Sign Up</NavLink> */}
            </>}    
            
            <NotificationsPanel />
            <div className="semicirculo"></div>
        </div>
    )
}
const mapStateToProps = state => {
    return {
        userLogged: state.authReducer.userLogged,
    }
}
const mapDispatchToProps = {
    signOut: authActions.signOut
}

export default connect(mapStateToProps, mapDispatchToProps)(Header)

