const User = require("../models/UserModel")
const BoardModel = require('../models/BoardModel')
const bcryptjs = require("bcryptjs")
const jwt = require("jsonwebtoken")

const userControllers = {
    newUser: async (req, res) => {
        var error
        var { firstName, lastName, email, img, password, google, facebook } = req.body
        try {
            const emailExist = await User.findOne({ email })
            if (!emailExist) {
                try {
                    const passwordHashed = bcryptjs.hashSync(password, 10)
                    var response = new User({ firstName, lastName, email, img, google, facebook, password: passwordHashed })
                    await response.save()
                    var token = jwt.sign({ ...response }, process.env.SECRET_KEY)
                } catch (e) {
                    error = "There was an error in the user’s engraving. Try again"
                }
            } else {
                error = "Email is already in use"
            }
        } catch (e) {
            error = "Could not access the user base. Try again"
        }
        if (error) {
            return res.json({ success: false, error })
        }

        res.json({ success: true, token, response })
    },

    login: async (req, res) => {
        const { email, password, google, facebook } = req.body
        var response;
        var error;
        try {
            const userOK = await User.findOne({ email: email })
            if (userOK) {
                if (userOK.google === google || userOK.facebook === facebook) {
                    const passwordOk = bcryptjs.compareSync(password, userOK.password)
                    if (passwordOk) {
                        const token = jwt.sign({ ...userOK }, process.env.SECRET_KEY)
                        response = { token: token, firstName: userOK.firstName, lastName: userOK.lastName, email: userOK.email, img: userOK.img, goolge: userOK.google }
                    } else {
                        error = "User and/or password is incorrect"
                    }
                } else {
                    error = "You are trying to enter from a wrong place. Try again"
                }
            } else {
                error = "User and/or password is incorrect"
            }
        } catch (e) {
            error = "No se pudo acceder a la base de datos. Intenta nuevamente"
        }
        res.json({ success: !error ? true : false, response, error })
    },
    reLogin: (req, res) => {
        res.json({
            success: true,
            response: { firstName: req.user.firstName, lastName: req.user.lastName, email: req.user.email, img: req.user.img, goolge: req.user.google }
        })
    },

    inviteUserToBoard: async (req, res) => {
        const userInvited = await User.findOne({ email: req.params.email })
        let chekInvitation = userInvited.invitations.some(inv => String(req.body.boardId) === String(inv))

        const userInBoard = await BoardModel.findOne({ _id: req.body.boardId})

        let checkAlredyInBoard = userInBoard.users.some(userId => String(userId) === String(userInvited._id) )
        
        if (!chekInvitation && !checkAlredyInBoard) {
            await userInvited.updateOne({ $addToSet: { 'invitations': req.body.boardId } })
        }else {
            console.log('ya está')
        }
    },

    checkNotifications: async (req, res) => {
        const userNotificated = await User.findById(req.user._id).populate({ path:"invitations", populate:{ path:"owner", select:{ "firstName":1 ,"lastName":1,"img":1} } })
        res.json({ response: userNotificated.invitations })
    }
}

module.exports = userControllers


