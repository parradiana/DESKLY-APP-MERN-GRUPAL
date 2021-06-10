import { useState } from 'react'
import { connect } from 'react-redux'
import commentActions from '../redux/actions/commentActions'

const Comment = (props) => {
    const { comment, idTask, setCommentsState, editComment, deleteComment, commentsUserArray } = props
    const { userCompleteName, message, _id } = comment

    

    const [editButtonShow, setEditButtonShow] = useState(false)
    const [deleteButton, setDeleteButton] = useState(false)

    const [editionComment, setEditionComment] = useState({ idComment: _id, message })

    // console.log(editionComment)
    const getInput = e => { setEditionComment({ ...editionComment, message: e.target.value }) }

    // let imComment = props.commentsUserArray.some(commentId =>commentId === String(props.comment._id))

    let checkUserOwnerComment = commentsUserArray.some( commentId => commentId === _id)

    console.log(checkUserOwnerComment)

    const sendEditComment = async () => {
        const response = await editComment(idTask, editionComment)
        setCommentsState(response)
        setEditButtonShow(false)
    }

    const sendDeleteComment = async () => {
        const response = await deleteComment(_id)
        setCommentsState(response)
    }

    return (
        <div className="commentTask">

            <div className="nameButtons">
                <span className="userNameComment">{userCompleteName}</span>
                {/* {props.userLogged.email === props.comment.userId.email && */}

                {props.userLogged.email === props.comment.userId.email &&
                    <div className="buttonsCommentsDelete">
                        <span onClick={() => setEditButtonShow(!editButtonShow)} className="material-icons-outlined iconoTaskPlanner">edit</span>
                        <span onClick={() => setDeleteButton(true)} className="material-icons-outlined iconoTaskPlanner">delete</span>
                    </div>}
            </div>
            <span style={{ display: editButtonShow ? 'none' : 'block' }} className="userCommentText">{message}</span>
            <div className="editCommentDiv">
                <textarea className="editAreaComment" type="text" value={editionComment.message} onChange={getInput} style={{ display: editButtonShow ? 'block' : 'none' }}></textarea>
                <button className="confirmEditComment" onClick={sendEditComment} style={{ display: editButtonShow ? 'block' : 'none' }}>Confirm</button>
            </div>
            <div style={{ display: deleteButton ? 'flex' : 'none' }} className="deleteCommentModal">
                <span>Are you sure you want to delete this comment? This cannot be undone.</span>
                <div className="deleteButtonsModal">
                    <button onClick={sendDeleteComment} >Confirm</button>
                    <button onClick={() => setDeleteButton(false)}>Cancel</button>
                </div>
            </div>
        </div>
    )

}
const mapStateToProps = state => {
    return {
        userLogged: state.authReducer.userLogged,
        commentsUserArray: state.authReducer.commentsUserArray

    }
}

const mapDispatchToProps = {
    editComment: commentActions.editComment,
    deleteComment: commentActions.deleteComment
}

// export default Comment
export default connect(mapStateToProps, mapDispatchToProps)(Comment)
