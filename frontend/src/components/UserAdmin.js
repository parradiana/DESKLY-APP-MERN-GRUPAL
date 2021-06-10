import { useEffect, useState } from 'react'
import { connect } from 'react-redux'
import boardActions from '../redux/actions/boardActions'

const UserAdmin = (props) => {
    const [loading, setLoading] = useState(true)
    const [admin, setAdmin] = useState(false)
    const { visible, setVisible } = props


    useEffect(() => {
        const array = props.admins.map(admin => admin.email)
        if (array.indexOf(props.user.email) !== -1) {
            setAdmin(false)
        } else {
            setAdmin(true)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [props.admins])

    const confirmAdmin = async () => {
        setLoading(false)
        await props.userAdmin(props.user.email)
        setAdmin(!admin)
        setLoading(true)
    }

    return (
        <>
            {visible &&
                <div>
                    <h3>{props.user.firstName + ' ' + (props.user.lastName === null ? '' : props.user.lastName)}</h3>
                    <button className="buttonUserAdmin" onClick={loading ? (() => confirmAdmin()) : null}>{admin ? 'ADMIN' : 'USER'}</button>
                </div>
            }
        </>
    )
}
const mapDispatchToProps = {
    getAdminsFromBoard: boardActions.getAdminsFromBoard
}
export default connect(null, mapDispatchToProps)(UserAdmin)