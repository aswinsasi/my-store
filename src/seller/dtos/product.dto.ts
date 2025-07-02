import { Request } from "express";

export interface CreateProductDto {
    title: string;
    price: number;
    userId: string;
    files: Request['files']
}

export interface UpdateProductDto {
    title: string;
    price: string;
    userId: string;
    productId: string;
}

export interface DeleteProductDto {
    productId: string;
    userId: string;
}

export interface AddImagesDto {
    productId: string;
    userId: string;
    files: Request['files']
}

export interface DeleteImagesDto {
    productId: string;
    userId: string;
    imageIds: Array<string>
}