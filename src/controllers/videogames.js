const { Videogame, Genre } = require("../db");
const axios = require("axios");
const { dbInfo, allVideogames, filterCreateApi } = require("./util");
require("dotenv").config();
const { API_KEY } = process.env;

const getAllVideogames = async (req, res) => {
  try {
    let videogames = await allVideogames(API_KEY);
    const createdApi = req.query.createdApi;
    const nameFilter = req.query.name;

    if (nameFilter) {
      const filteredByName = videogames.filter((element) => {
        return element.name.toLowerCase().includes(nameFilter.toLowerCase());
      });
      if (filteredByName.length) {
        videogames = filteredByName;
      } else {
        return res
          .status(404)
          .send(`There is no video game named "${nameFilter}"`);
      }
    }

    if (createdApi) {
      if (videogames.length) {
        videogames = await filterCreateApi(createdApi);
      } else {
        return res.status(404).send(`no created videogames`);
      }
    }
    res.status(200).send(videogames);
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
};

const getVideogameById = async (req, res) => {
  const { idVideogame } = req.params;
  try {
    const apiGameDetail = await axios(
      `https://api.rawg.io/api/games/${idVideogame}?key=${API_KEY}`
    );
    const apiData = {
      id: apiGameDetail.data.id,
      name: apiGameDetail.data.name,
      img: apiGameDetail.data.background_image,
      description: apiGameDetail.data.description_raw,
      releaseDate: apiGameDetail.data.released,
      rating: apiGameDetail.data.rating,
      platforms: apiGameDetail.data.platforms,
      genres: apiGameDetail.data.genres,
    };
    res.status(200).json(apiData);
  } catch (error) {
    const dbData = await dbInfo();
    const foundGame = dbData.find((videogame) => {
      return videogame.dataValues.id === idVideogame;
    });
    foundGame
      ? res.status(200).json(foundGame)
      : res.status(404).send("No game with that id");
  }
};

const postVideogame = async (req, res) => {
  let {
    name,
    img,
    description,
    releaseDate,
    rating,
    platforms,
    createdInDb,
    genres,
  } = req.body;

  releaseDate = releaseDate === "Invalid date" ? releaseDate : null;
  rating = rating ? rating : null;

  try {
    const gameCreate = await Videogame.create({
      name,
      img,
      description,
      platforms,
      createdInDb,
      releaseDate,
      rating,
    });
    const genreDb = await Genre.findAll({
      where: { name: genres },
    });
    gameCreate.addGenre(genreDb);
    res.status(200).send("Video game created succesfully");
  } catch (error) {
    res.status(404).send("cannot create");
  }
};

const deleteVideogame = async (req, res) => {
  console.log(req.query);
  try {
    const { idVideogame } = req.query;

    const deleting = await Videogame.findAll({
      where: { id: idVideogame },
    });
    deleting.length
      ? await Videogame.destroy({
          where: { id: idVideogame },
        })
      : res.status(404).send("no game to delete");
    res.status(200).send(deleting);
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
};

const updateVideogame = async (req, res) => {
  try {
    const { idVideogame } = req.params;
    let { name, img, description, releaseDate, rating, platforms, genres } =
      req.body;

    releaseDate = releaseDate === "Invalid date" ? releaseDate : null;
    rating = rating ? rating : null;

    const updating = await Videogame.findOne({
      where: { id: idVideogame },
      include: {
        model: Genre,
        attributes: ["name"],
        throught: {
          attributes: [],
        },
      },
    });
    if (updating) {
      Videogame.update(
        {
          name,
          img,
          description,
          releaseDate,
          rating,
          platforms,
          genres,
        },
        {
          where: { id: idVideogame },
          include: {
            model: Genre,
            attributes: ["name"],
            throught: {
              attributes: [],
            },
          },
        }
      );
      const genreDb = await Genre.findAll({
        where: { name: genres },
      });
      updating.setGenres(genreDb);
    } else {
      res.status(404).send("Did not find game");
    }
    res.status(200).send("upgrade successfull");
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
};

module.exports = {
  getAllVideogames,
  getVideogameById,
  postVideogame,
  deleteVideogame,
  updateVideogame,
};
