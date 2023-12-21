import mongoose, {Schema, mongo} from "mongoose";

const orderItemSchema = new Schema({
    productId: {
        type: Schema.Types.ObjectId,
        ref: "Product"
    },
    quantity: {
        type: Number,
        required: true
    }
});

const orderSchema = new Schema({
    orderPrice: {
        type: Number,
        required: true
    },
    customer: {
        type: Schema.Types.ObjectId,
        ref: "User"
    },
    orderItems: {   
        type: [orderItemSchema],
    },
    address: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ["PENDING", "CANCELLED", "DELIVERED"],
        default: "PENDING"
    }
})

export const Order = mongoose.model("Order", orderSchema);