const express = require('express')
const router = express.Router()
const validator = require('../config/validator')
const taskplannerControllers = require('../controllers/taskplannerControllers')
const boardsControllers = require('../controllers/boardsControllers')
const userControllers = require('../controllers/userControllers')
const tasksControllers = require('../controllers/tasksControllers')
const notificationsControllers = require('../controllers/notificationsControllers')
const passport = require("passport")

const { newUser, login, reLogin, inviteUserToBoard, checkNotifications } = userControllers
const { acceptBoard, rejectBoard, getComponents } = notificationsControllers
const { getAllTaskplanner, getTaskplanner, getTaskplannerFromBoard, addTaskplanner, putTaskplanner, deleteTaskplanner ,recycleTaskplanner} = taskplannerControllers
const { getFromUser, addBoard, editBoard, deleteBoard, getUsersFromBoard, userAdmin, getAdminsFromBoard,getBoard} = boardsControllers
const { getAllTasks, addTask, editTask, deleteTask, tasksFromTaskplanner,getAllComments,  addComment, editComment, deleteComment } = tasksControllers

// routes boardsControllers 
router.route('/board')
    .post(passport.authenticate('jwt', { session: false }), addBoard)
    .get(passport.authenticate('jwt', { session: false }), getFromUser)

router.route('/board/:id')
    .put(passport.authenticate('jwt', { session: false }), editBoard)
    .delete(passport.authenticate('jwt', { session: false }), deleteBoard)
    .get(getUsersFromBoard)
// routes taskplannerControllers
router.route('/boardAdmins/:email')
    .put(userAdmin)
    .get(getAdminsFromBoard)
router.route('/boardSingle/:id')
    .get(getBoard)
router.route('/taskplanner')
    .get(getAllTaskplanner)
    .post(passport.authenticate('jwt', { session: false }), addTaskplanner)

router.route('/taskplanner/:id')
    .get(getTaskplanner)
    .put(putTaskplanner)
    .delete(deleteTaskplanner)

router.route('/taskplannerFromBoard/:id')
    .get(getTaskplannerFromBoard)
    .put(recycleTaskplanner)

// routes userControllers
router.route("/newuser")
    .post(validator, newUser)

router.route("/checkNotifications")
    .get(passport.authenticate('jwt', { session: false }), checkNotifications)

router.route("/notification/:idBoard")
    .get(passport.authenticate('jwt', { session: false }), acceptBoard)

router.route("/reject/:idBoard")
    .get(passport.authenticate('jwt', { session: false }), rejectBoard)


router.route("/inviteuser/:email")
    .put(inviteUserToBoard)

router.route("/login")
    .post(login)

router.route("/relogin")
    .get(passport.authenticate('jwt', { session: false }), reLogin)

// TASKS
router.route('/task')
    .get(getAllTasks)
    .post(passport.authenticate('jwt', { session: false }), addTask)

router.route('/task/:id')
    .get(tasksFromTaskplanner)
    .put(editTask)
    .delete(deleteTask)



// TASK COMMENTS
router.route('/task/comment/:id')
    .get(getAllComments)
    .post(passport.authenticate('jwt', { session: false }), addComment)
    .put(editComment)
    .delete(deleteComment)


router.route("/usercomponents")
    .get(passport.authenticate('jwt', { session: false }), getComponents)

module.exports = router