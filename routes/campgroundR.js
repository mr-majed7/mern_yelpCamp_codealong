const express = require('express');
const router = express.Router();
const asyncCatch = require('../utility/asyncCatch');
const campgrounds = require('../controllers/campgrounds')
const {authcheck,isOwner,validateCampground} = require('../middleware')
const multer = require('multer');
const { storage } = require('../couldinary');
const upload = multer({ storage });


router.route('/')
    .get(asyncCatch((campgrounds.index)))
    .post(authcheck, upload.array('image'),validateCampground, asyncCatch(campgrounds.addCamp))

router.get('/new', authcheck,campgrounds.renderNew)

router.route('/:id')
    .get(authcheck,asyncCatch(campgrounds.details))
    .put(authcheck,isOwner,upload.array('image'), validateCampground, asyncCatch(campgrounds.update))
    .delete(authcheck,isOwner, asyncCatch(campgrounds.delete))

router.get('/:id/update', authcheck,isOwner, asyncCatch(campgrounds.renderUpdate))


module.exports = router

