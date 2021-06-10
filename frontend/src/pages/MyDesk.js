import React, { useEffect, useState } from "react"
import { connect } from "react-redux"
import boardActions from "../redux/actions/boardActions"
import BoardIndividual from '../components/BoardIndividual'
import authActions from '../redux/actions/authActions'
import Nav from "../components/Nav"
import LateralMenu from "../components/LateralMenu"
import NotificationsPanel from "../components/NotificationsPanel"
import Spinner from "../components/helpers/Spinner"

const MyDesk = (props) => {

    const { userLogged } = props
    const [inputBoard, setInputBoard] = useState({ title: '', description: '', token: '' })
    const [newBoardModal, setNewBoardModal] = useState(false)
    const [loading, setLoading] = useState(true)
    const [menuLateral, setMenuLateral] = useState(false)

    const readInputBoard = (e) => {
        const field = e.target.name
        const value = e.target.value
        setInputBoard({
            ...inputBoard,
            [field]: value,
            token: userLogged.token
        })
    }

    const addBoard = async () => {
        setLoading(false)
        await props.addBoard(inputBoard)
        setNewBoardModal(false)
        setLoading(true)
    }

    useEffect(() => {
        props.getBoardsFromUser(userLogged.token)
        // if (props.boardsOwnerArray) {

        // }
        const reloadTaskPlanner = setInterval(() => {
            if (userLogged.token) {
                props.setUserComponents(userLogged.token)
                props.getBoardsFromUser(userLogged.token)
            }

        }, 1000)

        return () => { clearInterval(reloadTaskPlanner) }
        
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])
    let userFirstName = props.userLogged.response ? `${props.userLogged.response.firstName}` : `${userLogged.firstName}`
    let userLastName = props.userLogged.response ? props.userLogged.response.lastName || '' : userLogged.lastName || ''
    let userImg = props.userLogged.response ? props.userLogged.response.img : userLogged.img

    return (
        <div className="myDesk">

            <LateralMenu setMenuLateral={setMenuLateral} menuLateral={menuLateral} setMenuLateral={setMenuLateral} menuLateral={menuLateral} />

            <div className="mydeskContainer">
                <div className="headerMyDesk">
                    <span className="hamburguerIcon" onClick={() => setMenuLateral(!menuLateral)}>&#9776; </span>
                    <h2>MyDesk</h2>
                    <div className="userPicName">
                        <span className="userCompleteName">{`${userFirstName} ${userLastName}`}</span>
                        <div className="userPic" style={{ backgroundImage: `url('${userImg}')` }}></div>
                    </div>
                </div>
                <div className="boardsContainerMyDesk">
                    <div className="gifMyDesk" style={{ backgroundImage: "url('https://webdesing881317710.files.wordpress.com/2021/05/59472719-f565-4104-9c1a-9f52e846e6ca.gif')" }}></div>

                    {props.loading
                        ? <div className="spinner-container">
                            <Spinner />
                        </div>
                        : props.userLogged &&
                        <>
                            <h2 className="boardsCategories">My boards</h2>
                            <div className="boardsSection">
                                <div className="newBoardButton" onClick={() => setNewBoardModal(true)}>
                                    <span className="material-icons-outlined nuevoTableroMas">add_circle_outline</span>
                                    <span>New board</span>
                                </div>
                                {
                                    props.boardsOwnerArray.map(board => <BoardIndividual color={"colorOwner"} key={board} board={board} />)
                                }
                            </div>
                            <h2 className="boardsCategories">Boards that I admin</h2>
                            <div className="boardsSection">
                                {
                                    props.boardsAdminArray.map(board => <BoardIndividual color={"colorAdmin"} key={board} board={board} />)

                                }
                            </div>
                            <h2 className="boardsCategories">Boards in which I am a member</h2>
                            <div className="boardsSection">

                                {
                                    props.boardsUserArray.map(board => <BoardIndividual color={"colorUser"} key={board} board={board} />)

                                }

                            </div>
                        </>
                    }
                </div>
            </div>

            <div className="newBoardModal" style={{ display: newBoardModal ? 'flex' : 'none' }}>
                <div className="newBoard">
                    <div>
                        <img src="https://webdesing881317710.files.wordpress.com/2021/05/desklylogo2.png" alt="" />
                        <p>DESKLY</p>
                    </div>
                    <input type="text" name="title" placeholder="Title" onChange={readInputBoard} />
                    <textarea name="description" placeholder="Add a description..." onChange={readInputBoard} ></textarea>
                    <button onClick={loading ? addBoard : null}>Create a new board</button>
                    {/* <button onClick={addBoard}>Crear nuevo tablero</button> */}
                    <span onClick={() => setNewBoardModal(false)} className="material-icons-outlined closeNewBoardModal">close</span>
                </div>
            </div>


            {/* <div className="newBoardModal" style={{ display: newBoardModal ? 'flex' : 'none' }}>
                <div className="newBoard"  >
                    <input type="text" name="title" placeholder="title" onChange={readInputBoard} />
                    <input type="text" name="description" placeholder="description..." onChange={readInputBoard} />
                    <span onClick={() => setNewBoardModal(false)} className="closeNewBoardModal">X</span>
                </div>
            </div> */}


        </div >

    )
}

const mapStateToProps = state => {
    return {
        userLogged: state.authReducer.userLogged,
        boards: state.boardReducer.boards,
        boardsAdminArray: state.authReducer.boardsAdminArray,
        boardsOwnerArray: state.authReducer.boardsOwnerArray,
        boardsUserArray: state.authReducer.boardsUserArray,
        loading: state.authReducer.loading,
    }
}

const mapDispatchToProps = {
    addBoard: boardActions.addBoard,
    getBoardsFromUser: boardActions.getBoardsFromUser,
    setUserComponents: authActions.setUserComponents
}


export default connect(mapStateToProps, mapDispatchToProps)(MyDesk)
