const { getObjectUrl } = require("../helpers/s3Helper.js");
const db = require("../db/connect.js");
const { InternalServerError } = require("../errors");

const getAllIdeasMiddleware = async (req, res, next) => {
  const { page, limit } = req.query;
  const sql = "SELECT * FROM ideas ORDER BY publishdate DESC";
  try {
    const data = await db.query(sql);
    req.nbHits = data.rowCount;
    var sendData = [];
    for (const item of data.rows) {
      const urlForThumbnail = await getObjectUrl("idenion", item.thumbnail);
      const urlForVideo = await getObjectUrl("idenion", item.videourl);
      const obj = {
        name: item.name,
        description: item.description,
        videoUrl: urlForVideo,
        author: item.author,
        areaOfInterest: item.areaofinterest,
        rating: item.rating,
        numberOfRating: item.numberofrating,
        ideaId: item.id,
        userId: item.userId,
        thumbnailUrl: urlForThumbnail,
        publishDate: item.publishdate,
      };

      sendData.push(obj);
    }
    const pageNew = page ? Number(page) : 1;
    const limitNew = limit ? Number(limit) : 6;
    const skip = (pageNew - 1) * limitNew;
    sendData = sendData.splice(skip, limitNew);
    req.finalData = sendData;

    await next();
  } catch (error) {
    throw new InternalServerError("Error fetching data");
  }
};

module.exports = getAllIdeasMiddleware;
