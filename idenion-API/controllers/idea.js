const db = require("../db/connect.js");
const { StatusCodes } = require("http-status-codes");
const { BadRequestError } = require("../errors");

const filterIdeas = async (req, res) => {
  res.status(StatusCodes.OK).json(req.finalData);
};

const getSingleIdea = async (req, res) => {
  res.status(StatusCodes.CREATED).json(req.idea);
};

const publishIdea = async (req, res) => {
  const { name, description, areaOfInterest } = req.body;
  var { author } = req.body;
  const userId = req.user.userId;
  if (
    !name ||
    !description ||
    !areaOfInterest ||
    !userId ||
    !req.newVideoFilename ||
    !req.newThumbnailFilename ||
    !req.urlForVideo ||
    !req.urlForThumbnail
  ) {
    throw new BadRequestError("Please provide all the credentials");
  }
  if (!author) {
    author = null;
  }
  try {
    const sql =
      "INSERT INTO ideas (name, videourl, description, author, areaofinterest, userId, thumbnail) VALUES ($1, $2, $3, $4, $5, $6, $7);";

    await db.query(sql, [
      name,
      req.newVideoFilename,
      description,
      author,
      areaOfInterest,
      userId,
      req.newThumbnailFilename,
    ]);
  } catch (error) {
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: "Error while saving to database" });
  }
  res.status(StatusCodes.CREATED).json({
    message: "idea create success",
    videoUrl: req.urlForVideo,
    thumbnailUrl: req.urlForThumbnail,
  });
};

module.exports = {
  publishIdea,
  getSingleIdea,
  filterIdeas,
};
