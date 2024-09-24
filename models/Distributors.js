const mongoose = require("mongoose");
mongoose.Promise = global.Promise;

const DistributorSchema = new mongoose.Schema({

    //`name`, `description`, `image`
    name: {
        type: String,
        trim: true,
        required: true,
    },
    description: {
        type: String,
        trim: true,
        required: true,
    },
    image: {
        type: String,
        trim: true,
        required: true,
    },
});
exports.Distributor = mongoose.model("Distributor", DistributorSchema);