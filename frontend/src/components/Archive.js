import { connect } from 'react-redux'
import { useEffect, useState } from 'react'
import taskPlannerActions from '../redux/actions/taskPlannerActions'
import taskActions from "../redux/actions/taskActions"



    const Archive  = (props) => {

        const [filterTaskplanners,setFilterTaskplanners] =useState(props.allTasksPlanner)


        useEffect(() => {
            setFilterTaskplanners(props.allTasksPlanner)
            setFilterTaskplanners(props.allTasksPlanner.filter(taskplanner =>taskplanner.archived === true))
        }, [props.allTasksPlanner])

    const recycle = async (idTaskPlanner) => {
        await props.recycleTaskPlanner(idTaskPlanner, {archived:false})
    }

    const erase = async (idTaskPlanner) => {
        await props.deleteTaskPlanner(idTaskPlanner)
    }


    return(<>   
        <div style={{ margin: '2.5rem',display:"flex", flexDirection:"column", alignItems:"flex-end" }}>{
        filterTaskplanners.map(taskplanner =>{
        return (
        <><div>
        <h1>{taskplanner.title}</h1> 
        <button   style={{ margin: '0.5rem', height:"2rem", width: "5rem"}} onClick={()=>recycle(taskplanner._id)}> devolver</button>
        <button   style={{ margin: '0.5rem', height:"2rem", width: "5rem"}} onClick={()=>erase(taskplanner._id)}> borrar</button>
        </div>
        </>)} )
         }
       </div>    
    </>
    )
 } 


 
 const mapStateToProps = state => {
    return {
    }
}

const mapDispatchToProps = {
    recycleTaskPlanner: taskPlannerActions.recycleTaskPlanner,
    deleteTaskPlanner: taskPlannerActions.deleteTaskPlanner,
    tasksFromTaskplanner: taskActions.tasksFromTaskplanner,
    deleteTask: taskActions.deleteTask,
    recycleTask: taskActions.recycleTask,

}

export default connect(mapStateToProps, mapDispatchToProps)(Archive)



