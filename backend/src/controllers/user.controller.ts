import { Response } from "express";
import { ExtendedRequest, getIdFromToken } from "../middlewares/verification.tokens";
import { UserService } from "../services/user.service";

export const userService = new UserService();

export class UserController {
  async createUser(req: ExtendedRequest, res: Response) {
    try {

      let result = await userService.createUser(req.body);

      res.status(201).json(result);
      
    } catch (error) {
      res.status(501).json({
        error: error
      });
    }
  }
  async updateUser(req: ExtendedRequest, res: Response) {
    try {

      let result = await userService.updateUser(getIdFromToken(req), req.body);

      res.status(201).json(result);
      
    } catch (error) {
      res.status(501).json({
        error: error
      });
    }
  }
  async updateUserRole(req: ExtendedRequest, res: Response) {
    try {

      let result = await userService.updateUserRole(req.params.UserId);

      res.status(201).json(result);
      
    } catch (error) {
      res.status(501).json({
        error: error
      });
    }
  }
  async updateBackgroundPhoto(req: ExtendedRequest, res: Response) {
    try {

      let result = await userService.updateBackgroundPhoto(getIdFromToken(req), req.body.BackgroundUrl);

      res.status(201).json(result);
      
    } catch (error) {
      res.status(501).json({
        error: error
      });
    }
  }

  async updateProfileImage(req: ExtendedRequest, res: Response) {
    try {

      res.status(201).json(await userService.updateProfileImage(getIdFromToken(req), req.body.profilePhoto));
      
    } catch (error) {
      res.status(501).json({
        'error': error
      });
    }
  }

  async softDeleteSingleUser(req: ExtendedRequest, res: Response) {
    try {
      
      let result = await userService.softDeleteSingleUser(req.params.UserId);

      res.status(201).json(result);
      
    } catch (error) {
      res.status(501).json({
        error: error
      });
    }
  }
  async softDeleteMultipleUsers(req: ExtendedRequest, res: Response) {
    try {

      let result = await userService.softDeleteMultipleUsers(req.body.UserIds);

      res.status(201).json(result);
      
    } catch (error) {
      res.status(501).json({
        error: error
      });
    }
  }
  async deleteMultipleUsers(req: ExtendedRequest, res: Response) {
    try {

      let result = await userService.deleteMultipleUsers(req.body.UserIds);

      res.status(201).json(result);
      
    } catch (error) {
      res.status(501).json({
        error: error
      });
    }
  }
  async deleteSingleUser(req: ExtendedRequest, res: Response) {
    try {

      let result = await userService.deleteSingleUser(req.params.UserId);

      res.status(201).json(result);
      
    } catch (error) {
      res.status(501).json({
        error: error
      });
    }
  }
  async restoreSoftDeletedUser(req: ExtendedRequest, res: Response) {
    try {

      let result = await userService.restoreSoftDeletedUser(req.params.UserId);

      res.status(201).json(result);
      
    } catch (error) {
      res.status(501).json({
        error: error
      });
    }
  }
  async restoreMultipleSoftDeletedUser(req: ExtendedRequest, res: Response) {
    try {

      let result = await userService.restoreMultipleSoftDeletedUser(req.body.UserIds);

      res.status(201).json(result);
      
    } catch (error) {
      res.status(501).json({
        error: error
      });
    }
  }
  async getAllSoftDeletedUsers(req: ExtendedRequest, res: Response) {
    try {

      let result = await userService.getAllSoftDeletedUsers();

      res.status(201).json(result);
      
    } catch (error) {
      res.status(501).json({
        error: error
      });
    }
  }
  async getAllUsers(req: ExtendedRequest, res: Response) {
    try {

      let result = await userService.getAllUsers();

      res.status(201).json(result);
      
    } catch (error) {
      res.status(501).json({
        error: error
      });
    }
  }
  async getSingleUser(req: ExtendedRequest, res: Response) {
    try {

      let result = await userService.getSingleUser(getIdFromToken(req));

      res.status(201).json(result);
      
    } catch (error) {
      res.status(501).json({
        error: error
      });
    }
  }
  
}