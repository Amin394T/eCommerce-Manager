import Review from "../models/reviewModel.js";
import { raiseError } from "../utilities/ErrorMsg.js";


export async function readReviews(req, res) {
  try {
    const reviews = await Review.find({
      product: req.params.product,
      status: { $in: ["normal", "edited"] }
    });

    res.status(200).json(reviews);
  }
  catch (error) {
    next(error);
  }
}


export async function createReview(req, res) {
  try {
    const { product, content, rating } = req.body;

    if (!product || !content || !rating)
      throw raiseError('Missing Required Data!', 422);

    const review = await Review.create({ product, content, rating, user: req.authorization.userId});

    res.status(201).json(review.dataValues);
  }
  catch (error) {
    next(error);
  }
}


export async function updateReview(req, res) {
  try {
    const { product, content, rating } = req.body;

    if (!product || !content || !rating)
      throw raiseError('Missing Required Data!', 422);

    const review = await Review.findOne({ id: req.params.id });
    if (!review)
      throw raiseError('Review not Found!', 404);
    if (review.user != req.authorization.userId)
      throw raiseError('Access Forbidden!', 403);

    const timeLimit = new Date(Date.now() - 24 * 60 * 60 * 1000);
    if (new Date(review.date) < timeLimit)
      throw raiseError('Time Limit Exceeded!', 403);

    review.content = content;
    review.rating = rating;
    review.status = "edited";
    await review.save();

    res.status(200).json(review.dataValues);
  }
  catch (error) {
    next(error);
  }
}

export async function deleteReview(req, res) {
  try {
    const review = await Review.findOne({ id: req.params.id });
    if (!review)
      throw raiseError('Review not Found!', 404);
    if (review.user != req.authorization.userId)
      throw raiseError('Access Forbidden!', 403);

    const timeLimit = new Date(Date.now() - 24 * 60 * 60 * 1000);
    if (new Date(review.date) < timeLimit)
      throw raiseError('Time Limit Exceeded!', 403);

    review.status = "removed";
    await review.save();

    res.status(200).json(review.dataValues);
  }
  catch (error) {
    next(error);
  }
}