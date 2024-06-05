const { InternalServerError, BadRequestError } = require("../errors");
const db = require("../db/connect.js");
const { StatusCodes } = require("http-status-codes");
const { getObjectUrl } = require("../helpers/s3Helper.js");

const getS3GetObjectUrl = async (req, res, next) => {
  const ideaId = req.params.ideaId;
  if (!ideaId) {
    throw new BadRequestError("Please provide idea id");
  }
  const sql = "SELECT * FROM ideas WHERE id = $1";
  try {
    const idea = await db.query(sql, [ideaId]);
    if (idea.rowCount == 0) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ message: `No idea with id ${ideaId} exists` });
    }
    const urlForThumbnail = await getObjectUrl(
      "idenion",
      idea.rows[0].thumbnail
    );
    const urlForVideo = await getObjectUrl("idenion", idea.rows[0].videourl);
    const sendIdea = {
      name: idea.rows[0].name,
      description: idea.rows[0].description,
      videoUrl: urlForVideo,
      author: idea.rows[0].author,
      areaOfInterest: idea.rows[0].areaofinterest,
      rating: idea.rows[0].rating,
      numberOfRating: idea.rows[0].numberofrating,
      ideaId: idea.rows[0].id,
      userId: idea.rows[0].userId,
      thumbnailUrl: urlForThumbnail,
    };
    req.idea = sendIdea;
    next();
  } catch (error) {
    throw new InternalServerError("Error generating put object url");
  }
};

module.exports = getS3GetObjectUrl;
