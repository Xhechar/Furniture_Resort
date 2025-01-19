import { Response } from "express";
import { ExtendedRequest, getIdFromToken } from "../middlewares/verification.tokens";
import { MessagesService } from "../services/messages.service";

const messageService = new MessagesService();

export class MessagesController {
  async sendMessage(req: ExtendedRequest, res: Response) {
    try {

      let result = await messageService.sendMessage(getIdFromToken(req), req.body);

      res.status(201).json(result);
      
    } catch (error) {
      res.status(501).json({
        error: error
      });
    }
  }
  async updateMessage(req: ExtendedRequest, res: Response) {
    try {

      let result = await messageService.updateMessage(getIdFromToken(req), req.params.MessagesId, req.body);

      res.status(201).json(result);
      
    } catch (error) {
      res.status(501).json({
        error: error
      });
    }
  }
  async deleteMessage(req: ExtendedRequest, res: Response) {
    try {

      let result = await messageService.deleteMessage(getIdFromToken(req), req.params.MessagesId);

      res.status(201).json(result);
      
    } catch (error) {
      res.status(501).json({
        error: error
      });
    }
  }
  async getAllSendersMessages(req: ExtendedRequest, res: Response) {
    try {

      let result = await messageService.getAllSendersMessages(getIdFromToken(req));

      res.status(201).json(result);
      
    } catch (error) {
      res.status(501).json({
        error: error
      });
    }
  }
  async getMessageByMessageId(req: ExtendedRequest, res: Response) {
    try {

      let result = await messageService.getMessageByMessageId(req.params.MessagesId);

      res.status(201).json(result);
      
    } catch (error) {
      res.status(501).json({
        error: error
      });
    }
  }
  
}