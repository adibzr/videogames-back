const { Router } = require("express");
const {
  getVideogameById,
  getAllVideogames,
  postVideogame,
  deleteVideogame,
  updateVideogame,
} = require("../controllers/videogames");
const router = Router();

router.get("/", getAllVideogames);

router.get("/:idVideogame", getVideogameById);

router.post("/:idVideogame", updateVideogame);

router.post("/", postVideogame);

router.delete("/", deleteVideogame);

module.exports = router;
