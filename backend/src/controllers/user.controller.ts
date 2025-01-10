import { Response } from "express";
import { ExtendedRequest, getIdFromToken } from "../middlewares/verification.tokens";
import { UserService } from "../services/user.service";
import { RegistrationSchema } from "../validators/backend.input.validators";

const userService = new UserService();

export class UserController {
  async createUser(req: ExtendedRequest, res: Response) {
    try {

      let { error } = RegistrationSchema.validate(req.body);

      if (error) return res.status(401).json({ error: error.message });

      let result = await userService.createUser(req.body);

      return res.status(201).json(result);
      
    } catch (error) {
      return res.status(501).json({
        error: error
      });
    }
  }
  async updateUser(req: ExtendedRequest, res: Response) {
    try {

      let { error } = RegistrationSchema.validate(req.body);

      if (error) return res.status(401).json({ error: error.message });

      let result = await userService.updateUser(getIdFromToken(req), req.body);

      return res.status(201).json(result);
      
    } catch (error) {
      return res.status(501).json({
        error: error
      });
    }
  }
  async updateUserRole(req: ExtendedRequest, res: Response) {
    try {

      let result = await userService.updateUserRole(req.params.UserId);

      return res.status(201).json(result);
      
    } catch (error) {
      return res.status(501).json({
        error: error
      });
    }
  }
  async updateBackgroundPhoto(req: ExtendedRequest, res: Response) {
    try {

      let result = await userService.updateBackgroundPhoto(getIdFromToken(req), req.body.BackgroundUrl);

      return res.status(201).json(result);
      
    } catch (error) {
      return res.status(501).json({
        error: error
      });
    }
  }
  async softDeleteSingleUser(req: ExtendedRequest, res: Response) {
    try {
      
      let result = await userService.softDeleteSingleUser(req.params.UserId);

      return res.status(201).json(result);
      
    } catch (error) {
      return res.status(501).json({
        error: error
      });
    }
  }
  async softDeleteMultipleUsers(req: ExtendedRequest, res: Response) {
    try {

      let result = await userService.softDeleteMultipleUsers(req.body.UserIds);

      return res.status(201).json(result);
      
    } catch (error) {
      return res.status(501).json({
        error: error
      });
    }
  }
  async deleteMultipleUsers(req: ExtendedRequest, res: Response) {
    try {

      let result = await userService.deleteMultipleUsers(req.body.UserIds);

      return res.status(201).json(result);
      
    } catch (error) {
      return res.status(501).json({
        error: error
      });
    }
  }
  async deleteSingleUser(req: ExtendedRequest, res: Response) {
    try {

      let result = await userService.deleteSingleUser(req.params.UserId);

      return res.status(201).json(result);
      
    } catch (error) {
      return res.status(501).json({
        error: error
      });
    }
  }
  async restoreSoftDeletedUser(req: ExtendedRequest, res: Response) {
    try {

      let result = await userService.restoreSoftDeletedUser(req.params.UserId);

      return res.status(201).json(result);
      
    } catch (error) {
      return res.status(501).json({
        error: error
      });
    }
  }
  async restoreMultipleSoftDeletedUser(req: ExtendedRequest, res: Response) {
    try {

      let result = await userService.restoreMultipleSoftDeletedUser(req.body.UserIds);

      return res.status(201).json(result);
      
    } catch (error) {
      return res.status(501).json({
        error: error
      });
    }
  }
  async getAllSoftDeletedUsers(req: ExtendedRequest, res: Response) {
    try {

      let result = await userService.getAllSoftDeletedUsers();

      return res.status(201).json(result);
      
    } catch (error) {
      return res.status(501).json({
        error: error
      });
    }
  }
  async getAllUsers(req: ExtendedRequest, res: Response) {
    try {

      let result = await userService.getAllUsers();

      return res.status(201).json(result);
      
    } catch (error) {
      return res.status(501).json({
        error: error
      });
    }
  }
  async getSingleUser(req: ExtendedRequest, res: Response) {
    try {

      let result = await userService.getSingleUser(getIdFromToken(req));

      return res.status(201).json(result);
      
    } catch (error) {
      return res.status(501).json({
        error: error
      });
    }
  }
  
}