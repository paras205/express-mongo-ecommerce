const sharp = require("sharp");

const resizeImage = async (req, res, next) => {
  if (!req.file) return next();
  req.file.filename = `${req.file.originalname}-${Date.now()}.jpeg`;
  await sharp(req.file.buffer)
    .resize(500, 500)
    .toFormat("jpeg")
    .jpeg({ quality: 90 })
    .toFile(`uploads/images/${req.file.filename}`);
  next();
};

module.exports = resizeImage;
