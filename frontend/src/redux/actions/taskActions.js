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
const taskActions = {
    tasksFromTaskplanner: (taskPlannerId) => {
        return async (dispatch, getState) => {
            try {
                const response = await axios.get('https://desklyapp.herokuapp.com/api/task/' + taskPlannerId)
                if (!response.data.success) {
                    desklyAlert('Error', response.data.response, 'danger')
                } else {
                    return response.data.response // Array de tasks segun el id del taskPlanner
                }
            } catch (error){
                console.log(error)
                desklyAlert('Error', 'An error has occurred on the server, try later!', 'danger')
            }
        }
    },

    addTask: (taskToAdd , token) => {
        return async (dispatch, getState) => {
            try {
                const response = await axios.post('https://desklyapp.herokuapp.com/api/task', taskToAdd, {headers: {
                    'Authorization': 'Bearer ' + token
                }})
                if (!response.data.success) {
                    desklyAlert('Error', response.data.response, 'danger')
                } else {
                    return response.data.response // Array de tasks segun el id del taskPlanner
                }            
            } catch (error) {
                console.log(error)
                desklyAlert('Error', 'An error has occurred on the server, try later!', 'danger')
            }
        }
    },

    editTask: (taskEditId, taskEdit) => {
        return async (dispatch, getState) => {
            try {
                const response = await axios.put('https://desklyapp.herokuapp.com/api/task/' + taskEditId, taskEdit)
                if (!response.data.success) {
                    desklyAlert('Error', response.data.response, 'danger')
                } else {
                    return response.data.response // Array de tasks segun el id del taskPlanner
                }            
            } catch (error) {
                console.log(error)
                desklyAlert('Error', 'An error has occurred on the server, try later!', 'danger')
            }
        }
    },

    deleteTask: (taskEditId, taskEdit) => {
        return async (dispatch, getState) => {
            try {
                const response = await axios.delete('https://desklyapp.herokuapp.com/api/task/' + taskEditId)
                if (!response.data.success) {
                    desklyAlert('Error', response.data.response, 'danger')
                } else {
                    return response.data.response // Array de tasks segun el id del taskPlanner
                }
            } catch (error) {
                console.log(error)
                desklyAlert('Error', 'An error has occurred on the server, try later!', 'danger')
            }
        }
    },

    recycleTask: (taskEditId, recycle) => {
        console.log(taskEditId, recycle)
        return async (dispatch, getState) => {
            try {
                const response = await axios.put('https://desklyapp.herokuapp.com/api/recycletask/' + taskEditId, recycle)
                if (!response.data.success) {
                    desklyAlert('Error', response.data.response, 'danger')
                } else {
                    return response.data.response // Array de tasks segun el id del taskPlanner
                }
            } catch (error) {
                console.log(error)
                desklyAlert('Error', 'Ha ocurrido un error en el servidor, intente más tarde!', 'danger')
            }
        }
    },
}

export default taskActions