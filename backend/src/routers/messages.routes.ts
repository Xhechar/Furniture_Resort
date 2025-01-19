import { Router } from "express";
import { MessagesController } from "../controllers/messages.controller";
import { verifyAdmin, verifyToken, verifyUser } from "../middlewares/verification.tokens";

export const messageRouter = Router();

const messagesController = new MessagesController();

messageRouter.post('/send-message', verifyToken, verifyUser, messagesController.sendMessage);
messageRouter.put('/update-message/:MessagesId', verifyToken, verifyUser, messagesController.updateMessage);
messageRouter.delete('/delete-message/:MessagesId', verifyToken, verifyAdmin, messagesController.deleteMessage);
messageRouter.get('/get-messages', verifyToken, verifyUser, messagesController.getAllSendersMessages);
messageRouter.get('/get-message/:MessagesId', verifyToken, verifyUser, messagesController.getMessageByMessageId);