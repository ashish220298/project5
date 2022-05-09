const mongoose = require('mongoose');
const ObjectId = mongoose.Schema.Types.ObjectId


const blogSchema = new mongoose.Schema({
    title: {
        required: true,
        type: String,
        required: true,

    },
    excerpt: {
        type: String,
        required: true,
    },

    ISBN: {
        required: true,
        type: String,
        unique: true
    },
    userId: {
        required: true,
        type: ObjectId,
        ref: 'user'
    },
    reviews: {
        type: Number,
        default: 0,
        required: true,
        comment: String
    },
    category: {
        type: String,
        require: true

    },
    subcategory: {
        type: [String],
        require: true
    },

    deletedAt: {
        type: Date,
        default: null
    },
    isDeleted: {
        type: Boolean,
        default: false

    },
    releaseddAt: {
        type: Date,
        default: null
    },

    isPublished: {
        type: Boolean,
        default: false

    }


}, { timestamps: true });

//module.exports = mongoose.model('Blog', blogSchema)