const mongoose = require("mongoose");
mongoose.Promise = global.Promise;

const tijarahPercent = new mongoose.Schema({
  bankPersent: {
    type: Number,
    trim: true,
    required: true,
  },
});

module.exports = mongoose.model("tijarahPercent", tijarahPercent);
