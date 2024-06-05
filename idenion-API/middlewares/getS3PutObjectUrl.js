const { InternalServerError } = require("../errors");
const { putObjectUrl } = require("../helpers/s3Helper.js");

const getS3PutObjectUrl = async (req, res, next) => {
  const {
    videoFilename,
    videoContentType,
    thumbnailFilename,
    thumbnailContentType,
  } = req.body;
  try {
    const newVideoFilename =
      videoFilename.split(".")[0] +
      "-" +
      Date.now() +
      "." +
      videoFilename.split(".")[1];

    const newThumbnailFilename =
      thumbnailFilename.split(".")[0] +
      "-" +
      Date.now() +
      "." +
      thumbnailFilename.split(".")[1];

    const urlForVideo = await putObjectUrl(
      "idenion",
      newVideoFilename,
      videoContentType
    );
    const urlForThumbnail = await putObjectUrl(
      "idenion",
      newThumbnailFilename,
      thumbnailContentType
    );
    req.urlForVideo = urlForVideo;
    req.newVideoFilename = newVideoFilename;
    req.urlForThumbnail = urlForThumbnail;
    req.newThumbnailFilename = newThumbnailFilename;
    next();
  } catch (error) {
    throw new InternalServerError("Error generating put object url");
  }
};

module.exports = getS3PutObjectUrl;
