import axios from "axios"
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
const boardActions = {
    deleteBoard: (id,token) => {
        return async (dispatch, getState) => {
            try {
                const response = await axios.delete("https://desklyapp.herokuapp.com/api/board/" + id, {headers: {
                    'Authorization': 'Bearer ' + token
                }})
                if (!response.data.success) {
                    desklyAlert('Oops', response.data.error, 'danger')
                } else {
                    dispatch({type: 'DELETE_BOARDS', payload:response.data.response._id})
                }
            } catch (error){
                desklyAlert('Error','An error has occurred on the server, try later!', 'danger')
                console.log(error)
            }
        }
    },
    addBoard: (board) => {
        const { title, description, token } = board
        try {
            return async (dispatch, getState) => {
                const response = await axios.post('https://desklyapp.herokuapp.com/api/board', { title, description }, {
                    headers: {
                        'Authorization': 'Bearer ' + token
                    }
                })
                if (!response.data.success) {
                    desklyAlert('Oops', response.data.error, 'danger')
                } else {
                    dispatch({ type: 'ADD_BOARDS', payload: response.data.response })
                }
            }
            // eslint-disable-next-line
        } catch (error) {
            desklyAlert('Error','An error has occurred on the server, try later!', 'danger')
            console.log(error)
        }
    },
    editBoard:(id, updateInput, token) => {
        const {title, description} = updateInput
        try {
            return async (dispatch, getState) => {
                const response = await axios.put("https://desklyapp.herokuapp.com/api/board/" + id, {title, description} ,{headers: {
                    'Authorization': 'Bearer ' + token
                }})
                if (!response.data.success) {
                    desklyAlert('Oops', response.data.error, 'danger')
                } else {
                    return response.data.response
                }
            }
            // eslint-disable-next-line
        } catch (error) {
            desklyAlert('Error','An error has occurred on the server, try later!', 'danger')
            console.log(error)
        }
    },
    getBoardsFromUser: (token) => {
        try {
            return async (dispatch, getState) => {
                const response = await axios.get("https://desklyapp.herokuapp.com/api/board", {
                    headers: {
                        'Authorization': 'Bearer ' + token
                    }
                })
                if (!response.data.success) {
                    desklyAlert('Oops', response.data.error, 'danger')
                } else {
                    dispatch({ type: 'GET_BOARDS', payload: response.data.response })
                }
            }
            // eslint-disable-next-line
        } catch (error) {
            desklyAlert('Error','An error has occurred on the server, try later!', 'danger')
            console.log(error)
        }
    },
    getUsersFromBoard: (idBoard) => {
        try {
            return async (dispatch, getState) => {
                const response = await axios.get("https://desklyapp.herokuapp.com/api/board/" +idBoard)
                if (!response.data.success) {
                    desklyAlert('Error', response.data.response, 'danger')
                } else {
                    return response.data.users
                }
            }
            // eslint-disable-next-line
        } catch (error) {
            desklyAlert('Error','An error has occurred on the server, try later!', 'danger')
            console.log(error)
        }
    },
    userAdmin: (email,id) => {
        try{
            return async (dispatch, getState) => {
                const response = await axios.put("https://desklyapp.herokuapp.com/api/boardAdmins/" +email, {id})
                return response.data.admins.admins
            }
            // eslint-disable-next-line
        }catch(error){
            console.log(error)
        }
    },
    getAdminsFromBoard: (email) => {
        try{
            return async (dispatch, getState) => {
                const response = await axios.get("https://desklyapp.herokuapp.com/api/boardAdmins/" +email)
                return response.data.response.admins
            }
            // eslint-disable-next-line
        }catch(error){
            console.log(error)
        }
    },
    getBoard: (id) => {
        try{
            return async (dispatch, getState) => {
                const response = await axios.get("https://desklyapp.herokuapp.com/api/boardSingle/"+id)
                return response.data.response
            }
            // eslint-disable-next-line
        }catch(error){
            console.log(error)
        }
    } 
}

export default boardActions