
import { useEffect, useState } from 'react'
import { connect } from 'react-redux'
import authActions from '../redux/actions/authActions'
import Notification from './Notification'


const NotificationsPanel = (props) => {

    const { userLogged, checkNotifications, notifButton, setNotifButton } = props
    const [notificationsState, setNotificationsState] = useState([])

    let classNotificationPanel = notifButton ? 'notificationPanelOpen' : 'notificationPanelClose'

    useEffect(() => {
        activeCheckNotifications()
        const reloadNotifications = setInterval(() => {
            activeCheckNotifications()
        }, 4000)
        return () => { clearInterval(reloadNotifications) }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const activeCheckNotifications = async () => {
        if (props.userLogged) {
            const response = await checkNotifications(userLogged)
            if (response) {
                setNotificationsState(response)
            }
        }
    }
    return (
        <div className={classNotificationPanel}>
        {/* <div className="notificationPanelOpen"> */}
            <div className="notificationsHeader">
                <span className="notificationsTitle">Notifications</span>
                <span className="material-icons-outlined closeNotifPanel" onClick={() => setNotifButton(false)}>close</span>

            </div>
            {
                notificationsState.length > 0
                && notificationsState.map((notif, i) => {
                    return <Notification key={i} notif={notif} setNotificationsState={setNotificationsState} notificationsState={notificationsState} />
                })
            }
        </div>
    )
}

const mapStateToProps = state => {
    return {
        userLogged: state.authReducer.userLogged
    }
}

const mapDispatchToProps = {
    checkNotifications: authActions.checkNotifications,
}

export default connect(mapStateToProps, mapDispatchToProps)(NotificationsPanel)

