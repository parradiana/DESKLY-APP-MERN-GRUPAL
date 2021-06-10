import axios from 'axios'
import { store } from 'react-notifications-component'
const desklyAlert = async (alertTitle, alertMessage, alertType) => {
    await store.addNotification({
        title: alertTitle,
        message: alertMessage,
        type: alertType,
        insert: "top",
        container: "top-right",
        animationIn: ["animate__animated", "animate__flipInX"],
        animationOut: ["animate__animated", "animate__fadeOutDown"],
        dismiss: { duration: 3000, onScreen: true, pauseOnHover: true, showIcon: true }
    })
}

const authActions = {
    signUpUser: (user) => {
        return async (dispatch, getState) => {
            try {
                const response = await axios.post('https://desklyapp.herokuapp.com/api/newuser', user)
                if (response.data.validationError) {
                    return response.data.validationError
                } else if (response.data.error){
                    desklyAlert('Error', response.data.error, 'danger')
                } else {
                    dispatch({ type: 'LOG_USER', payload: response.data })
                    desklyAlert(response.data.response.firstName,`Welcome to Deskly!`, 'success')
                }
            } catch (error){
                console.log(error)
                desklyAlert('Error', 'An error has occurred on the server, try later!', 'danger')
            }
        }
    },

    signInUSer: (userToSignIn) => {
        return async (dispatch, getState) => {
            
            try {
                const response = await axios.post('https://desklyapp.herokuapp.com/api/login', userToSignIn)
                if (!response.data.success) {
                    desklyAlert('Oops', response.data.error, 'danger')
                } else {
                    dispatch({ type: 'LOG_USER', payload: response.data.response })
                    desklyAlert(response.data.response.firstName,`Welcome to Deskly!`, 'success')
                }
            } catch (error) {
                desklyAlert('Error','An error has occurred on the server, try later!', 'danger')
                console.log(error)
            }
        }
    },

    signInLocalStorage: (userLocalStorage) => {
        return async (dispatch, getState) => {
            try {
                const response = await axios.get('https://desklyapp.herokuapp.com/api/relogin', {
                    headers: { 'Authorization': 'Bearer ' + userLocalStorage }
                })
                dispatch({ type: 'LOG_USER', payload: { ...response.data.response, token: userLocalStorage } })
            } catch (error) {
                if (error.response.status === 401) {
                   desklyAlert('Error', 'Oops! You are not authorized to enter in this page!')
                }
                dispatch({ type: 'LOGOUT_USER' })
            }
        }
    },

    signOut: () => {
        return (dispatch, getState) => {
            desklyAlert('So long!', 'We hope to see you soon!', 'info')
            dispatch({ type: 'LOGOUT_USER' })
        }
    },

    inviteUserToBoard: (email, boardId) => {
        return async (dispatch, getSate) => {
            try {
                await axios.put('https://desklyapp.herokuapp.com/api/inviteuser/' + email, { boardId })
            } catch (error) {
                desklyAlert('Error','An error has occurred on the server, try later!', 'danger')
                console.log(error)
            }
        }
    },

    checkNotifications: (userLs) => {
        return async (dispatch, getSate) => {
            try {
                const response = await axios.get('https://desklyapp.herokuapp.com/api/checkNotifications', {
                    headers: { 'Authorization': 'Bearer ' + userLs.token }
                })
                return response.data.response
            } catch (error) {
                desklyAlert('Error','An error has occurred on the server, try later!', 'danger')
                console.log(error)
            }
        }
    },

    acceptJoinToBoard: (boardId, userLs) => {
        
        return async (dispatch, getSate) => {
            try {
                const response = await axios.get('https://desklyapp.herokuapp.com/api/notification/' + boardId, {
                    headers: { 'Authorization': 'Bearer ' + userLs.token }
                })
                dispatch({ type: 'ADD_BOARDS', payload: response.data.response.board })
                return response.data.response.notification
            } catch (error) {
                desklyAlert('Error','An error has occurred on the server, try later!', 'danger')
                console.log(error)
            }
        }
    },

    rejectJoinToBoard: (boardId, userLs) => {
        return async (dispatch, getSate) => {
            try {
                const response = await axios.get('https://desklyapp.herokuapp.com/api/reject/'+ boardId , {
                    headers: { 'Authorization': 'Bearer ' + userLs.token }
                })
                return response.data.response.notification
            } catch (err) {
                console.log(err)
            }
        }
    },

    setUserComponents: (token) => {
        return async (dispatch, getState) => {
            try {
                const response = await axios.get('https://desklyapp.herokuapp.com/api/usercomponents', {
                    headers: { 'Authorization': 'Bearer ' + token }
                })
                dispatch({ type: 'USER_COMPONENTS', payload: { ...response.data.response } })
            } catch (error){
                desklyAlert('Error','An error has occurred on the server, try later!', 'danger')
                console.log(error)
            }
        }
    },
}

export default authActions