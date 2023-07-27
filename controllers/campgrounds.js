const Campground = require('../modeldata/campground');
const {cloudinary} = require('../couldinary/index')
const mbxGeocoding = require("@mapbox/mapbox-sdk/services/geocoding");
const mapBoxToken = process.env.MAPBOX_TOKEN;
const geocoder = mbxGeocoding({ accessToken: mapBoxToken });



module.exports.index = async(req,res)=>{
    const campground = await Campground.find({})
    res.render('campgrounds/index', {campground})
}

module.exports.renderNew = (req,res)=>{
    res.render('campgrounds/new')
}

module.exports.addCamp = async(req,res)=>{
    const geo = await geocoder.forwardGeocode({
        query: req.body.campground.location,
        limit: 1
    }).send()
    const campground = new Campground(req.body.campground);
    campground.geometry = geo.body.features[0].geometry
    campground.images = req.files.map(f =>({url:f.path, filename: f.filename}))
    campground.owner = req.user._id
    await campground.save();
    console.log(campground)
    req.flash('success','Added New Campground')
    res.redirect(`/campgrounds/${campground._id}`)
}

module.exports.details = async(req,res)=>{
    const {id} = req.params;
    const campground = await Campground.findById(id).populate({path:'reviews',populate:{path:'author'}}).populate('owner');
    res.render('campgrounds/details', {campground})

}

module.exports.renderUpdate = async(req,res)=>{
    const campground = await Campground.findById(req.params.id);
    res.render('campgrounds/update', {campground})
}

module.exports.update = async(req,res)=>{
    const {id} = req.params;
    const campground = await Campground.findByIdAndUpdate(id, {...req.body.campground}, {new: true});
    imgs= req.files.map(f =>({url:f.path, filename: f.filename}))
    campground.images.push(...imgs)
    if (req.body.deleteImages){
        for (let fn of req.body.deleteImages){
            await cloudinary.uploader.destroy(fn);
        }
       await campground.updateOne({$pull: {images: {filename:{$in : req.body.deleteImages}}}})
    }
    await campground.save()
    req.flash('success','Updated Campground Informations')
    res.redirect(`/campgrounds/${campground._id}`)
}

module.exports.delete = async(req,res)=>{
    const {id} = req.params;
    await Campground.findByIdAndDelete(id)
    req.flash('success','Deleted The Campground')
    res.redirect('/campgrounds')
}