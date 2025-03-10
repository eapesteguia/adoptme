import { generatePet } from "../mocks/mockingPets.js";
import { generateUser } from "../mocks/mockingUsers.js";
import { petsService, usersService } from "../services/index.js";

const generatePets = (req, res, next) => {
  try {
    const npets = req.query.num || 100;

    if (isNaN(npets) || npets < 1) {
      req.logger.error("Number of pets is not valid");
      return res.status(400).json({ error: "Invalid value" });
    }

    const pets = generatePet(npets);
    res.status(200).json(pets);
    req.logger.debug(`${npets} new pets were correctly generated using Faker`);
  } catch (error) {
    req.logger.error("Error generating pets");
    return next(error);
  }
};

const generateUsers = async (req, res, next) => {
  try {
    const nusers = req.query.num || 50;

    if (isNaN(nusers) || nusers < 1) {
      req.logger.error("Number of users is not valid");
      return res.status(400).json({ error: "Invalid value" });
    }

    const users = await generateUser(nusers);
    res.status(200).json(users);
    req.logger.debug(
      `${nusers} new users were correctly generated using Faker`
    );
  } catch (error) {
    req.logger.error("Error generating users");
    return next(error);
  }
};

const generateData = async (req, res, next) => {
  const nusers = req.params.users;
  const nupets = req.params.pets;

  try {
    if (isNaN(nusers) || (nusers < 1 && isNaN(nupets)) || nupets < 1) {
      req.logger.error("Number of users or pets is not valid");
      return res.status(400).json({ error: "Invalid value" });
    }

    const users = await generateUser(nusers);
    const pets = await generatePet(nupets);

    const responseUsers = await usersService.create(users);
    const responsepets = await petsService.create(pets);

    res.status(200).send({ status: "success", payload: { users, pets } });
    req.logger.debug(
      `${nusers} new users and ${nupets} new pets were correctly generated using Faker and saved in MongoDB`
    );
  } catch (error) {
    req.logger.error("Error generating users and pets");
    return next(error);
  }
};

export default { generatePets, generateUsers, generateData };
