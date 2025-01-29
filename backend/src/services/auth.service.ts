import { PrismaClient } from "@prisma/client";
import { LoginDetails, TokenDetails, RecoveryDetails, Recovery, MessageOptions, User } from "../interfaces/backend.interfaces";
import { AuthInterface } from "../interfaces/services.coupling.interfaces";
import bcryptjs from 'bcryptjs';
import jwt  from "jsonwebtoken";
import { v4 } from "uuid";
import dotenv from 'dotenv';
import { sendMail } from "../emails/email_config/email.config";
import ejs from "ejs";

dotenv.config();

export class AuthService implements AuthInterface{
  prisma = new PrismaClient({
    log: ["error"]
  });
  public async loginUser(Logins: LoginDetails): Promise<{ success: boolean; error?: string; user?: User }> {

    let userExists = await this.prisma.user.findUnique({
      where: {
        Email: Logins.Email
      }
    });

    if (userExists == null) {
      return {
        'success': false,
        'error': 'Email not found. Sign Up instead.'
      }
    }

    if (userExists.IsDeleted) {
      return {
        'success': false,
        'error': `${userExists.Fullname}, your account is inactive. Contact Us.`
      }
    }

    let passwordCorrect: boolean = bcryptjs.compareSync(Logins.Password, userExists.Password);

    if (!passwordCorrect) {
      return {
        'success': false,
        'error': 'Incorrect Password.'
      }
    }

    return {
      'success': true,
      'user': userExists
    }

  }
  public async changePassword(Details: RecoveryDetails): Promise<{ success: boolean; error?: string; message?: string; }> {
    
    let emailExists = await this.prisma.recovery.findFirst({
      where: {
        Email: Details.Email,
        RecoveryCode: Details.RecoveryCode
      }
    });

    if (emailExists == null) {
      return {
        'success': false,
        'error': 'Email not found. Try again later.'
      }
    }

    let userExists = await this.prisma.user.findUnique({
      where: {
        Email: emailExists.Email
      }
    });

    if (userExists == null) {
      return {
        'success': false,
        'error': 'Email not found. Sign Up instead.'
      }
    }

    if (userExists.IsDeleted) {
      return {
        'success': false,
        'error': `${userExists.Fullname}, your account is inactive. Contact Us.`
      }
    }

    let updatePassword = await this.prisma.user.update({
      data: {
        Password: bcryptjs.hashSync(Details.Password, 10)
      },
      where: {
        UserId: userExists.UserId
      }
    });

    if (updatePassword == null) {
      return {
        'success': false,
        'error': 'Unable to update password at the moment.'
      }
    } else {
      return {
        'success': true,
        'message': 'Great. Password successfully updated.'
      }
    }
  }
  public async getAllRecoveries(): Promise<{ success: boolean; error?: string; message?: string; recoveries?: Recovery[] | unknown[]; }> {
    let recoveries = await this.prisma.recovery.findMany({
      orderBy: {
        DateCreated: 'desc'
      }
    });

    if (recoveries == null || recoveries.length == 0) {
      return {
        'success': false,
        'error': 'No recoveries found at the moment.'
      }
    } else {
      return {
        'success': true,
        'message': 'Recoveries successfully retrieved.',
        'recoveries': recoveries
      }
    }
  }
  public async verifyMail(Email: string): Promise<{ success: boolean; error?: string; message?: string; }> {
    let userExists = await this.prisma.user.findUnique({
      where: {
        Email
      }
    });

    if (userExists == null) {
      return {
        'success': false,
        'error': 'Email not found. Sign Up instead.'
      }
    }

    if (userExists.IsDeleted) {
      return {
        'success': false,
        'error': `${userExists.Fullname}, your account is inactive. Contact Us.`
      }
    }

    let createRecovery = await this.prisma.recovery.create({
      data: {
        RecoveryId: v4(),
        Email: userExists.Email,
        RecoveryCode: (Math.random() * 10000000 + (Math.random() * 2125))
      }
    });

    if (createRecovery == null) {
      return {
        'success': false,
        'error': 'Unable to continue recovery.'
      }
    } else {

      ejs.renderFile('../../email_templates/recovery.email.ejs', { user_name: userExists.Fullname, verification_code: createRecovery.RecoveryCode }, async (error, data) => {
        if (error) {
          console.log(error);
        } else {
          let messageOptions: MessageOptions = ({
            from: process.env.EMAIL as string,
            to: userExists.Email,
            subject: 'EMAIL RECOVERY.',
            html: data
          });

          await sendMail(messageOptions);
        }
      });

      return {
        'success': true,
        'message': 'Your request was received, check email for verification code.'
      }
    }
  }
}