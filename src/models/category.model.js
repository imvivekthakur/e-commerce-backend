import mongoose, {Schema} from "mongoose";

const categorySchema = new Schema({
    name: {
        tyep: String,
        required: true
    }
})

export const Category = mongoose.model("Category", categorySchema);