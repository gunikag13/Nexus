import {
  createTask,
  deleteTask,
  getTasks,
  updateTask,
} from '../services/taskService.js'

const formatTask = (task) => ({
  id: task._id.toString(),
  title: task.title,
  completed: task.completed,
  priority: task.priority,
  deadline: task.deadline,
  createdAt: task.createdAt,
  updatedAt: task.updatedAt,
})

export const getTasksHandler = async (request, response, next) => {
  try {
    const tasks = await getTasks({ userId: request.user._id })

    return response.status(200).json({
      success: true,
      message: 'Tasks fetched successfully.',
      data: {
        tasks: tasks.map(formatTask),
      },
    })
  } catch (error) {
    return next(error)
  }
}

export const createTaskHandler = async (request, response, next) => {
  try {
    const task = await createTask({
      payload: request.body,
      userId: request.user._id,
    })

    return response.status(201).json({
      success: true,
      message: 'Task created successfully.',
      data: {
        task: formatTask(task),
      },
    })
  } catch (error) {
    return next(error)
  }
}

export const updateTaskHandler = async (request, response, next) => {
  try {
    const task = await updateTask({
      payload: request.body,
      taskId: request.params.id,
      userId: request.user._id,
    })

    return response.status(200).json({
      success: true,
      message: 'Task updated successfully.',
      data: {
        task: formatTask(task),
      },
    })
  } catch (error) {
    return next(error)
  }
}

export const deleteTaskHandler = async (request, response, next) => {
  try {
    await deleteTask({
      taskId: request.params.id,
      userId: request.user._id,
    })

    return response.status(200).json({
      success: true,
      message: 'Task deleted successfully.',
      data: {},
    })
  } catch (error) {
    return next(error)
  }
}

