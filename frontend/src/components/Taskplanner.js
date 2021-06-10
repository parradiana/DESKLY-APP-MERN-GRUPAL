import { useEffect, useState } from 'react'
import taskActions from "../redux/actions/taskActions"
import { connect } from "react-redux"
import Task from "./Task"
import { IoSend } from 'react-icons/io5'
import Spinner from './helpers/Spinner'

const TaskPlanner = (props) => {
    const [allTasks, setAllTasks] = useState([])
    const [preloader, setPreloader] = useState(true)
    const [open, setOpen] = useState(true)
    const [newTitle, setNewTitle] = useState('')
    const [newTask, setNewTask] = useState('')
    const [loading, setLoading] = useState(true)
    const [editTitle, setEditTitle] = useState(true)
    const [progress, setProgress] = useState([])
    const [deleteButton, setDeleteButton] = useState(false)


    useEffect(() => {
        fetchAllTasks()
        const reloadTaskPlanner = setInterval(() => {
            fetchAllTasks()
        }, 2000)
        return () => { clearInterval(reloadTaskPlanner) }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const fetchAllTasks = async () => {
        const response = await props.tasksFromTaskplanner(props.taskplanner._id)
        var tasksProgress;
        if(response){
            tasksProgress = response.filter(task => task.verify)
            setProgress(tasksProgress)
        }
        setAllTasks(response)
        setPreloader(false)
    }

    const enter = (e, condition) => {
        if (condition === 'task' && e.key === 'Enter') {
            sendValues()
        } else if (condition === 'edit' && e.key === 'Enter') {
            props.edit(props.taskplanner._id, newTitle)
            setEditTitle(!editTitle)
        }
    }

    const sendValues = async () => {
        if (newTask.trim() !== "") {
            setLoading(false)
            await props.addTask({ title: newTask, taskplannerId: props.taskplanner._id }, props.userLogged.token)
            setOpen(!open)
            const tasks = await props.tasksFromTaskplanner(props.taskplanner._id)
            setAllTasks(tasks)
            setNewTask('')
            setLoading(true)
            setOpen(!open)
        }
    }

    return (
        <div className="taskPlanner" style={{ display: props.taskplanner.archived ? "none" : "inline-block" }}>
            <div className="taskPlannerList">
                <div style={{ display: deleteButton ? 'flex' : 'none' }} className="deleteTaskPlannerModal">
                    <span>Are you sure you want to delete this task planner? This cannot be undone.</span>
                    <div className="deleteButtonsModalTaskPlanner">
                        <button onClick={() => props.erase(props.taskplanner._id)}>Confirm</button>
                        <button onClick={() => setDeleteButton(false)}>Cancel</button>
                    </div>
                </div>
                <div className="contenedorOptionsHeader">
                    {/* <progress className="progress-done" value={progress.length} max={allTasks.length}></progress> */}
                </div>

                <div className="headerTaskPlanner">
                    <span onClick={() => setDeleteButton(true)} className="material-icons-outlined iconoTaskPlanner iconoTaskPlannerDelete" >delete</span>
                    {editTitle && <h3 style={{ cursor: (props.imOwner || props.imAdmin) && 'pointer' }} onClick={(props.imOwner || props.imAdmin) ? (() => { setEditTitle(!editTitle); setNewTitle(props.taskplanner.title) }) : null}>{props.taskplanner.title}</h3>}
                    {!editTitle &&
                        <>
                            <div className="contenedorEditTitle">
                                <input onKeyDown={newTitle.trim() ? (e) => { enter(e, 'edit') } : null} type="text" value={newTitle} onChange={(e) => setNewTitle(e.target.value)} />
                                <span onClick={newTitle.trim() ? (() => { props.edit(props.taskplanner._id, newTitle); setEditTitle(!editTitle) }) : null} class="material-icons-outlined iconoTaskPlanner">send</span>
                            </div>
                            <span onClick={() => setEditTitle(!editTitle)} className="material-icons-outlined iconoClose">close</span>
                        </>
                    }
                    {/* <div style={{ display: props.imOwner || props.imAdmin ? 'block' : 'none' }}>
                        <button  onClick={() =>props.archive(props.taskplanner._id)}>archived</button>

                    </div> */}
                </div>
                <div className="tasksScroll">
                    {
                        preloader
                            ? <Spinner />
                            : allTasks.map(task => <Task imAdmin={props.imAdmin} imOwner={props.imOwner} key={task._id} task={task} allTasks={allTasks} setAllTasks={setAllTasks} />)
                    }
                </div>
                <>
                    {open && <button className="buttonAddTask" onClick={() => setOpen(!open)}>Add new task</button>}
                    {
                        !open &&
                        <div className="contenedorAddList">
                            <input className="inputAddTask" onKeyDown={loading ? ((e) => enter(e, 'task')) : null} type="text" placeholder="Introduce a title for the new task" value={newTask} onChange={(e) => setNewTask(e.target.value)} />
                            <div>
                                <button className="buttonAddList" onClick={loading ? sendValues : null}>Add new task</button>
                                <span onClick={() => setOpen(true)} class="material-icons-outlined iconoAddListClose">close</span>
                            </div>
                        </div>
                    }
                </>
            </div>
        </div>
    )
}

const mapStateToProps = state => {
    return {
        userLogged: state.authReducer.userLogged,
    }
}

const mapDispatchToProps = {
    addTask: taskActions.addTask,
    tasksFromTaskplanner: taskActions.tasksFromTaskplanner,
    editTaskPlanner: taskActions.editTaskPlanner
}

export default connect(mapStateToProps, mapDispatchToProps)(TaskPlanner)
