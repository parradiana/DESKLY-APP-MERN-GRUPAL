
import { connect } from 'react-redux'
import authActions from '../redux/actions/authActions'


const Notification = (props) => {

    const { userLogged, acceptJoinToBoard, rejectJoinToBoard, setNotificationsState, notificationsState, notif } = props


    const sendAcceptNotification = async (idNotif, resp) => {
        let response;
        let notificationsFiltered;
        if (resp) {
            response = await acceptJoinToBoard(idNotif, userLogged)
            notificationsFiltered = notificationsState.filter(notif => notif._id !== response)
        } else {
            notificationsFiltered = notificationsState.filter(notif => notif._id !== notif)
            response = await rejectJoinToBoard(idNotif, userLogged)
            // VER SI FUNCIONA
        }
        setNotificationsState(notificationsFiltered)
    }
    return (
        <div className="notification">
            <span>You have an invitation to the board "{notif.title}" of {notif.owner.firstName + ' ' + notif.owner.lastName} </span>
            <div>

                <button onClick={() => sendAcceptNotification(notif._id, true)}>Accept</button>
                <button onClick={() => sendAcceptNotification(notif._id, false)}>Decline</button>
            </div>
        </div>
    )
}

const mapStateToProps = state => {
    return {
        userLogged: state.authReducer.userLogged
    }
}

const mapDispatchToProps = {
    acceptJoinToBoard: authActions.acceptJoinToBoard,
    rejectJoinToBoard: authActions.rejectJoinToBoard
}

export default connect(mapStateToProps, mapDispatchToProps)(Notification)

