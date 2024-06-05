const { InternalServerError, BadRequestError } = require("../errors");
const db = require("../db/connect.js");
const { StatusCodes } = require("http-status-codes");
const { getObjectUrl } = require("../helpers/s3Helper.js");

const filterMiddleware = async (req, res, next) => {
  const {
    name,
    author,
    areaOfInterest,
    rating,
    numberOfRating,
    page,
    limit,
    sort,
  } = req.query;
  var cnt = 1;
  var sql = "SELECT * FROM ideas WHERE";
  var inputs = [];
  if (name) {
    sql += " LOWER(name) LIKE '%' || $" + cnt + " || '%'";
    cnt++;
    inputs.push(name.toLowerCase());
  }
  if (author) {
    if (cnt > 1) sql += " AND";
    sql += " LOWER(author) LIKE '%' || $" + cnt + " || '%'";
    cnt++;
    inputs.push(author.toLowerCase());
  }
  if (areaOfInterest) {
    if (cnt > 1) sql += " AND";
    JSON.parse(areaOfInterest).forEach((item, index) => {
      if (index > 0) sql += " AND";
      sql += " $" + cnt + " = ANY (areaofinterest)";
      cnt++;
      inputs.push(item);
    });
  }
  if (rating) {
    if (cnt > 1) sql += " AND";
    sql += " rating >= " + rating;
  }
  if (numberOfRating) {
    if (cnt > 1) sql += " AND";
    sql += " numberofrating >= " + numberOfRating;
  }
  if (sort) {
    sql += " ORDER BY publishdate " + sort;
  }
  try {
    var data = await db.query(sql, inputs);
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
      };

      sendData.push(obj);
    }
    const pageNew = page ? Number(page) : 1;
    const limitNew = limit ? Number(limit) : 10;
    const skip = (pageNew - 1) * limitNew;
    sendData = sendData.splice(skip, limitNew);
    req.finalData = sendData;
    await next();
  } catch (error) {
    throw new InternalServerError("Error using filter");
  }
};

module.exports = filterMiddleware;
