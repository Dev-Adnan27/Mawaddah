import mongoose from "mongoose";

const BlogSchema = new mongoose.Schema({
    slug: {
        type: String,
        required: [true, "Slug is required"],
        unique: true,
        trim: true
    },
    title: {
        type: String,
        required: [true, "Title is required"],
        trim: true
    },
    summary: {
        type: String,
        required: [true, "Summary is required"]
    },
    content: {
        type: String,
        required: [true, "Content is required"]
    },
    author: {
        type: String,
        required: [true, "Author is required"]
    },
    coverImage: {
        type: String,
        required: [true, "Cover image is required"]
    },
    tags: {
        type: [String],
        default: []
    },
    isPublished: {
        type: Boolean,
        default: true
    }
}, { timestamps: true });

const Blog = mongoose.models.Blog || mongoose.model("Blog", BlogSchema);

export default Blog; 