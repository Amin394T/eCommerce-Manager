import Product from "../models/productModel.js";
import { raiseError } from "../utilities/ErrorMsg.js";


export async function findProduct(req, res, next) {
  try {
    const product = await Product.findOne({ reference: req.params.id });
    if (!product) {
      throw raiseError('Product not found', 404);
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
      throw raiseError('No products found', 404);
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
      throw raiseError('No products found', 404);
    }
    res.status(200).json(products);
  }
  catch (error) {
    next(error);
  }
}


export async function createProduct(req, res, next) {
  try {
    const productData = { 
      ...JSON.parse(req.body.product), 
      image: req.file?.filename,
      owner: req.authorization.userId
    };

    const existingProduct = await Product.findOne({ reference: productData.reference });
    if (existingProduct)
      throw raiseError('Product already exists', 400);

    const product = await Product.create(productData);
    
    res.status(201).json({ 
      message: "Product creation succeeded",
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
  try {
    const productData = JSON.parse(req.body.product || '{}');
    if (req.file?.filename)
      productData.image = req.file.filename;

    const existing = await Product.findOne({ reference: req.params.id });
    if (!existing)
      throw raiseError('Product not found', 404);

    const { name, description, image, price, type, quantity, discount, specification, delivery, policy } = productData;
    const updated = await Product.findOneAndUpdate(
      { reference: req.params.id },
      { $set: { name, description, image, price, type, quantity, discount, specification, delivery, policy } },
      { new: true }
    );

    res.status(200).json({
      message: "Product update succeeded",
      product: updated
    });
  } catch (error) {
    next(error);
  }
}


export async function deleteProduct(req, res, next) {
  try {
    const product = await Product.findOneAndUpdate(
      { 
        reference: req.params.id,
        owner: req.authorization.userId 
      },
      { status: 'deleted' },
      { new: true }
    );

    if (!product) {
      throw raiseError('Product not found', 404);
    }

    res.status(200).json({ 
      message: "Product deletion succeeded",
      reference: req.params.id
    });
  }
  catch (error) {
    next(error);
  }
}
