import { faker } from "@faker-js/faker";
import { createHash, passwordValidation } from "../utils/index.js";

export const generateUser = async (numUsers) => {
  let users = [];

  for (let i = 0; i < numUsers; i++) {
    const first_name = faker.person.firstName();
    const last_name = faker.person.lastName();

    const user = {
      first_name: first_name,
      last_name: last_name,
      email: faker.internet.email({
        firstName: first_name,
        lastName: last_name,
      }),
      password: await createHash("coder123"),
      role: faker.helpers.arrayElement(["user", "admin"]),
      pets: [],
    };

    users.push(user);
  }
  return users;
};
