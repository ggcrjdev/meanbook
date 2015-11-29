var modelComment = require('./comment');

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var postSchema = new Schema({
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
        max: 99999999,
        default: 0
    },
    comments: [modelComment.CommentSchema]
});

var post = mongoose.model('post', postSchema);
module.exports = {
    Post: post,
    PostSchema: postSchema
};
