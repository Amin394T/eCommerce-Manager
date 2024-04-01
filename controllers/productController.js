import Product from "../models/productModel.js";
import { unlink } from "fs";

export function createProduct(req, res) {
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

  product
    .save()
    .then(() => {
      res.status(201).json({ message: "Product saved successfully!" });
    })
    .catch((error) => {
      res.status(400).json({ error: error });
    });
}

export function updateProduct(req, res) {
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

  Product.updateOne({ _id: req.params.id }, product)
    .then((product) => {
      res.status(201).json({ message: "Product updated successfully!" });
    })
    .catch((error) => {
      res.status(400).json({ error: error });
    });
}

export function findProduct(req, res) {
  Product.findOne({ _id: req.params.id })
    .then((product) => {
      res.status(200).json(product);
    })
    .catch((error) => {
      res.status(400).json({ error: error });
    });
}

export function findAllProducts(req, res) {
  Product.find()
    .then((products) => {
      res.status(200).json(products);
    })
    .catch((error) => {
      res.status(400).json({ error: error });
    });
}

export function deleteProduct(req, res) {
  Product.findOne({ _id: req.params.id }).then((product) => {
    if (!product)
      return res.status(404).json({ error: new Error("Product not found.") });

    /* TO-DO: enable deletion for product creator only.
    if (product.userId != req.authorization.userId)
      return res.status(401).json({ error: new Error("Not authorized.") });
    */

    if (req.file) {
      const filename = product.image.split("/images/")[1];
      unlink("media/images/" + filename, (err) => {
        if (err) {
          console.error("Error deleting file:", err);
        }
        console.log("File deleted successfully");
      });
    }
    Product.deleteOne({ _id: req.params.id })
      .then(() => {
        res.status(200).json({ message: "Product deleted successfully!" });
      })
      .catch((error) => {
        res.status(400).json({ error: error });
      });
  });
}
