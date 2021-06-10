const mongoose = require("mongoose")

const userScheema = mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String },
  email: { type: String, required: true },
  img: { type: String, required: true },
  invitations: [{type: mongoose.Types.ObjectId, ref: 'board'}],
  password: { type: String, required: true },
  google: { type: Boolean, default: false },
  facebook: {type: Boolean, default: false}
})

const User = mongoose.model("user", userScheema)

module.exports = User