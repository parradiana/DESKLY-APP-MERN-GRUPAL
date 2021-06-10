const BoardModel = require('../models/BoardModel')
const User = require("../models/UserModel")

const boardsControllers = {

    getFromUser: async (req, res) => {
        let response;
        let error;
        try {
            
            const selectedBoards = await BoardModel.find({ users: { $elemMatch: { $eq: req.user._id } } })
            
            response = selectedBoards
        } catch {
            error = 'An error has occurred on the server, try later!'
            console.log('ERROR: The controller is failing: getFromUser')
        }
        res.json({ success: !error ? true : false, response, error })
    },

    addBoard: async (req, res) => {
        let response;
        let error;
        try {
            const boardToAdd = new BoardModel({ ...req.body, owner: req.user._id, users: [req.user._id] })
            await boardToAdd.save()
            response = boardToAdd
        } catch {
            error = 'An error has occurred on the server, try later!'
            console.log('ERROR: The controller is failing: addBoard')
        }
        res.json({ success: !error ? true : false, response, error })
    },

    editBoard: async (req, res) => {
        let response;
        let error;
        try {
            const board = await BoardModel.findById(req.params.id)
            if(String(board.owner) === req.user.id){
                response = await BoardModel.findOneAndUpdate({ _id: req.params.id }, { ...req.body }, { new: true })                
            }else{
                response = board
            }

        } catch {
            error = 'An error has occurred on the server, try later!'
            console.log('ERROR: The controller is failing: editBoard')
        }
        res.json({ success: !error ? true : false, response, error })
    },

    deleteBoard: async (req, res) => {
        let response;
        let error;
        try {
            const board = await BoardModel.findById(req.params.id)
            if(String(board.owner) === req.user.id){
                response = await BoardModel.findByIdAndDelete(req.params.id)
            }
        } catch {
            error = 'An error has occurred on the server, try later!'
            console.log('ERROR: The controller is failing: deleteBoard')
        }
        res.json({ success: !error ? true : false, response, error })
    },
    getUsersFromBoard: async (req, res) => {
        try{
            const board = await BoardModel.findById(req.params.id).populate({path:"users",select:{ "firstName":1 ,"lastName":1,"email":1,"img":1}})
            res.json({success: true, users: board.users})
        }catch(error){
            res.json({success: false, response:'An error has occurred on the server, try later!'})
        }
    },
    userAdmin: async (req,res) => {
        try{
            let user = await User.findOne({email: req.params.email})
            let board = await BoardModel.findOne({_id: req.body.id})
            let admins = null
            if(board.admins.indexOf(user._id) !== -1){
                admins = await BoardModel.findOneAndUpdate({_id:req.body.id},{$pull: {'admins': user._id}},{new: true}).populate("admins","email")
            }else{
                admins = await BoardModel.findOneAndUpdate({_id:req.body.id},{$addToSet: {'admins': user._id}},{new: true}).populate("admins","email")
            }            
            res.json({success: true, admins}) 

        }catch(error){
            console.log(error)
        }
    },
    getAdminsFromBoard: async (req, res) => {
        try{
            const response = await BoardModel.findById(req.params.email).populate({path:"admins",select:{"email":1}})
            res.json({response})
        }catch(error){
            console.log(error)
        }
    },
    getBoard: async (req,res) => {
        try{
            const response = await BoardModel.findById(req.params.id)
            res.json({success:true, response})
        }catch(error){
            console.log(error)
        }
    }
}

module.exports = boardsControllers