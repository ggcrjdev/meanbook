var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var commentSchema = new Schema({
    postId: Schema.Types.ObjectId,
    content: {
        type: String,
        required: true,
        trim: true
    },
    by: {
        type: String,
        required: true,
        trim: true
    },
    creationDate: {
        type: Date,
        default: Date.now
    },
    likes: {
        type: Number, 
        min: 0, 
        max: 99999999
    }
});

var comment = mongoose.model('comment', commentSchema);
module.exports = {
    Comment: comment,
    CommentSchema: commentSchema
};
