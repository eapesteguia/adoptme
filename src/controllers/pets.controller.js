import PetDTO from "../dto/Pet.dto.js";
import { petsService } from "../services/index.js";
import __dirname from "../utils/index.js";

const getAllPets = async (req, res, next) => {
  try {
    const pets = await petsService.getAll();
    res.send({ status: "success", payload: pets });
  } catch (error) {
    req.logger.error(`Error in getAllPets: ${error.message}`);
    return next(error);
  }
};

const createPet = async (req, res, next) => {
  try {
    const { name, specie, birthDate } = req.body;
    if (!name || !specie || !birthDate)
      return res
        .status(400)
        .send({ status: "error", error: "Incomplete values" });
    const pet = PetDTO.getPetInputFrom({ name, specie, birthDate });
    const result = await petsService.create(pet);
    res.send({ status: "success", payload: result });
  } catch (error) {
    req.logger.error(`Error in createPet: ${error.message}`);
    return next(error);
  }
};

const updatePet = async (req, res, next) => {
  try {
    const petUpdateBody = req.body;
    const petId = req.params.pid;
    const result = await petsService.update(petId, petUpdateBody);
    res.send({ status: "success", message: "pet updated" });
  } catch (error) {
    req.logger.error(`Error in updatePet: ${error.message}`);
    return next(error);
  }
};

const deletePet = async (req, res, next) => {
  try {
    const petId = req.params.pid;
    const result = await petsService.delete(petId);
    res.send({ status: "success", message: "pet deleted" });
  } catch (error) {
    req.logger.error(`Error in deletePet: ${error.message}`);
    return next(error);
  }
};

const createPetWithImage = async (req, res, next) => {
  try {
    const file = req.file;
    const { name, specie, birthDate } = req.body;
    if (!name || !specie || !birthDate)
      return res
        .status(400)
        .send({ status: "error", error: "Incomplete values" });
    const pet = PetDTO.getPetInputFrom({
      name,
      specie,
      birthDate,
      image: `${__dirname}/../public/img/pets/${file.filename}`,
    });
    console.log(pet);
    const result = await petsService.create(pet);
    res.send({ status: "success", payload: result });
  } catch (error) {
    req.logger.error(`Error in createPetWithImage: ${error.message}`);
    return next(error);
  }
};

export default {
  getAllPets,
  createPet,
  updatePet,
  deletePet,
  createPetWithImage,
};
