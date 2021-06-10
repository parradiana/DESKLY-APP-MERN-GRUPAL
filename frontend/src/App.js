import './sofia.css'
import './css/lucas.css'
import './css/kevin.css'

import { BrowserRouter, Switch, Route, Redirect } from 'react-router-dom'

import Home from './pages/Home'
import MyDesk from './pages/MyDesk'
import Sign from './pages/Sign'
import SignUp from './pages/SignUp'
import Board from './components/Board'
import { connect } from 'react-redux'
import authActions from "./redux/actions/authActions"
import ReactNotification from 'react-notifications-component'

import 'react-notifications-component/dist/theme.css'


const App = (props) => {
  const { userLogged } = props
  if (userLogged) {
    // aca van links de logueados
  }
  else if (localStorage.getItem('token')) {
    props.reLoad(localStorage.getItem('token'))
    return null
  } else {
    // aca van links de deslogueados
  }
  return (
    <>
      <ReactNotification />
      <BrowserRouter>
        <Switch>
          <Route exact path="/" component={Home} />
          {userLogged && <Route path="/mydesk" component={MyDesk} />}
          <Route path="/board/:id" component={Board} />
          {!userLogged && <Route path="/sign" component={Sign} />}
          {!userLogged && <Route path="/signup" component={SignUp} />}
          <Redirect to="/" />
        </Switch>
      </BrowserRouter>
    </>
  )

}


const mapStateToProps = state => {
  return {
    userLogged: state.authReducer.userLogged,
  }
}
const mapDispatchToProps = {
  reLoad: authActions.signInLocalStorage
}
export default connect(mapStateToProps, mapDispatchToProps)(App)
