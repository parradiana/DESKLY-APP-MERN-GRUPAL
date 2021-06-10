import { useEffect, useState } from 'react'
import { connect } from 'react-redux'
import boardActions from '../redux/actions/boardActions'
import authActions from '../redux/actions/authActions'
import taskPlannerActions from '../redux/actions/taskPlannerActions'
import taskActions from "../redux/actions/taskActions"
import TaskPlanner from './Taskplanner'
import UserAdmin from './UserAdmin'
import { Link } from 'react-router-dom'
import LateralMenu from './LateralMenu'
import { store } from 'react-notifications-component'
import Archive from "./Archive"

import Modal from 'react-modal'

const Board = (props) => {
    const { boards, inviteUserToBoard, userLogged } = props
    const [allTasksPlanner, setAllTasksPlanner] = useState([])
    const [filterTaskplanners, setFilterTaskplanners] = useState([])
    const [open, setOpen] = useState(true)
    const [update, setUpdate] = useState(true)
    const [newTitle, setNewTitle] = useState('')
    const [newInvite, setNewInvite] = useState('')
    const idParams = props.match.params.id
    const [board, setBoard] = useState({})
    const [updateInput, setUpdateInput] = useState()
    const [openInvite, setOpenInvite] = useState(false)
    const [openArchive, setOpenArchive] = useState(false)
    const [boardUsers, setBoardUsers] = useState([])
    const [admins, setAdmins] = useState([])
    const [loading, setLoading] = useState(true)
    const [menuLateral, setMenuLateral] = useState(false)
    const [openModal, setOpenModal] = useState(false)

    let userFirstName;
    let userLastName;
    let userImg;
    if (!props.userLogged) {
        props.history.push('/')
    } else {
        userFirstName = props.userLogged.response ? `${props.userLogged.response.firstName}` : `${userLogged.firstName}`
        userLastName = props.userLogged.response ? props.userLogged.response.lastName || '' : userLogged.lastName || ''
        userImg = props.userLogged.response ? props.userLogged.response.img : userLogged.img
    }

    useEffect(() => {
        if (props.userLogged) {
            props.setUserComponents(props.userLogged.token)
        }
        if (props.boards.length === 0) {
            props.history.push('/myDesk')
        } else {
            setBoard(boards.find(board => String(board._id) === idParams))
        }
        tasksFetch()
        usersFetch()

        const reloadTaskPlanner = setInterval(() => {
            if (props.userLogged.token) {
                props.setUserComponents(props.userLogged.token)
            }
            usersFetch()
            tasksFetch()
        }, 5000)

        return () => { clearInterval(reloadTaskPlanner) }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const tasksFetch = async () => {
        const tasks = await props.getTaskPlannerFromBoard(idParams)
        if (tasks) {
            setAllTasksPlanner(tasks)
        }

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

    const enter = (e, condition) => {
        if (e.key === 'Enter' && condition === 'titleTaskPlanner') {
            sendValues()
        } else if (e.key === 'Enter' && condition === 'invite') {
            addUser()
        } else if (e.key === 'Enter' && condition === 'titleBoard') {
            editBoard()
        }
    }

    const sendValues = async () => {
        if (newTitle.trim() !== "") {
            setLoading(false)
            await props.addTaskPlanner({ title: newTitle, boardId: board._id }, props.userLogged.token)
            const tasks = await props.getTaskPlannerFromBoard(board._id)
            if (tasks) {
                setAllTasksPlanner(tasks)
                setOpen(!open)
                setNewTitle('')
                setLoading(true)
            }
        }
    }

    const addUser = () => {
        if (newInvite.trim()) {
            inviteUserToBoard(newInvite, board._id)
            desklyAlert('Success', 'Request Sent!', 'success')
            setNewInvite('')
        }
    }

    const edit = async (idTaskPlanner, titleTaskPlanner) => {
        await props.editTaskPlanner(idTaskPlanner, titleTaskPlanner)
        tasksFetch()
    }

    const erase = async (idTaskPlanner) => {
        await props.deleteTaskPlanner(idTaskPlanner)
        tasksFetch()
    }

    const readUpdateInput = (e) => {
        const field = e.target.name
        const value = e.target.value
        setUpdateInput({
            ...updateInput,
            [field]: value
        })
    }

    const deleteBoard = async () => {
        await props.deleteBoard(board._id, props.userLogged.token)
        desklyAlert('Info', 'Board deleted!', 'info')
        props.history.push('/myDesk')
    }

    const editBoard = async () => {
        setLoading(false)
        const response = await props.editBoard(board._id, updateInput, props.userLogged.token)
        setBoard(response)
        setUpdate(true)
        setLoading(true)
    }
    const usersFetch = async () => {
        const users = await props.getUsersFromBoard(idParams)
        const admins = await props.getAdminsFromBoard(idParams)
        setBoardUsers(users)
        setAdmins(admins)
    }

    const userAdmin = async (email) => {
        const admins = await props.userAdmin(email, idParams)
        setAdmins(admins)
        return admins
    }

    const archive = async (idTaskPlanner) => {
        await props.recycleTaskPlanner(idTaskPlanner, { archived: true })
        tasksFetch()
    }

    // const progressBar = async (allTasks) => {
    //     const task = await props.tasksFromTaskplanner(id)
    //     // console.log(task)
    // }

    let imAdmin = props.boardsAdminArray.some(boardId => boardId === String(board._id))
    let imOwner = props.boardsOwnerArray.some(boardId => boardId === String(board._id))

    const [visible, setVisible] = useState(false)

    const usersVisible = () => {
        setVisible(!visible)
    }
    return (
        <>
            <div className="contenedorBoard">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320">
                    <path fill="#f9d85f" fillOpacity="1" d="M0,96L60,96C120,96,240,96,360,117.3C480,139,600,181,720,186.7C840,192,960,160,1080,160C1200,160,1320,192,1380,208L1440,224L1440,0L1380,0C1320,0,1200,0,1080,0C960,0,840,0,720,0C600,0,480,0,360,0C240,0,120,0,60,0L0,0Z"></path>
                </svg>
                <LateralMenu setMenuLateral={setMenuLateral} menuLateral={menuLateral} />
                <div className="contenedorInfoBoard">
                    <div className="boardMarca">
                        <span className="hamburguerIcon" onClick={() => setMenuLateral(!menuLateral)}>&#9776; </span>
                        {update && <h2 className="logoLink" style={{ cursor: `${imOwner ? 'pointer' : ''}` }} onClick={imOwner ? (() => { setUpdate(!update); setUpdateInput({ title: board.title }) }) : null}>{board.title}</h2>}
                        {/* {update && <h2 className="logoLink" onClick={() => { setUpdate(!update); setUpdateInput({ title: board.title }) }}>{board.title}</h2>} */}
                        {!update &&
                            <div className="updateTitle">
                                <div className="contenedorInputEditTitleBoard">
                                    <input onKeyDown={loading ? ((e) => enter(e, 'titleBoard')) : null} type="text" name="title" value={updateInput ? updateInput.title : null} onChange={readUpdateInput} />
                                    <span onClick={editBoard} className="material-icons-outlined iconoUpdateBoard">send</span>
                                </div>
                                <span onClick={() => setUpdate(true)} className="material-icons-outlined iconoUpdateBoard">close</span>
                            </div>
                        }
                        <div className="userPicName">
                            <span className="userCompleteName">{`${userFirstName} ${userLastName}`}</span>
                            <div className="userPic" style={{ backgroundImage: `url('${userImg}')` }}></div>
                        </div>
                    </div>
                    <div className="contenedorMenuBoard">
                        <div className="contenedorInfoOwner">
                            {/* {(imAdmin || imOwner) && <button className="buttonOptionsBoard" onClick={() => setOpenArchive(!openArchive)}><span className="material-icons-outlined iconoBoard">add</span>Archive</button>} */}
                            {
                                openInvite &&
                                <div className="inviteUsersVentana">
                                    <span onClick={() => setOpenInvite(false)} className="material-icons-outlined closeGeneric">close</span>

                                    <h3>Invite a new member to the board</h3>

                                    <div className="contenedorInputInvite">
                                        <input onKeyDown={(e) => newInvite.trim() ? enter(e, 'invite') : null} type="text" placeholder="email@example.com" value={newInvite} onChange={(e) => setNewInvite(e.target.value)} autoComplete="off" />
                                        <span onClick={addUser} className="material-icons-outlined iconoTaskPlanner">send</span>
                                    </div>
                                </div>
                            }
                            {
                                imOwner &&

                                <>
                                    <button className="buttonOptionsBoard" onClick={() => setOpenModal(!openModal)}><span className="material-icons-outlined iconoBoard">delete</span>Delete</button>
                                    {
                                        openModal &&

                                        <Modal
                                            isOpen={openModal}
                                            // onAfterOpen={afterOpenModal}
                                            onRequestClose={() => setOpenModal(!openModal)}
                                            // style={customStyles}
                                            contentLabel="Example Modal"
                                            className="ModalTaskComponent"
                                            overlayClassName="OverlayModal"
                                        >
                                            <div className='modal modalBoard '>
                                                <span>Are you sure you want to delete this board? This cannot be undone.</span>
                                                <div className="deleteButtonsModalTaskPlanner">
                                                    <button onClick={deleteBoard}>Confirm</button>
                                                    <button onClick={() => setOpenModal(false)}>Cancel</button>
                                                </div>

                                            </div>

                                        </Modal>
                                    }


                                </>
                            }
                            {(imAdmin || imOwner) && <button className="buttonOptionsBoard" onClick={() => setOpenInvite(!openInvite)}><span className="material-icons-outlined iconoBoard">add</span>Invite</button>}
                            {/* {
                                openArchive &&
                                <div className="inviteUsersVentana"  >
                                    <h3>Archived taskplanners</h3>
                                    <div  style={{ display: 'flex', margin: '2rem' , flexDirection:"column"}}> <Archive  allTasksPlanner={allTasksPlanner}/></div>
                                </div>
                            } */}
                            {/* </>
                            } */}
                        </div>
                        {imOwner && <>
                            <div onClick={usersVisible} className="iconoVisible">
                                <span className="material-icons-outlined iconoUsers">people_outline</span>
                            </div>
                            <div className="ventanaUser" style={{ visibility: visible ? 'visible' : 'hidden' }} >
                                <span onClick={() => setVisible(false)} className="material-icons-outlined closeGeneric">close</span>

                                {
                                    boardUsers.length === 1
                                        ? <div className="noMembers">
                                            <p>There are no members yet</p>
                                        </div>
                                        : boardUsers.map((user, i) => {
                                            if (i) {
                                                return <UserAdmin key={i} admins={admins} idParams={idParams} userAdmin={userAdmin} user={user} visible={visible} setVisible={setVisible} />
                                            } else {
                                                return null
                                            }
                                        })
                                }
                            </div>
                        </>
                        }
                    </div>
                    <div className="contenedorTaskPlanner">
                        <div>
                            {
                                allTasksPlanner.map(taskplanner => <TaskPlanner imAdmin={imAdmin} imOwner={imOwner} erase={erase} edit={edit} key={taskplanner._id} setAllTasksPlanner={setAllTasksPlanner} taskplanner={taskplanner} />)
                            }
                        </div>
                        {(imOwner || imAdmin) &&
                            <>
                                {open && <button className="buttonTaskPlanner" onClick={() => setOpen(!open)}><span className="material-icons-outlined iconoAddList">add</span>Add new list</button>}
                                {
                                    !open &&
                                    <div className="contenedorAddList">
                                        <input className="inputAddList" onKeyDown={loading ? ((e) => enter(e, 'titleTaskPlanner')) : null} type="text" placeholder="Introduce a title for the new list" value={newTitle} onChange={(e) => setNewTitle(e.target.value)} />
                                        <div>
                                            <button className="buttonAddList" onClick={loading ? sendValues : null}>Add new list</button>
                                            <span onClick={() => setOpen(true)} className="material-icons-outlined iconoAddListClose">close</span>
                                        </div>
                                    </div>
                                }
                            </>
                        }
                    </div>
                </div>
                <div className="imgBoard" style={{ backgroundImage: "url('https://webdesing881317710.files.wordpress.com/2021/05/laptop-1.png')" }}></div>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320" className="svgWaveRosa">
                    <path fill="#ec9acf" fillOpacity="1" d="M0,160L21.8,170.7C43.6,181,87,203,131,186.7C174.5,171,218,117,262,106.7C305.5,96,349,128,393,160C436.4,192,480,224,524,234.7C567.3,245,611,235,655,229.3C698.2,224,742,224,785,218.7C829.1,213,873,203,916,208C960,213,1004,235,1047,256C1090.9,277,1135,299,1178,277.3C1221.8,256,1265,192,1309,154.7C1352.7,117,1396,107,1418,101.3L1440,96L1440,320L1418.2,320C1396.4,320,1353,320,1309,320C1265.5,320,1222,320,1178,320C1134.5,320,1091,320,1047,320C1003.6,320,960,320,916,320C872.7,320,829,320,785,320C741.8,320,698,320,655,320C610.9,320,567,320,524,320C480,320,436,320,393,320C349.1,320,305,320,262,320C218.2,320,175,320,131,320C87.3,320,44,320,22,320L0,320Z"></path>
                </svg>
            </div >

        </>
    )
}

const mapStateToProps = state => {
    return {
        userLogged: state.authReducer.userLogged,
        boards: state.boardReducer.boards,
        boardsAdminArray: state.authReducer.boardsAdminArray,
        boardsOwnerArray: state.authReducer.boardsOwnerArray,
        commentsUserArray: state.authReducer.commentsUserArray,
        taskPlannersArray: state.authReducer.taskPlannersArray,
    }
}

const mapDispatchToProps = {
    editBoard: boardActions.editBoard,
    deleteBoard: boardActions.deleteBoard,
    addTaskPlanner: taskPlannerActions.addTaskPlanner,
    getTaskPlannerFromBoard: taskPlannerActions.getTaskPlannerFromBoard,
    editTaskPlanner: taskPlannerActions.editTaskPlanner,
    deleteTaskPlanner: taskPlannerActions.deleteTaskPlanner,
    inviteUserToBoard: authActions.inviteUserToBoard,
    addUserToBoard: boardActions.addUserToBoard,
    deleteBoardOwner: boardActions.deleteBoardOwner,
    getUsersFromBoard: boardActions.getUsersFromBoard,
    userAdmin: boardActions.userAdmin,
    setUserComponents: authActions.setUserComponents,
    getAdminsFromBoard: boardActions.getAdminsFromBoard,
    recycleTaskPlanner: taskPlannerActions.recycleTaskPlanner
}

export default connect(mapStateToProps, mapDispatchToProps)(Board)