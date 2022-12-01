import { useEffect, useState } from "react"
import { toast } from "react-toastify"
import axios from 'axios'
import TaskForm from "./TaskForm"
import Task from "./Task"
import loadingImg from '../assets/loader.gif'

const TaskList = () => {

  const [tasks, setTasks] = useState([])
  const [completedTasks, setCompletedTasks] = useState(0)
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    completed: false
  })
  const [isEditing, setIsEditing] = useState(false)
  const [taskId, setTaskId] = useState('')

  const {name} = formData

  const handleInputChange = (e) => {
    const {name, value} = e.target
    setFormData({ ...formData, name: value})
  }

  const createTask = async (e) => {
    e.preventDefault()
    if (name === "") {
      return toast.error("Task cant be blank !")
    }

    try {
      await axios.post('/api/tasks', formData)
      setFormData({...formData, name: ""})
      toast.success('Task added !!')
    } catch (e) {
      console.log("Create task error", e);
      toast.error(e.message)
    }
    fetchTasks()
  }

  const fetchTasks = async () => {
    console.log("called");
    setLoading(true)
    try {
      const {data} = await axios.get('/api/tasks')
      setTasks(data)

      setLoading(false)
    } catch (e) {
      toast.error(e.message)
      setLoading(false)
    }
  }

  const deleteTask = async (id) => {

    setLoading(true)
    try {
      await axios.delete(`/api/tasks/${id}`)
      toast.success('Task deleted !!')
      setTasks(tasks.filter((task) => task._id != id))
      setLoading(false)
    } catch (e) {
      toast.error(e.message)
      setLoading(false)
    }
  }

  const updateTask = async (e) => {
    e.preventDefault()
    console.log(formData);
    try {
      await axios.patch(`/api/tasks/${taskId}`, formData)
      toast.success('Task updated')
      fetchTasks()
      setIsEditing(false)
      setFormData({...formData, name: ""})
    } catch (e) {
      toast.error(e.message)
      setIsEditing(false)
    }
  }

  const editTask = (task) => {
    setFormData(task)
    setTaskId(task._id)
    setIsEditing(true)
  }

  const changeCompleted = async (task, index) => {

    try {
      await axios.patch(`/api/tasks/${task._id}`, {completed: !task.completed})
      tasks[index].completed = !tasks[index].completed
      toast.success('Task completed toggled')
      setTasks([])
      setTimeout(()=>{
        setTasks(tasks)
      }, 1)
    } catch (e) {
      toast.error(e.message)
    }
  }

  useEffect(() => {
    fetchTasks()
  }, [])

  useEffect(()=> {
    setCompletedTasks(tasks.filter((task)=> task.completed).length)
  }, [tasks])
  

  return (
    <div className="--pb">
      <h2>Task Manager</h2>
      <TaskForm name={name} 
        handleInputChange={handleInputChange} 
        createTask={createTask} 
        isEditing={isEditing}
        updateTask={updateTask}
        />
        {
          tasks.length > 0 && (
            <div className="--flex-between --pb">
        <p>
        <b>Total Tasks:</b> {tasks.length}
        </p>
        <p>
          <b>Completed Tasks</b> {completedTasks}
        </p>
      </div>
          )}
      
      <hr/>
      
      {loading && (
          <div className="--flex-center">
            <img src={loadingImg} />
          </div>
      )}
      {
        !loading && tasks.length === 0 ? (
          <p className="--py">No tasks found, please add a task</p>
        ) : (
          <>
          {tasks.map((task, index) => {
            return (
              <Task key={task._id} 
                task={task} 
                index={index} 
                deleteTask={deleteTask} 
                editTask={editTask}
                changeCompleted={changeCompleted}
                />
            )
          })}
          </>
        )
      }
    </div>
  )
}

export default TaskList