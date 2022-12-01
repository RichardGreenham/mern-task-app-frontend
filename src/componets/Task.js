import {FaEdit, FaCheckDouble, FaRegTrashAlt} from "react-icons/fa"

const Task = ({task, index, deleteTask, editTask, changeCompleted}) => {
  return (
    <div className={task.completed ? 'task completed' : 'task'}>
      <p>
        <b>{index + 1}. </b>
        {task.name}
      </p>
      <div className="task-icons">
      <FaCheckDouble color="green" onClick={()=> changeCompleted(task, index)}/>
      <FaEdit color="purple" onClick={() => editTask(task)}/>
      <FaRegTrashAlt color="red" onClick={()=> deleteTask(task._id)} />
      </div>
      
    
    </div>
  )
}

export default Task