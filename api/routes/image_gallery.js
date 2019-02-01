const express = require("express");
const router = express.Router();

const galleryController = require('../controllers/image_gallery')

router.get("/", galleryController.getImages);


module.exports = router;