import { BadRequestError, NotAuthorizedError } from "@myshopping-app/common";
import { AddImagesDto, CreateProductDto, DeleteImagesDto, DeleteProductDto, UpdateProductDto } from "./dtos/product.dto";
import { productService, ProductService } from "./product/product.service";
import { NextFunction } from "express";
import mongoose, { DeleteOneModel } from "mongoose";

export class SellerService {
    constructor(public productService: ProductService) {}

    async addProduct(createProductDto: CreateProductDto)
    {
        return await this.productService.create(createProductDto);
    }

    async updateProduct(updateProductDto: UpdateProductDto) {
        const { productId} = updateProductDto;
        // Validate ObjectId format
        if (!mongoose.Types.ObjectId.isValid(productId)) {
            throw new BadRequestError('Invalid Product ID');
        }
        
        const product = await this.productService.getProductById(updateProductDto.productId);
        
        if(!product) { 
            return new BadRequestError('Product Not Found');
        }
        if(product.user.toString() !== updateProductDto.userId)
        {
            return new NotAuthorizedError();
        }
        return await this.productService.updateProduct(updateProductDto);
    }

    async deleteProduct(deleteProductDto: DeleteProductDto) {
        const { productId } = deleteProductDto;

         // Validate ObjectId format
        if (!mongoose.Types.ObjectId.isValid(productId)) {
            throw new BadRequestError('Invalid Product ID');
        }

        const product = await this.productService.getProductById(productId);
        if(!product) { 
            return new BadRequestError('Product Not Found');
        }
        if(product.user.toString() !== deleteProductDto.userId)
        {
            return new NotAuthorizedError();
        }

        return await this.productService.deleteProduct(deleteProductDto);
    }

    async addProductImages(addImageDto: AddImagesDto) 
    {
        const { productId } = addImageDto;

         // Validate ObjectId format
        if (!mongoose.Types.ObjectId.isValid(productId)) {
            throw new BadRequestError('Invalid Product ID');
        }
        
        const product = await this.productService.getProductById(productId);
        if(!product) { 
            return new BadRequestError('Product Not Found');
        }
        if(product.user.toString() !== addImageDto.userId)
        {
            return new NotAuthorizedError();
        }

        return await this.productService.addProductImages(addImageDto);

    }

    async deleteProductImages(deleteImageDto: DeleteImagesDto) 
    {
        const { productId } = deleteImageDto;

         // Validate ObjectId format
        if (!mongoose.Types.ObjectId.isValid(productId)) {
            throw new BadRequestError('Invalid Product ID');
        }
        
        const product = await this.productService.getProductById(productId);
        if(!product) { 
            return new BadRequestError('Product Not Found');
        }
        if(product.user.toString() !== deleteImageDto.userId)
        {
            return new NotAuthorizedError();
        }

        return await this.productService.deleteProductImages(deleteImageDto);

    }
}

export const sellerService = new SellerService(productService);