const TaskModel = require('../models/TaskModel')
const tasksControllers = {
    getAllTasks: async (req, res) => {
        try {
            const allTasks = await TaskModel.find()
            res.json({ response: allTasks, success: true })
        } catch (error) {
            res.json({ response: 'Ha ocurrido un error en el servidor, intente más tarde!', success: false })
        }
    },
    addTask: async (req, res) => {
        try {
            const addNewTask = new TaskModel(req.body)
            await addNewTask.save()
            
            res.json({ response: addNewTask, success: true })
        } catch (error) {
            res.json({ response: 'Ha ocurrido un error en el servidor, intente más tarde!', success: false })
        }
    },
    editTask: async (req, res) => {
        const id = req.params.id
        try {
            const editTask = await TaskModel.findOneAndUpdate({ _id: id }, { ...req.body }, { new: true })
            res.json({ success: true, response: editTask })
        } catch (error) {
            res.json({ success: false, response: 'Ha ocurrido un error en el servidor, intente más tarde!' })
        }
    },
    deleteTask: async (req, res) => {
        const id = req.params.id
        try {
            const deleteTask = await TaskModel.findOneAndDelete({ _id: id })
            res.json({ success: true, response: deleteTask })
        } catch (error) {
            res.json({ success: false, response: 'Ha ocurrido un error en el servidor, intente más tarde!r' })
        }
    },
    tasksFromTaskplanner: async (req, res) => {
        
        const id = req.params.id
        try {
            const tasksFromTaskplanner = await TaskModel.find({ taskplannerId: id }).populate({ path:"comments", populate:{ path:"userId", select:{"email":1} } })
            await res.json({ response: tasksFromTaskplanner, success: true })
        } catch (error) {
            res.json({ response: 'Ha ocurrido un error en el servidor, intente más tarde!', success: false })
        }
    },

    getAllComments: async (req, res) => {
        const taskId = req.params.id
        try {
            const allComments = await TaskModel.findById(taskId).populate({ path:"comments", populate:{ path:"userId", select:{"email":1} } })
            res.json({ response: allComments, success: true })
        } catch (error) {
            res.json({ response: 'Ha ocurrido un error en el servidor, intente más tarde!', success: false })
        }
    },

    addComment: async (req, res) => {
        const taskId = req.params.id
        try {
            const addComment = await TaskModel.findOneAndUpdate({ _id: taskId }, 
                { $push: { comments: {...req.body, userId: req.user._id}}}, { new: true })
            res.json({ response: addComment, success: true })
        } catch (error) {
            res.json({ response: 'Ha ocurrido un error en el servidor, intente más tarde!', success: false })
        }
    },
    editComment: async (req, res) => {
        const taskId = req.params.id
        const message = req.body.message
        const idComment = req.body.idComment
        try {
            const editComment = await TaskModel.findOneAndUpdate({ _id: taskId, "comments._id": idComment },
                { $set: { "comments.$.message": message } }, { new: true })
            res.json({ response: editComment, success: true })
        } catch (error) {
            res.json({ response: 'Ha ocurrido un error en el servidor, intente más tarde!', success: false })
        }
    },
      

    deleteComment: async (req, res) => {
        const { id } = req.params
        try {
            const deleteComment = await TaskModel.findOneAndUpdate({ "comments._id": id }, { $pull: { comments: { _id: id } } }, { new: true })
            res.json({ response: deleteComment, success: true })
        } catch (error) {
            res.json({ response: 'Ha ocurrido un error en el servidor, intente más tarde!', success: false })
        }
    }
}
module.exports = tasksControllers