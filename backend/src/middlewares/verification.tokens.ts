import { NextFunction, Request, Response } from "express";
import { TokenDetails } from "../interfaces/backend.interfaces";
import jwt from "jsonwebtoken";

export interface ExtendedRequest extends Request {
  info?: TokenDetails
}

export const verifyToken = async (req: ExtendedRequest, res: Response, next: NextFunction) => {

  try {  
    const authHeader = req.headers['authorization'] as string;
    
  
    if (!authHeader) {
      res.status(401).json({
        'success': false,
        'error': 'You are not allowed to access this service. Login.'
      });
    }
  
    let token = authHeader.split(" ")[1];
  

    jwt.verify(token, process.env.SECRET_KEY as string, (err, data) => {
      if (err) {
        if (err.name === "TokenExpiredError") {
          res.status(401).json({
            error: "Your session has expired, please log in again"
          });
        } else if (err.name === "JsonWebTokenError") {
          res.status(401).json({
            error: "Invalid token, please log in again"
          });
        } else {
          res.status(501).json({
            error: "An error occurred while verifying the token"
          });
        }
      }
      req.info = data as TokenDetails;
      next();
    });    
  } catch (error) {
    res.status(501).json({
      'success': false,
      'error': 'Invalid token provided.'
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

  console.log(details);
  

  if (Role == '') {
    res.status(401).json({ 'error': 'Invalid user identification.' });
  } else if (Role == 'user') {
    next();
  } else if (Role == 'admin') {
    next();
  } else res.status(401).json({ 'error': 'Authority denied' });
}