const Product = require("../models/productModel");

exports.createProduct = (req, res) => {
  const product = new Product({
    reference: req.body.reference,
    name: req.body.name,
    description: req.body.description,
    image: req.body.image,
    price: req.body.price,
    category: req.body.category,
  });

  product
    .save()
    .then(() => {
      res.status(201).json({ message: "Product saved successfully!" });
    })
    .catch((error) => {
      res.status(400).json({
        error: error,
      });
    });
};

exports.updateProduct = (req, res) => {
  const product = new Product({
    _id: req.params.id,
    reference: req.body.reference,
    name: req.body.name,
    description: req.body.description,
    image: req.body.image,
    price: req.body.price,
    category: req.body.category,
  });

  Product.updateOne({ _id: req.params.id }, product)
    .then((product) => {
      res.status(201).json({ message: "Product updated successfully!" });
    })
    .catch((error) => {
      res.status(400).json({
        error: error,
      });
    });
};

exports.findProduct = (req, res) => {
  Product.findOne({ _id: req.params.id })
    .then((product) => {
      res.status(200).json(product);
    })
    .catch((error) => {
      res.status(400).json({ error: error });
    });
};

exports.findAllProducts = (req, res) => {
  Product.find()
    .then((products) => {
      res.status(200).json(products);
    })
    .catch((error) => {
      res.status(400).json({ error: error });
    });
};

exports.deleteProduct = (req, res) => {
  Product.deleteOne({ _id: req.params.id })
    .then(() => {
      res.status(200).json({ message: "Product deleted successfully!" });
    })
    .catch((error) => {
      res.status(400).json({ error: error });
    });
};
