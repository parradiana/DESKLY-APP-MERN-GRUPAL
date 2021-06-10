const BoardModel = require('../models/BoardModel')
const User = require("../models/UserModel")
const Taskplanner = require("../models/TaskplannerModel")
const Task = require("../models/TaskModel")

const notificationsControllers = {

    acceptBoard: async (req, res) => {
        let response;
        let error;
        
        try {
            const selectedBoard = await BoardModel.findOneAndUpdate({ _id: req.params.idBoard }, { $addToSet: { 'users': req.user._id } }, { new: true })
            const rest = await User.findOneAndUpdate({ _id: req.user._id }, { $pull: { invitations: req.params.idBoard } }, { new: true })
            response = { board: selectedBoard, notification: req.params.idBoard }
            
        } catch {
            error = 'An error has occurred on the server, try later!'
            console.log('ERROR: The controller is failing: acceptBoard')
        }
        res.json({ success: !error ? true : false, response, error })
    },

    rejectBoard: async (req, res) => {
        let response;
        let error;
        try {
            await User.findOneAndUpdate({ _id: req.user._id }, { $pull: { invitations: req.params.idBoard } }, { new: true })
            response = {notification: req.params.idBoard }

        } catch {
            error = 'An error has occurred on the server, try later!'
            console.log('ERROR:The controller is failing: rejectBoard')
        }
        res.json({ success: !error ? true : false, response, error })
    },

    getComponents: async (req, res) => {

        try {

            const boardsOwner = await BoardModel.find({ owner: req.user._id })
            let boardOwnerId = boardsOwner.map(board => String(board._id))
            const adminBoards = await BoardModel.find({ admins: { $elemMatch: { $eq: req.user._id } } })
            let boardAdminArray = adminBoards.map(board => String(board._id))
            const userBoards = await BoardModel.find({ users: { $elemMatch: { $eq: req.user._id } } })
            let boardUserArray = userBoards.map(board => String(board._id))
            let boardIdUser = boardUserArray.filter(user => (boardOwnerId.indexOf(user) === -1 && boardAdminArray.indexOf(user) === -1))

            const taskPlanners = await Taskplanner.find({ userId: req.user._id })

            const userTask = await Task.find({ "comments.userId": req.user._id })
            let idComents = userTask.flatMap(tasks => {
                let comments = tasks.comments.filter(comment => {
                    comment.userId.toString() === req.user._id.toString()
                    return comment._id
                })
                let commentsId = comments.map(userId => userId._id)
                return commentsId
            })

            res.json({ success: true, response: { boardOwnerId, boardAdminArray, taskPlanners, idComents, boardIdUser} })

        } catch (error) {
            res.json({ success: false, response: 'An error has occurred on the server, try later!' })
        }
    }
}

module.exports = notificationsControllers