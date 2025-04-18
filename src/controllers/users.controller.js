import UserDTO from "../dto/User.dto.js";
import { usersService } from "../services/index.js";
import __dirname from "../utils/index.js";

const getAllUsers = async (req, res, next) => {
  try {
    const users = await usersService.getAll();
    res.send({ status: "success", payload: users });
  } catch (error) {
    req.logger.error(`Error in getAllUsers: ${error.message}`);
    return next(error);
  }
};

const getUser = async (req, res, next) => {
  try {
    const userId = req.params.uid;
    const user = await usersService.getUserById(userId);
    if (!user)
      return res.status(404).send({ status: "error", error: "User not found" });
    res.send({ status: "success", payload: user });
  } catch (error) {
    req.logger.error(`Error in getUser: ${error.message}`);
    return next(error);
  }
};

const updateUser = async (req, res, next) => {
  try {
    const updateBody = req.body;
    const userId = req.params.uid;
    const user = await usersService.getUserById(userId);
    if (!user)
      return res.status(404).send({ status: "error", error: "User not found" });
    const result = await usersService.update(userId, updateBody);
    res.send({ status: "success", message: "User updated" });
  } catch (error) {
    req.logger.error(`Error in updateUser: ${error.message}`);
    return next(error);
  }
};

const uploadDocument = async (req, res, next) => {
  try {
    const userId = req.params.uid;
    const user = await usersService.getUserById(userId);
    if (!user)
      return res.status(404).send({ status: "error", error: "User not found" });

    const files = req.files;
    console.log(userId);
    console.log(files);
    if (!files)
      return res
        .status(400)
        .send({ status: "error", error: "No files uploaded" });

    const uploadedDocuments = files.map((file) => ({
      name: file.originalname,
      reference: `${__dirname}/../public/img/documents/${file.filename}`,
    }));

    user.documents = [...(user.documents || []), ...uploadedDocuments];
    const result = await usersService.update(userId, {
      documents: user.documents,
    });

    res.send({
      status: "success",
      message: "Documents uploaded successfully",
      payload: result,
    });
  } catch (error) {
    req.logger.error(`Error in uploadDocument: ${error.message}`);
    return next(error);
  }
};

const deleteUser = async (req, res, next) => {
  try {
    const userId = req.params.uid;
    const user = await usersService.getUserById(userId);
    if (!user)
      return res.status(404).send({ status: "error", error: "User not found" });
    await usersService.delete(userId);
    res.send({ status: "success", message: "User deleted" });
  } catch (error) {
    req.logger.error(`Error in deleteUser: ${error.message}`);
    return next(error);
  }
};

export default {
  deleteUser,
  getAllUsers,
  getUser,
  updateUser,
  uploadDocument,
};
