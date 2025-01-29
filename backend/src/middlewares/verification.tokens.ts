import { NextFunction, Request, Response } from "express";
import { TokenDetails } from "../interfaces/backend.interfaces";
import jwt from "jsonwebtoken";

export interface ExtendedRequest extends Request {
  info?: TokenDetails
}

export const verifyToken = async (req: ExtendedRequest, res: Response, next: NextFunction) => {
  
  try {
      
    let authToken: string = req.cookies.authToken as string;
    
    if (!authToken) {
      res.status(401).json({
        'error': 'Access denied.'
      });
    }

    let token = authToken;

    jwt.verify(token, process.env.SECRET_KEY as string, (error, data) => {
      if (error) {
        if (error.name === 'JsonWebTokenError') res.status(401).json({ 'error': 'Invalid authorisation.' });
          
        else if (error.name === 'TokenExpiredError') res.status(401).json({ 'error': 'Authorisation expired.' });
        
        else res.status(401).json({ 'error': 'You are not authorised.' })
        
      }

      req.info = data as TokenDetails;
      next();
    });
      
  } catch (error) {
    res.status(501).json({
      'error': error
    });
  }
}

export const getIdFromToken = (req: ExtendedRequest): string => {
  
  let details = req.info as TokenDetails;

  if (!details) return '';

  let UserId = details.UserId;

  if (UserId == '') return UserId
  
  return UserId;
}

export const verifyAdmin = (req: ExtendedRequest, res: Response, next: NextFunction) => {
  
  let details = req.info as TokenDetails;

  if (!details) res.status(401).json({'error': 'Admin access denied'});

  let Role = details.Role;

  if (Role == '') res.status(401).json({ 'error': 'Invalid admin identification.' });
  
  else if (Role == 'user') res.status(401).json({ 'error': 'User authorised. Admin access only.' });

  else if (Role === 'admin') next();

  else res.status(401).json({ 'error': 'Authority denied.' });
}

export const verifyUser = (req: ExtendedRequest, res: Response, next: NextFunction) => {
  
  let details = req.info as TokenDetails;

  if (!details) res.status(401).json({'error': 'User access denied'});

  let Role = details.Role;

  if (Role == '') res.status(401).json({ 'error': 'Invalid user identification.' })
  
  else if (Role == 'user') next();

  else if (Role === 'admin') next();

  else res.status(401).json({ 'error': 'Authority denied' });
}