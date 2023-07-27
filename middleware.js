const Campground = require("./modeldata/campground")
const Review = require('./modeldata/review');
const {campgroundSchema,reviewSchema} = require('./schemas')
const ExpressError = require('./utility/exrror');

module.exports.authcheck = (req,res,next)=>{
    if (!req.isAuthenticated()){
        req.flash('error','You must be signed in')
        return res.redirect('/login')
    }else{
        next()
    }
    
}

module.exports.isOwner = async(req,res,next)=>{
    const {id} = req.params;
    const campground = await Campground.findById(id)
    if (! campground.owner.equals(req.user._id)){
        req.flash('error','You do not have permission to do that')
        return res.redirect(`/campgrounds/${campground._id}`)
    }else{
        next()
    }
}

module.exports.validateCampground = (req,res,next)=>{
    const {error} = campgroundSchema.validate(req.body);
    if (error){
        const msg = error.details.map(el =>el.message).join(', ')
        throw new ExpressError(400, msg)
    }else{
        next();
    }
}


module.exports.validateReview = (req,res,next)=>{
    const {error} = reviewSchema.validate(req.body);
    if (error){
        const msg = error.details.map(el =>el.message).join(', ')
        throw new ExpressError(400, msg)
    }else{
        next();
    }
}

module.exports.isAuthor = async(req,res,next)=>{
    const {id,reviewid} = req.params;
    const review = await Review.findById(reviewid)
    if (! review.author.equals(req.user._id)){
        req.flash('error','You do not have permission to do that')
        return res.redirect(`/campgrounds/${id}`)
    }else{
        next()
    }
}