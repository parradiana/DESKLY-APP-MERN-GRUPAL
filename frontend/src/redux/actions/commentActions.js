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
const commentActions = {
    
    getComments: (taskId) => {
        return async (dispatch, getState) => {
            try {
                const response = await axios.get('https://desklyapp.herokuapp.com/api/task/comment/' + taskId)
                if (!response.data.success) {
                    desklyAlert('Error', response.data.response, 'danger')
                } else {
                    return response.data.response.comments
                }
            } catch (error) {
                console.log(error)
                desklyAlert('Error', 'An error has occurred on the server, try later!', 'danger')
            }
        }
    },

    addComment: (taskId, newComment, userToken) => {
        return async (dispatch, getState) => {
            try {
                const response = await axios.post('https://desklyapp.herokuapp.com/api/task/comment/' + taskId, newComment, {
                    headers: { 'Authorization': 'Bearer ' + userToken }
                })
                if (!response.data.success) {
                    desklyAlert('Error', response.data.response, 'danger')
                } else{
                    return response.data.response.comments
                }
            } catch (error) {
                console.log(error)
                desklyAlert('Error', 'An error has occurred on the server, try later!', 'danger')
            }
        }
    },

    editComment: (taskId, editedComment) => {
        return async (dispatch, getState) => {
            try {
                const response = await axios.put('https://desklyapp.herokuapp.com/api/task/comment/' + taskId, editedComment)
                if (!response.data.success) {
                    desklyAlert('Error', response.data.response, 'danger')
                } else{
                    return response.data.response.comments
                }
            } catch (error) {
                console.log(error)
                desklyAlert('Error', 'An error has occurred on the server, try later!', 'danger')

            }
        }
    },

    deleteComment: (commentId) => {
        return async (dispatch, getState) => {
            try {
                const response = await axios.delete('https://desklyapp.herokuapp.com/api/task/comment/' + commentId)
                if (!response.data.success) {
                    desklyAlert('Error', response.data.response, 'danger')
                } else{
                    return response.data.response.comments
                }
            } catch (error) {
                console.log(error)
                desklyAlert('Error', 'An error has occurred on the server, try later!', 'danger')
            }
        }
    }
}

export default commentActions