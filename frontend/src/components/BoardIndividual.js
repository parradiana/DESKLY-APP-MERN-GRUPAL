import { useEffect, useState } from 'react'
import { connect } from 'react-redux'
import boardActions from '../redux/actions/boardActions'
import { Link } from 'react-router-dom'

const BoardIndividual = (props) => {
    const [boardSingle, setBoardSingle] = useState({})
    useEffect(() => {
        getBoardSingle()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])
    const getBoardSingle = async () => {
        const oneBoard = await props.getBoard(props.board)
        setBoardSingle(oneBoard)
    }
    return (
        boardSingle &&
        <Link to={`/board/${props.board}`}>
            <div className={`boardMyDesk ${props.color}`}>
                <span>{boardSingle.title}</span>
            </div>
        </Link>
    )
}
const mapDispatchToProps = {
    getBoard: boardActions.getBoard
}
export default connect(null, mapDispatchToProps)(BoardIndividual)