import { CreateProductDto, ProductDoc, ProductModel } from "@myshopping-app/common";
import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    title: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    images: [{
        src: { type: String, required: true }
    }]
});

productSchema.statics.build = (createProductDto: CreateProductDto) => {
    return new Product(createProductDto);
};

export const Product = (mongoose.models.ProductModel as ProductModel) || mongoose.model<ProductDoc, ProductModel>("Product", productSchema);