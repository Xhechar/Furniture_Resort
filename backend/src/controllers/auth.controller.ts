import { Request, Response } from "express";
import { AuthService } from "../services/auth.service";

let authService = new AuthService();

export class AuthController {
  async loginUser(req: Request, res: Response) {
    try {

      let result = await authService.loginUser(req.body);

      res.status(201).json(result);
      
    } catch (error) {
      res.status(501).json({
        error: error
      });
    }
  }
  async changePassword(req: Request, res: Response) {
    try {

     let result = await authService.changePassword(req.body);
     
     res.status(201).json(result);

    } catch (error) {
      res.status(501).json({
        error: error
      })
    }
  }
  async getAllRecoveries(res: Response) {
    try {
      
      let result = await authService.getAllRecoveries();
      
      res.status(201).json(result);

    } catch (error) {
      res.status(501).json({
        error: error
      })
    }
  }
  async verifyMail(req: Request, res: Response) {
    try {
      
      let result = await authService.verifyMail(req.body.Email);
      
      res.status(201).json(result);
      
    } catch (error) {
      res.status(501).json({
        error: error
      })
    }
  }
  
}