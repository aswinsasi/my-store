import express, { Response, Request, NextFunction } from 'express';
import { BadRequestError, CustomError, requireAuth, uploadDir, Uploader } from '@myshopping-app/common';
import { sellerService } from './seller.service';

const router = express();

const uploader = new Uploader(uploadDir);

const uploadMiddlewareOption = {
    types: ['image/png', 'image/jpg', 'image/jpeg'],
    fieldName: 'image'
};

const multipleFileMiddleware = uploader.uploadMultipleFiles(uploadMiddlewareOption);

router.post('/product/new', requireAuth, multipleFileMiddleware, async(req: Request, res: Response, next: NextFunction) => {
    const { title, price } = req.body;

    if(!req.files) return next(new BadRequestError('Images are required'));

    if(req.uploaderError) return next(new BadRequestError(req.uploaderError.message));
    console.log('FILES:', req.files);
    const product = await sellerService.addProduct({
        title, 
        price, 
        userId: req.currentUser!.userId, 
        files: req.files 
    })
    
    res.status(201).send(product);
});

router.post('/product/:id/update',requireAuth, async(req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const { title, price, productId } = req.body;

    const result = await sellerService.updateProduct({
        title, 
        price, 
        userId: req.currentUser!.userId, 
        productId: id
    });

    // ❗ If product is null/undefined, do NOT proceed
    if (result instanceof CustomError) return next(result);
 
    res.status(200).send(result);
});

router.delete('/product/:id/delete', requireAuth, async(req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;

    const result = await sellerService.deleteProduct({ productId: id, userId: req.currentUser!.userId });
    if(!result) return;

    // result with empty return or
    if(result instanceof CustomError) {
        return next(result);
    }

    res.status(200).send(true);

});

router.post('/product/:id/add-images', requireAuth, multipleFileMiddleware, async(req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;

    if(!req.files) return next(new BadRequestError('Images are required'));

    if(req.uploaderError) return next(new BadRequestError(req.uploaderError.message));

    const result = await sellerService.addProductImages({ productId: id, userId: req.currentUser!.userId, files: req.files });
    if(!result) return;

    // result with empty return or
    if(result instanceof CustomError) {
        return next(result);
    }

    res.status(200).send(result);

});

router.delete('/product/:id/delete-images', requireAuth, async(req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params; console.log(req.body)
    const { imageIds } = req.body;
    console.log(imageIds);
    const result = await sellerService.deleteProductImages({ productId: id, userId: req.currentUser!.userId, imageIds });
    if(!result) return;

    // result with empty return or
    if(result instanceof CustomError) {
        return next(result);
    }

    res.status(200).send(result);

});


export { router as sellerRouter };