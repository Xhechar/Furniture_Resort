import { PrismaClient } from "@prisma/client";
import { Messages } from "../interfaces/backend.interfaces";
import { MessagesInterface } from "../interfaces/services.coupling.interfaces";
import { v4 } from "uuid";

export class MessagesService implements MessagesInterface {
  prisma = new PrismaClient({
    log: ["error"]
  });
  
  public async sendMessage(SenderId: string, message: Messages): Promise<{ success: boolean; error?: string; message?: string; }> {
    let userExists = await this.prisma.user.findUnique({
      where: {
        UserId: SenderId
      }
    });

    if (userExists == null) {
      return {
        'success': false,
        'error': 'Login inorder to be able to send messages.'
      }
    }

    if (userExists.IsDeleted) {
      return {
        'success': false,
        'error': `${userExists.Fullname}, your account is inactive.`
      }
    }

    if (userExists.Role == 'user') {
      let customOrderExists = await this.prisma.customOrder.findMany({
        where: {
          UserId: userExists.UserId
        }
      });
  
      if (customOrderExists.length == 0) {
        return {
          'success': false,
          'error': 'You have no custom order at the moment.'
        }
      }
  
      let recieverExists = await this.prisma.user.findFirst({
        where: {
          Role: 'admin',
          Selected: true
        }
      });
  
      if (recieverExists == null) {
        return {
          'success': false,
          'error': 'Reciever is not available.'
        }
      }
  
      if (recieverExists.IsDeleted) {
        return {
          'success': false,
          'error': `Reciever is not available.`
        }
      }
  
  
      let sendMessage = await this.prisma.messages.create({
        data: {
          MessagesId: v4(),
          SenderId,
          ReceiverId: recieverExists.UserId,
          Message: message.Message
        }
      });
  
      if (sendMessage == null) {
        return {
          'success': false,
          'error': 'Unable to send message.'
        }
      } else {
        return {
          'success': true,
          'message': 'Message sent successfully.'
        }
      }
    } else {
      let recieverExists = await this.prisma.user.findUnique({
        where: {
          UserId: message.ReceiverId
        }
      });
  
      if (recieverExists == null) {
        return {
          'success': false,
          'error': 'Reciever is not available.'
        }
      }
  
      if (recieverExists.IsDeleted) {
        return {
          'success': false,
          'error': `Reciever is not available.`
        }
      }
  
  
      let sendMessage = await this.prisma.messages.create({
        data: {
          MessagesId: v4(),
          SenderId,
          ReceiverId: recieverExists.UserId,
          Message: message.Message
        }
      });
  
      if (sendMessage == null) {
        return {
          'success': false,
          'error': 'Unable to send message.'
        }
      } else {
        return {
          'success': true,
          'message': 'Message sent successfully.'
        }
      }
    }

  }
  public async updateMessage(SenderId: string, MessagesId: string, message: Messages): Promise<{ success: boolean; error?: string; message?: string; }> {
    let userExists = await this.prisma.user.findUnique({
      where: {
        UserId: SenderId
      }
    });

    if (userExists == null) {
      return {
        'success': false,
        'error': 'Login inorder to be able to update messages.'
      }
    }

    if (userExists.IsDeleted) {
      return {
        'success': false,
        'error': `${userExists.Fullname}, your account is inactive.`
      }
    }

    let customOrderExists = await this.prisma.customOrder.findMany({
      where: {
        UserId: SenderId
      }
    });

    if (customOrderExists.length == 0) {
      return {
        'success': false,
        'error': 'You have no custom order at the moment.'
      }
    }

    let messageExists = await this.prisma.messages.findUnique({
      where: {
        MessagesId,
        SenderId
      }
    });

    if (messageExists == null) {
      return {
        'success': false,
        'error': 'Message specified does not exist.'
      }
    }

    let updateMessage = await this.prisma.messages.update({
      data: {
        Message: message.Message
      },
      where: {
        SenderId: messageExists.SenderId,
        MessagesId
      }
    });

    if (updateMessage == null) {
      return {
        'success': false,
        'error': 'Unable to update message.'
      }
    } else {
      return {
        'success': true,
        'message': 'Message updated successfully.'
      }
    }
  }
  public async deleteMessage(UserId: string, MessagesId: string): Promise<{ success: boolean; error?: string; message?: string; }> {
    let userExists = await this.prisma.user.findUnique({
      where: {
        UserId,
        Role: 'admin',
        Selected: true
      }
    });

    if (userExists == null) {
      return {
        'success': false,
        'error': 'Admin access only, login to delete messages or contact Super admin.'
      }
    }

    if (userExists.IsDeleted) {
      return {
        'success': false,
        'error': `${userExists.Fullname}, your account is inactive.`
      }
    }

    let messageExists = await this.prisma.messages.findUnique({
      where: {
        MessagesId
      }
    });

    if (messageExists == null) {
      return {
        'success': false,
        'error': 'Message specified does not exist.'
      }
    }

    let deleteMessage = await this.prisma.messages.delete({
      where: {
        MessagesId
      }
    });

    if (deleteMessage == null) {
      return {
        'success': false,
        'error': 'Unable to delete message.'
      }
    } else {
      return {
        'success': true,
        'message': 'Message deleted successfully.'
      }
    }
  }
  public async getAllSendersMessages(SenderId: string, ReceiverId: string): Promise<{ success: boolean; error?: string; message?: string; messages?: Messages[] | unknown[]}> {
    let userExists = await this.prisma.user.findUnique({
      where: {
        UserId: SenderId
      }
    });

    if (userExists == null) {
      return {
        'success': false,
        'error': 'Login inorder to get messages.'
      }
    }

    if (userExists.IsDeleted) {
      return {
        'success': false,
        'error': `${userExists.Fullname}, your account is inactive.`
      }
    }
    
    let myMessages = await this.prisma.messages.findMany({
      where: {
        OR: [
          {
            SenderId,
            ReceiverId
          },
          {
            SenderId: ReceiverId,
            ReceiverId: SenderId
          }
        ]
      },
      include: {
        Sender: true,
        Receiver: true
      },
      orderBy: {
        DateCreated: 'asc'
      }
    });

    if (myMessages.length == 0) {
      return {
        'success': false,
        'error': 'Unable to get messages.'
      }
    } else {
      return {
        'success': true,
        'message': 'Messages retrieved successfully.',
        'messages': myMessages
      }
    }
  }
  
  public async getMessageByMessageId(MessagesId: string): Promise<{ success: boolean, error?: string, message?: string, messages?: Messages | unknown }>{
    let messageExists = this.prisma.messages.findUnique({
      where: {
        MessagesId
      }
    });

    if (messageExists == null) {
      return {
        'success': false,
        'error': 'Message does not exist.'
      }
    } else {
      return {
        'success': true,
        'message': 'Message successfully retrieved.',
        'messages': messageExists
      }
    }
  }
}