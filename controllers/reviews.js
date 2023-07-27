const Campground = require('../modeldata/campground');
const Review = require('../modeldata/review');

module.exports.add = async(req,res)=>{
    const campground = await Campground.findById(req.params.id);
    const review = new Review(req.body.review);
    review.author = req.user._id
    campground.reviews.push(review)
    await review.save();
    await campground.save()
    req.flash('success','Added Your Review')
    res.redirect(`/campgrounds/${campground._id}`)

}

module.exports.delete = async(req,res)=>{
    const {id, reviewid} = req.params;
    await Campground.findByIdAndUpdate(id, {$pull: {reviews: reviewid}})
    await Review.findByIdAndDelete(reviewid)
    req.flash('success','Deleted Your Review')
    res.redirect(`/campgrounds/${id}`)
}