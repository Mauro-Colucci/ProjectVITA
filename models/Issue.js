const mongoose = require('mongoose')

const IssueSchema = new mongoose.Schema({
    description: {
        type: String,
        required: true
    },
    projectId :{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Post',
        required: true
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    tag: {
        type: Array,
        enum:["bug", "new feature", "todo", "misc"]
    }
}, {timestamps: true})

module.exports = mongoose.model("Issue", IssueSchema)