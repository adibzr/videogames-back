const { Videogame, Genre } = require("../db");
const axios = require("axios");
require("dotenv").config();
const { API_KEY } = process.env;

const apiInfo = async () => {
  const urls = [];
  for (let i = 1; i < 6; i++) {
    const urlPage = axios(
      `https://api.rawg.io/api/games?key=${API_KEY}&page=${i}`
    );
    urls.push(urlPage);
  }
  const allApiData = [];

  const info = await Promise.all(urls);
  info.map((eachApiPage) => {
    return eachApiPage.data.results.map((apiResult) => {
      allApiData.push({
        id: apiResult.id,
        name: apiResult.name,
        img: apiResult.background_image,
        releaseDate: apiResult.released,
        rating: apiResult.rating,
        genres: apiResult.genres,
        platforms: apiResult.platforms,
      });
    });
  });
  return allApiData;
};

const dbInfo = async () => {
  let dbData = await Videogame.findAll({
    include: {
      model: Genre,
      attributes: ["name"],
      throught: {
        attributes: [],
      },
    },
  });
  return dbData;
};

const allVideogames = async () => {
  const apiVideogames = await apiInfo();
  const dbVideogames = await dbInfo();
  const videogames = apiVideogames.concat(dbVideogames);
  return videogames;
};

const filterCreateApi = async (condition) => {
  if (condition === "created") {
    return await dbInfo();
  }
  if (condition === "fromApi") {
    return await apiInfo();
  }
  return await allVideogames();
};

module.exports = {
  apiInfo,
  dbInfo,
  allVideogames,
  filterCreateApi,
};
