import mongoose from "mongoose";

const ServiceSchema = new mongoose.Schema({
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
    description: {
        type: String,
        required: [true, "Description is required"]
    },
    icon: {
        type: String,
        required: [true, "Icon is required"]
    },
    coverImage: {
        type: String,
        required: [true, "Cover image is required"]
    },
    content: {
        type: String,
        default: ""
    },
    isActive: {
        type: Boolean,
        default: true
    }
}, { timestamps: true });

const Service = mongoose.models.Service || mongoose.model("Service", ServiceSchema);

export default Service; 