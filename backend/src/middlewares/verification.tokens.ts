import { NextFunction, Request, Response } from "express";
import { TokenDetails } from "../interfaces/backend.interfaces";
import jwt from "jsonwebtoken";

export interface ExtendedRequest extends Request {
  info: TokenDetails
}

export const verifyToken = async (req: ExtendedRequest, res: Response, next: NextFunction) => {
  
  try {
      
    let authToken: string = req.headers['authorization'] as string;
    
    if (!authToken) {
      return res.status(401).json({
        'error': 'Access denied.'
      });
    }

    let token = authToken.split(' ')[1];

    jwt.verify(token, process.env.SECRET_KEY as string, (error, data) => {
      if (error) {
        if (error.name === 'JsonWebTokenError') return res.status(401).json({ 'error': 'Invalid authorisation.' });
          
        else if (error.name === 'TokenExpiredError') return res.status(401).json({ 'error': 'Authorisation expired.' });
        
        else return res.status(401).json({ 'error': 'You are not authorised.' })
        
      }

      req.info = data as TokenDetails;
      next();
    });
      
  } catch (error) {
    return res.status(501).json({
      'error': error
    });
  }
}

export const getIdFromToken = (req: ExtendedRequest): string => {
  
  let details: TokenDetails = req.info;

  if (!details) return '';

  let UserId = details.UserId;

  if (UserId == '') return UserId
  
  return UserId;
}

export const verifyAdmin = (req: ExtendedRequest, res: Response, next: NextFunction) => {
  
  let details: TokenDetails = req.info;

  if (!details) return res.status(401).json({'error': 'Admin access denied'});

  let Role = details.Role;

  if (Role == '') return res.status(401).json({ 'error': 'Invalid admin identification.' });
  
  else if (Role == 'user') return res.status(401).json({ 'error': 'User authorised. Admin access only.' });

  else if (Role === 'admin') next();

  else return res.status(401).json({ 'error': 'Authority denied.' });
}

export const verifyUser = (req: ExtendedRequest, res: Response, next: NextFunction) => {
  
  let details: TokenDetails = req.info;

  if (!details) return res.status(401).json({'error': 'User access denied'});

  let Role = details.Role;

  if (Role == '') return res.status(401).json({ 'error': 'Invalid user identification.' })
  
  else if (Role == 'user') next();

  else if (Role === 'admin') next();

  else return res.status(401).json({ 'error': 'Authority denied' });
}