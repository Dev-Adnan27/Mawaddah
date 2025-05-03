import mongoose from "mongoose";

const ContactSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Name is required"],
        trim: true
    },
    email: {
        type: String,
        required: [true, "Email is required"],
        trim: true
    },
    phone: {
        type: String,
        trim: true
    },
    message: {
        type: String,
        required: [true, "Message is required"]
    },
    status: {
        type: String,
        enum: ["new", "read", "responded", "archived"],
        default: "new"
    }
}, { timestamps: true });

const Contact = mongoose.models.Contact || mongoose.model("Contact", ContactSchema);

export default Contact; 