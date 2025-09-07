import { unlink } from "node:fs";
import { promisify } from 'node:util';

import Product from "../models/productModel.js";
import { createError } from "../utilities/ErrorMsg.js";


const unlinkAsync = promisify(unlink);

export async function createProduct(req, res, next) {
  const productData = req.file 
    ? {
        ...JSON.parse(req.body.product),
        image: req.protocol + "://" + req.get("host") + "/media/images/" + req.file.filename
      }
    : req.body;

  const product = new Product({
    reference: productData.reference,
    name: productData.name,
    description: productData.description,
    image: productData.image,
    price: productData.price,
    category: productData.category,
    quantity: productData.quantity,
    owner: req.authorization.userId,
  });

  try {
    const existingProduct = await Product.findOne({ reference: product.reference });
    if (existingProduct) {
      throw createError('Product with this reference already exists', 400);
    }

    await product.save();
    res.status(201).json({ 
      message: "Product saved successfully!",
      product: {
        id: product._id,
        name: product.name,
        reference: product.reference
      }
    });
  }
  catch (error) {
    next(error);
  }
}

export async function updateProduct(req, res, next) {
  const productData = req.file 
    ? {
        ...JSON.parse(req.body.product),
        image: req.protocol + "://" + req.get("host") + "/media/images/" + req.file.filename
      }
    : req.body;

  const product = {
    name: productData.name,
    description: productData.description,
    image: productData.image,
    price: productData.price,
    category: productData.category,
    quantity: productData.quantity,
  };

  try {
    const existingProduct = await Product.findOne({ reference: req.params.id });
    if (!existingProduct) {
      throw createError('Product not found', 404);
    }

    if (existingProduct.owner != req.authorization.userId) {
      throw createError('Not authorized to modify this product', 403);
    }

    const result = await Product.updateOne({ reference: req.params.id }, product);
    if (result.modifiedCount === 0) {
      throw createError('No changes were made to the product', 400);
    }

    res.status(200).json({ 
      message: "Product updated successfully!",
      product: {
        reference: req.params.id,
        ...product
      }
    });
  }
  catch (error) {
    next(error);
  }
}


export async function findProduct(req, res, next) {
  try {
    const product = await Product.findOne({ reference: req.params.id });
    if (!product) {
      throw createError('Product not found', 404);
    }
    res.status(200).json(product);
  }
  catch (error) {
    next(error);
  }
}


export async function findCategoryProducts(req, res, next) {
  try {
    const products = await Product.find({ category: req.params.category });
    if (!products.length) {
      throw createError('No products found in this category', 404);
    }
    res.status(200).json(products);
  }
  catch (error) {
    next(error);
  }
}


export async function findAllProducts(req, res, next) {
  try {
    const products = await Product.find();
    if (!products.length) {
      throw createError('No products found', 404);
    }
    res.status(200).json(products);
  }
  catch (error) {
    next(error);
  }
}


export async function deleteProduct(req, res, next) {
  try {
    const product = await Product.findOne({ reference: req.params.id });
    if (!product) {
      throw createError('Product not found', 404);
    }

    if (product.owner != req.authorization.userId) {
      throw createError('Not authorized to delete this product', 403);
    }

    const result = await Product.updateOne(
      { reference: req.params.id },
      { status: 'deleted' }
    );

    if (result.modifiedCount === 0) {
      throw createError('Failed to delete product', 400);
    }

    res.status(200).json({ 
      message: "Product deleted successfully!",
      reference: req.params.id
    });
  }
  catch (error) {
    next(error);
  }
}
