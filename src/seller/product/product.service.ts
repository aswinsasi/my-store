import { ProductModel, uploadDir } from "@myshopping-app/common";
import { Product } from "./product.model";
import { AddImagesDto, CreateProductDto, DeleteImagesDto, DeleteProductDto, UpdateProductDto } from "../dtos/product.dto";
import fs from 'fs';
import path from 'path';

export class ProductService {
    constructor(public productModel: ProductModel) {
    }

    async getProductById(productId: string) {
        return await this.productModel.findById(productId);
    }

    async create(createProductDto: CreateProductDto) {
        const images = this.generateProductImages(createProductDto.files);
        const product = await new Product({
            title: createProductDto.title,
            price: createProductDto.price,
            user: createProductDto.userId,
            images: images
        });

        return await product.save();
    }

    async updateProduct(updateProductDto: UpdateProductDto) {
        return await this.productModel.findOneAndUpdate({ _id: updateProductDto.productId },
           { $set: { title: updateProductDto.title, price: updateProductDto.price } },
           { new: true }
        )
    }

    async addProductImages(addImageDto: AddImagesDto) 
    {
        const images = this.generateProductImages(addImageDto.files);
        return await this.productModel.findOneAndUpdate({ _id: addImageDto.productId },
           { $push: { images: { $each: images } } },
           { new: true }
        );
    }

    async deleteProductImages(deleteImageDto: DeleteImagesDto) 
    {
        
        return await this.productModel.findOneAndUpdate({ _id: deleteImageDto.productId },
           { $pull: { images: { _id: { $in: deleteImageDto.imageIds } } } },
           { new: true }
        );
    }


    async deleteProduct(deleteProductDto: DeleteProductDto) {
        return await this.productModel.findByIdAndDelete(deleteProductDto.productId);
    }

    generateBase64Url(contentTye: string, buffer: Buffer)
    {
        return `data:${contentTye}:base64,${buffer.toString('base64')}`;
    }

    generateProductImages(files: CreateProductDto['files']) : Array<{ src: string}>
    {
        let images: Array<Express.Multer.File>;

        if(typeof files == 'object') {
            images = Object.values(files).flat();
        }else {
            images = files ? [...files] : [];
        }

        return images.map((file: Express.Multer.File) => {
              let srcObj = { src: this.generateBase64Url(file.mimetype, fs.readFileSync(path.join(uploadDir + file.filename)))}
             // fs.unlink(path.join(uploadDir+file.filename), ()=>{})
              return srcObj;
        })
    }
}

export const productService = new ProductService(Product);



