import { Request, Response } from "express"
import { AuthService } from "../services/auth.service"
import { LoginDetailsSchema, RecoveryDetailsSchema } from "../validators/backend.input.validators";
import jwt from "jsonwebtoken";
import { User } from "@prisma/client";

let authService = new AuthService();

export class AuthController {
  async loginUser(req: Request, res: Response) {
    try {

      let { error } = LoginDetailsSchema.validate(req.body);

      if (error) {
        res.status(401).json({
          'error': error.message
        });
      }
     
      let result = await authService.loginUser(req.body);

      if (result.success) {

        let {
          IdentificationNumber,
          IsDeleted,
          Selected,
          Fullname,
          Email,
          Country,
          City,
          HasOrder,
          HasWishList,
          ProfileImage,
          BackgroundWallpaper,
          IsWelcomed,
          Password,
          DateCreated,
          Role,
          ...rest
        } = result.user as User;
    
        let token: string = jwt.sign(rest, process.env.SECRET_KEY as string, {
          expiresIn: '15m'
        });

        res.cookie("authToken", token, {
          httpOnly: true,
          secure: false,
          sameSite: "strict",
          maxAge: 15 * 60 * 1000
        });

        res.status(201).json({
          'success': result.success,
          'message': 'Welcome back. Login Successfull.',
          'Role': Role
        })
      }

      res.status(201).json(result);
    
    } catch (error) {
      res.status(501).json({
        'error': error
      });
   }
  }
  async changePassword(req: Request, res: Response) {
    try {
      
      let { error } = RecoveryDetailsSchema.validate(req.body);

      if (error) {
        res.status(401).json({
          error: error.message
        });
      }

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