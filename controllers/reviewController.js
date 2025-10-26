import Review from "../models/reviewModel.js";
import { raiseError } from "../utilities/ErrorMsg.js";


export async function findProductReviews(req, res, next) {
  try {
    const reviews = await Review.find({
      product: req.params.product,
      status: { $in: ["normal", "edited"] }
    })
    .populate('user', 'username');

    res.status(200).json(reviews);
  }
  catch (error) {
    next(error);
  }
}


export async function findMerchantReviews(req, res, next) {
  try {
    const reviews = await Review.find({
      user: req.params.merchant,
      status: { $in: ["normal", "edited"] }
    });

    res.status(200).json(reviews);
  }
  catch (error) {
    next(error);
  }
}


export async function createReview(req, res, next) {
  try {
    const { product, comment, rating } = req.body;

    if (!product || !comment || !rating)
      throw raiseError('Missing Required Data!', 422);

    const review = await Review.create({ product, comment, rating, user: req.authorization.userId});

    res.status(201).json(review);
  }
  catch (error) {
    next(error);
  }
}


export async function updateReview(req, res, next) {
  try {
    const { comment, rating } = req.body;

    if (!comment || !rating)
      throw raiseError('Missing Required Data!', 422);

    const review = await Review.findOne({ _id: req.params.id });
    if (!review)
      throw raiseError('Review not Found!', 404);
    if (review.user != req.authorization.userId)
      throw raiseError('Access Forbidden!', 403);

    const timeLimit = new Date(Date.now() - 24 * 60 * 60 * 1000);
    if (new Date(review.date) < timeLimit)
      throw raiseError('Time Limit Exceeded!', 403);

    review.comment = comment;
    review.rating = rating;
    review.status = "edited";
    await review.save();

    res.status(200).json(review);
  }
  catch (error) {
    next(error);
  }
}


export async function deleteReview(req, res, next) {
  try {
    const review = await Review.findOne({ _id: req.params.id });
    if (!review)
      throw raiseError('Review not Found!', 404);
    if (review.user != req.authorization.userId)
      throw raiseError('Access Forbidden!', 403);

    const timeLimit = new Date(Date.now() - 24 * 60 * 60 * 1000);
    if (new Date(review.date) < timeLimit)
      throw raiseError('Time Limit Exceeded!', 403);

    review.status = "removed";
    await review.save();

    res.status(200).json(review);
  }
  catch (error) {
    next(error);
  }
}