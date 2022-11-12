const { Genre } = require("../db");
const axios = require("axios");
require("dotenv").config();
const { API_KEY } = process.env;


const getGenres = async (req, res) => {
    const genres = await axios(`https://api.rawg.io/api/genres?key=${API_KEY}`);
    const genreInfo = await genres.data?.results?.map((element) => {
      return {
        id: element.id,
        name: element.name,
      };
    });
  
    await Genre.bulkCreate(genreInfo, { ignoreDuplicates: true });
  
    const genreDb = await Genre.findAll();
    res.status(200).json(genreDb);
  }


  module.exports = getGenres;