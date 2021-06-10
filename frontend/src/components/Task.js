import { useEffect, useState } from 'react'
import { connect } from 'react-redux'
import taskActions from '../redux/actions/taskActions'
import TaskModal from './TaskModal'
import { store } from 'react-notifications-component'

import Modal from 'react-modal';


const Task = (props) => {
    const { task, allTasks, setAllTasks, editTask, deleteTask, commentsUserArray } = props
    const { _id, title, verify } = task

    const [loading, setLoanding] = useState(true)

    const [show, setShow] = useState(false)

    const [editionTask, setEditionTask] = useState({ title, verify })

    const [editButton, setEditButton] = useState(false)

   

    // const [loading, setLoading] = useState(true)

    const getInput = e => { setEditionTask({ ...editionTask, title: e.target.value }) }

    useEffect(() => { sendEdit("verify") }, [editionTask.verify])

    const verifyTask = async (e) => {
        setLoanding(false)
        setEditionTask({ ...editionTask, verify: e })
        setLoanding(true)
    }

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
    const sendEdit = async (elementToEdit) => {
        if (editionTask.title.length > 0) {
            const response = await editTask(_id, editionTask)
            const editedTasks = allTasks.map(task => {
                if (task._id === response._id) {
                    return { ...task, [elementToEdit]: response[elementToEdit] }
                }
                return task
            })
            setAllTasks(editedTasks)
            setEditButton(false)
        }
    }

    const sendDeleteTask = async () => {
        setLoanding(false)
        const response = await deleteTask(_id)
        let arrayFiltered = allTasks.filter(task => task._id != response._id)
        desklyAlert('Info', 'Task deleted', 'info')
        setAllTasks(arrayFiltered)
        setLoanding(true)
    }

    let style = props.imOwner || props.imAdmin ? 'block' : 'none'

    return (
        <div className="overflowTask">
            <div className="contenedorTask" style={{ backgroundColor: verify ? 'lightgreen' : 'white' }}>
                <div>
                    <div className="taskInfo">
                        {task.verify ? <span class="material-icons-outlined iconoTaskPlanner" onClick={loading ? () => verifyTask(false) : null}>check_box</span> : <span className="material-icons-outlined iconoTaskPlanner" onClick={loading ? () => verifyTask(true) : null}>check_box_outline_blank</span>}
                        <span onClick={() => setShow(true)} className="taskTitle" style={{ display: editButton ? 'none' : 'block' }}>{title}</span>
                        <div className="contenedorInputEditTask" style={{ display: editButton ? 'flex' : 'none' }}>
                            <input className="inputEditTask" type="text" onChange={getInput} value={editionTask.title}></input><span onClick={() => sendEdit("title")} style={{ display: editButton ? 'block' : 'none' }} class="material-icons-outlined iconoTaskPlanner">send</span>
                        </div>
                        <div className="inputActions">
                            <span onClick={() => setEditButton(!editButton)} className="material-icons-outlined iconoTaskPlanner">edit</span>
                            <span onClick={loading ? sendDeleteTask : null} className="material-icons-outlined iconoTaskPlanner">delete</span>
                            {/* <input className="inputVerify" type="checkbox" onChange={verifyTask} checked={editionTask.verify}></input> */}
                        </div>
                    </div>
                </div>
                <TaskModal task={task} setShow={setShow} show={show} imOwner={props.imOwner} />
            </div>
        </div>
    )
}

const mapStateToProps = state => {
    return {
        commentsUserArray: state.authReducer.commentsUserArray,
    }
}

const mapDispatchToProps = {
    editTask: taskActions.editTask,
    deleteTask: taskActions.deleteTask,
}

export default connect(mapStateToProps, mapDispatchToProps)(Task)
