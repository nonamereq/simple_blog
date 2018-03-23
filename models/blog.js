const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/blog');

let blogSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    title: {
    	type: String,
    	required: true
    },
    blog: {
        type: String,
        required: true
    }
});

module.exports = mongoose.model('Blog', blogSchema);
