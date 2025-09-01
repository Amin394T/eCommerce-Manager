import Product from "../models/productModel.js";
import { unlink } from "fs";
import { createError } from "../utilities/ErrorMsg.js";
import { promisify } from 'util';

const unlinkAsync = promisify(unlink);

export async function createProduct(req, res, next) {
  let product = new Product();
  if (req.file) {
    req.body.product = JSON.parse(req.body.product);
    const url = req.protocol + "://" + req.get("host");

    product = new Product({
      reference: req.body.product.reference,
      name: req.body.product.name,
      description: req.body.product.description,
      image: url + "/media/images/" + req.file.filename,
      price: req.body.product.price,
      category: req.body.product.category,
    });
  } else {
    product = new Product({
      reference: req.body.reference,
      name: req.body.name,
      description: req.body.description,
      image: req.body.image,
      price: req.body.price,
      category: req.body.category,
    });
  }

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
  } catch (error) {
    next(error);
  }
}

export async function updateProduct(req, res, next) {
  let product = new Product({ _id: req.params.id });
  if (req.file) {
    req.body.product = JSON.parse(req.body.product);
    const url = req.protocol + "://" + req.get("host");

    product = {
      _id: req.params.id,
      reference: req.body.product.reference,
      name: req.body.product.name,
      description: req.body.product.description,
      image: url + "/media/images/" + req.file.filename,
      price: req.body.product.price,
      category: req.body.product.category,
    };
  } else {
    product = {
      _id: req.params.id,
      reference: req.body.reference,
      name: req.body.name,
      description: req.body.description,
      image: req.body.image,
      price: req.body.price,
      category: req.body.category,
    };
  }

  try {
    const existingProduct = await Product.findById(req.params.id);
    if (!existingProduct) {
      throw createError('Product not found', 404);
    }

    const result = await Product.updateOne({ _id: req.params.id }, product);
    if (result.modifiedCount === 0) {
      throw createError('No changes were made to the product', 400);
    }

    res.status(200).json({ 
      message: "Product updated successfully!",
      product: {
        id: req.params.id,
        ...product
      }
    });
  } catch (error) {
    next(error);
  }
}

export async function findProduct(req, res, next) {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      throw createError('Product not found', 404);
    }
    res.status(200).json(product);
  } catch (error) {
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
  } catch (error) {
    next(error);
  }
}

export async function deleteProduct(req, res, next) {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      throw createError('Product not found', 404);
    }

    /* TO-DO: enable deletion for product creator only.
    if (product.userId !== req.authorization.userId) {
      throw createError('Not authorized to delete this product', 403);
    }
    */

    if (product.image) {
      try {
        const filename = product.image.split("/images/")[1];
        await unlinkAsync("media/images/" + filename);
      } catch (error) {
        // Log error but don't fail the request if image deletion fails
        console.error('Error deleting image file:', error);
      }
    }

    await Product.deleteOne({ _id: req.params.id });
    res.status(200).json({ 
      message: "Product deleted successfully!",
      productId: req.params.id
    });
  } catch (error) {
    next(error);
  }
}
