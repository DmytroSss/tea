const mongoose = require('mongoose');

const userSch = new mongoose.Schema({
	userID: {type: String},
  warns: {type: Number, default: 0},
  timeout: {type: Number, default: 0},
  muteGet: {type: Number, default: 0},
	reason: {type: String, default: 0}

});

const model = mongoose.model("userSch", userSch);

module.exports = model;
