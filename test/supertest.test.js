import { expect } from "chai";
import { describe, it } from "mocha";
import supertest from "supertest";
import logger from "../src/utils/loggers.js";
import config from "../src/config/config.js";
import mongoose from "mongoose";

const MONGO = config.db.url;
await mongoose.connect(MONGO);
const requester = supertest("http://localhost:8080");

describe("Supertest de mi proyecto Adoptme", function () {
  this.timeout(30000);

  describe("Testing de usuarios", () => {
    let testUserId;

    before(async () => {
      const newUser = {
        first_name: "Test",
        last_name: "User",
        email: "testuser@testing.com",
        password: "TestPassword123",
      };

      const response = await requester
        .post("/api/sessions/register")
        .send(newUser);

      testUserId = response?.body?.payload?._id || null;
      if (!testUserId) {
        throw new Error("Failed to retrieve testUserId from response");
      }
    });

    after(async function () {
      if (testUserId) {
        const response = await requester.delete(`/api/users/${testUserId}`);
        logger.info(`Se eliminó el usuario de pruebas`);
      }
    });

    describe("Metodo GET /api/users", () => {
      it("Devuelve una lista de usuarios de tipo array", async () => {
        const response = await requester.get("/api/users");

        expect(response.ok).to.be.equal(true);
        expect(response.status).to.equal(200);
        expect(response.body.payload).to.be.an("array");
      });

      it("Cada usuario tiene las propiedades esperadas", async () => {
        const { body } = await requester.get("/api/users");
        if (Array.isArray(body.payload)) {
          body.payload.forEach((usuario) => {
            expect(usuario).to.have.property("first_name");
            expect(usuario).to.have.property("last_name");
            expect(usuario).to.have.property("email");
            expect(usuario).to.have.property("password");
            expect(usuario).to.have.property("role");
            expect(usuario).to.have.property("_id");
          });
        }
      });
    });

    describe("Metodo GET /api/users/:uid", () => {
      it("Devuelve un usuario específico por ID", async () => {
        const response = await requester.get(`/api/users/${testUserId}`);

        expect(response.ok).to.be.equal(true);
        expect(response.status).to.equal(200);
        expect(response.body.payload).to.have.property("_id", testUserId);
      });

      it("Devuelve un error 404 si el usuario no existe", async () => {
        const invalidId = "6732345ea6173f81d3d81432";
        const response = await requester.get(`/api/users/${invalidId}`);

        expect(response.ok).to.be.equal(false);
        expect(response.status).to.equal(404);
        expect(response.body).to.have.property("error", "User not found");
      });
    });

    describe("Metodo POST /api/sessions/register", () => {
      it("Crea un usuario en la DB", async () => {
        const newUser = {
          first_name: "Test2",
          last_name: "User2",
          email: "testuser2@testing.com",
          password: "TestPassword123",
        };
        const response = await requester
          .post("/api/sessions/register")
          .send(newUser);

        expect(response.ok).to.be.equal(true);
        expect(response.status).to.equal(200);
        expect(response.body.payload).to.have.property("_id");

        const userId = response.body.payload._id;
        if (userId) {
          await requester.delete(`/api/users/${userId}`);
        }
      });

      it("Devuelve un error 400 si los campos están incompletos", async () => {
        const newUser = {
          first_name: "Test",
          last_name: "User",
          password: "TestPassword123",
        };
        const response = await requester
          .post("/api/sessions/register")
          .send(newUser);
        expect(response.ok).to.be.equal(false);
        expect(response.status).to.equal(400);
        expect(response.body).to.have.property("error", "Incomplete values");
      });
    });

    describe("Metodo PUT /api/users/:uid", () => {
      it("Actualiza datos de un usuario específico", async () => {
        const updatedData = {
          first_name: "Alejandro",
          last_name: "Alejandría",
          email: "alejandroaleja@unmail.com",
          password: "UpdatedPassword123",
        };
        const response = await requester
          .put(`/api/users/${testUserId}`)
          .send(updatedData);

        expect(response.ok).to.be.equal(true);
        expect(response.status).to.equal(200);
        expect(response.body).to.have.property("message", "User updated");
      });

      it("Devuelve un error 404 si el usuario no existe", async () => {
        const invalidId = "6732345ea6173f81d3d81432";
        const updatedData = {
          first_name: "Alejandro",
          last_name: "Alejandría",
          email: "alejandroaleja@unmail.com",
          password: "UpdatedPassword123",
        };
        const response = await requester
          .put(`/api/users/${invalidId}`)
          .send(updatedData);

        expect(response.ok).to.be.equal(false);
        expect(response.status).to.equal(404);
        expect(response.body).to.have.property("error", "User not found");
      });
    });

    describe("Metodo DELETE /api/users/:uid", () => {
      it("Elimina un usuario por ID", async () => {
        const newUser = {
          first_name: "Test",
          last_name: "Usereliminated",
          email: "testuser_eliminado@example.com",
          password: "TestPassword123",
        };
        const user = await requester
          .post("/api/sessions/register")
          .send(newUser);
        const uid = user?.body?.payload?._id || null;
        if (!testUserId) {
          throw new Error("Failed to retrieve UID from user");
        }

        const response = await requester.delete(`/api/users/${uid}`);

        expect(response.ok).to.be.equal(true);
        expect(response.status).to.equal(200);
        expect(response.body).to.have.property("message", "User deleted");
      });
    });
  });

  describe("Testing de mascotas", () => {
    let testPetId;

    before(async () => {
      const newPet = {
        name: "Moro",
        specie: "Perro",
        birthDate: "2023-01-01",
      };

      const response = await requester.post("/api/pets").send(newPet);
      testPetId = response.body.payload._id;
    });

    after(async function () {
      if (testPetId) {
        const response = await requester.delete(`/api/pets/${testPetId}`);
        logger.info(`Se eliminó la mascota de prueba`);
      }
    });

    describe("Metodo GET /api/pets", () => {
      it("Devuelve todas las mascotas", async () => {
        const response = await requester.get("/api/pets");
        expect(response.ok).to.be.equal(true);
        expect(response.status).to.equal(200);
        expect(response.body.payload).to.be.an("array");
      });

      it("Cada mascota tiene las propiedades esperadas", async () => {
        const { body } = await requester.get("/api/pets");
        if (Array.isArray(body.payload)) {
          body.payload.forEach((mascota) => {
            expect(mascota).to.have.property("name");
            expect(mascota).to.have.property("specie");
            expect(mascota).to.have.property("_id");
          });
        }
      });
    });

    describe("Metodo POST /api/pets", () => {
      it("Crea una mascota en la DB", async () => {
        const newPet = {
          name: "Moro",
          specie: "Perro",
          birthDate: "2023-01-01",
        };
        const response = await requester.post("/api/pets").send(newPet);
        expect(response.ok).to.be.equal(true);
        expect(response.status).to.equal(200);
        expect(response.body.payload).to.have.property("_id");

        const petId = response.body.payload._id;
        if (petId) {
          await requester.delete(`/api/pets/${petId}`);
        }
      });

      it("Devuelve un error 400 si faltan datos", async () => {
        const newPet = {
          name: "Moro",
        };
        const response = await requester.post("/api/pets").send(newPet);
        expect(response.ok).to.be.equal(false);
        expect(response.status).to.equal(400);
        expect(response.body).to.have.property("error", "Incomplete values");
      });
    });

    describe("Metodo PUT /api/pets/:pid", () => {
      it("Actualiza una mascota por ID", async () => {
        const updateData = {
          name: "Moro Updated",
          specie: "cat",
        };
        const response = await requester
          .put(`/api/pets/${testPetId}`)
          .send(updateData);
        expect(response.ok).to.be.equal(true);
        expect(response.status).to.equal(200);
        expect(response.body).to.have.property("message", "pet updated");
      });
    });

    describe("Metodo DELETE /api/pets/:pid", () => {
      it("Elimina una mascota por ID", async () => {
        const response = await requester.delete(`/api/pets/${testPetId}`);
        expect(response.ok).to.be.equal(true);
        expect(response.status).to.equal(200);
        expect(response.body).to.have.property("message", "pet deleted");
      });
    });
  });

  describe("Testing de sesiones", () => {
    describe("Metodo POST /api/sessions/login", () => {
      it("Inicia sesión correctamente", async () => {
        const newUser = {
          first_name: "Test",
          last_name: "UserLogin",
          email: "testuser_login@testing.com",
          password: "TestPassword123",
        };

        const responseCreate = await requester
          .post("/api/sessions/register")
          .send(newUser);

        const loginUser = {
          email: "testuser_login@testing.com",
          password: "TestPassword123",
        };
        const response = await requester
          .post("/api/sessions/login")
          .send(loginUser);
        expect(response.ok).to.be.equal(true);
        expect(response.status).to.equal(200);
        expect(response.body).to.have.property("message", "Logged in");

        const userId = responseCreate.body.payload._id;
        if (userId) {
          await requester.delete(`/api/users/${userId}`);
        }
      });

      it("Devuelve un error 400 si falta alguna credenciales", async () => {
        const loginUser = {
          email: "testuser@testing.com",
        };
        const response = await requester
          .post("/api/sessions/login")
          .send(loginUser);
        expect(response.ok).to.be.equal(false);
        expect(response.status).to.equal(400);
        expect(response.body).to.have.property("error", "Incomplete values");
      });

      it("Devuelve un error 404 si el usuario no existe", async () => {
        const loginUser = {
          email: "testuser@testing.com",
          password: "TestPassword123",
        };
        const response = await requester
          .post("/api/sessions/login")
          .send(loginUser);

        expect(response.ok).to.be.equal(false);
        expect(response.status).to.equal(404);
        expect(response.body).to.have.property("error", "User doesn't exist");
      });
    });
  });

  describe("Testing de adopciones", () => {
    let testUserId;
    let testPetId;
    let testAdoptionId;

    before(async () => {
      const newUser = {
        first_name: "Test",
        last_name: "User",
        email: "testuser@testing.com",
        password: "TestPassword123",
      };

      const newPet = {
        name: "Moro",
        specie: "Perro",
        birthDate: "2023-01-01",
      };

      const response1 = await requester.post("/api/pets").send(newPet);
      testPetId = response1.body.payload._id;

      const response2 = await requester
        .post("/api/sessions/register")
        .send(newUser);
      testUserId = response2.body.payload._id;
    });

    after(async function () {
      if (testUserId) {
        await requester.delete(`/api/users/${testUserId}`);
        logger.info(`Se eliminó el usuario de prueba de Adopciones`);
      }
      if (testPetId) {
        await requester.delete(`/api/pets/${testPetId}`);
        logger.info(`Se eliminó la mascota de prueba de Adopciones`);
      }
    });

    describe("Metodo POST /api/adoptions/:uid/:pid", () => {
      it("Crea una nueva adoptción en la DB", async () => {
        const response = await requester.post(
          `/api/adoptions/${testUserId}/${testPetId}`
        );
        testAdoptionId = await response.body.payload._id;
      });

      it("Devuelve un error 404 si el usuario no existe", async () => {
        const invalidId = "6732345ea6173f81d3d81432";
        const response = await requester.post(
          `/api/adoptions/${invalidId}/${testPetId}`
        );
        expect(response.ok).to.be.equal(false);
        expect(response.status).to.equal(404);
        expect(response.body).to.have.property("error", "user Not found");
      });

      it("Devuelve un error 404 si la mascota no existe", async () => {
        const invalidId = "6732345ea6173f81d3d81432";
        const response = await requester.post(
          `/api/adoptions/${testUserId}/${invalidId}`
        );
        expect(response.ok).to.be.equal(false);
        expect(response.status).to.equal(404);
        expect(response.body).to.have.property("error", "Pet not found");
      });

      it("Devuelve un error 400 si la mascota ya fue adoptada", async () => {
        const response = await requester.post(
          `/api/adoptions/${testUserId}/${testPetId}`
        );
        expect(response.ok).to.be.equal(false);
        expect(response.status).to.equal(400);
        expect(response.body).to.have.property(
          "error",
          "Pet is already adopted"
        );
      });
    });

    describe("Metodo GET /api/adoptions", () => {
      it("Devuelve una lista de adopciones", async () => {
        const response = await requester.get("/api/adoptions");
        expect(response.ok).to.be.equal(true);
        expect(response.status).to.equal(200);
        expect(response.body.payload).to.be.an("array");
      });
    });

    describe("Metodo GET /api/adoptions/:aid", () => {
      it("Devuelve una adopción específica por ID", async () => {
        const response = await requester.get(
          `/api/adoptions/${testAdoptionId}`
        );
        expect(response.ok).to.be.equal(true);
        expect(response.status).to.equal(200);
        expect(response.body.payload).to.have.property("_id", testAdoptionId);
      });

      it("Devuelve un error 404 si la adopción no existe", async () => {
        const invalidId = "6732345ea6173f81d3d81432";
        const response = await requester.get(`/api/adoptions/${invalidId}`);
        expect(response.ok).to.be.equal(false);
        expect(response.status).to.equal(404);
        expect(response.body).to.have.property("error", "Adoption not found");
      });
    });
  });
});
