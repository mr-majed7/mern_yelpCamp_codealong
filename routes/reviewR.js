const express = require('express');
const router = express.Router({mergeParams: true});
const asyncCatch = require('../utility/asyncCatch');
const {authcheck,validateReview,isAuthor} = require('../middleware')
const reviews = require('../controllers/reviews');


router.post('/',authcheck, validateReview, asyncCatch(reviews.add));

router.delete('/:reviewid',authcheck,isAuthor, asyncCatch(reviews.delete))

module.exports = router