import {PrismaClient} from "@prisma/client";
import { User } from "../interfaces/backend.interfaces";
import { UserInterface } from "../interfaces/services.coupling.interfaces";
import { v4 } from "uuid";
import bcryptjs from 'bcryptjs'

export class UserService implements UserInterface {
  
  prisma = new PrismaClient({
    log: ["error"]
  });

  public async createUser(user: User) : Promise<{success: boolean, message?: string, error?: string}> {

    let emailExists = await this.prisma.user.findUnique({
      where: {
        Email: user.Email
      }
    });

    if (emailExists) {
      if (emailExists.IsDeleted == false) {
        return {
          'success': false,
          'error': 'The email provided exists, Login instead.'
        }
      } else {
        return {
          'success': false,
          'error': 'Sorry, your account has been terminated. Contact us for assistance'
        }
      }
    }

    let phoneExists = await this.prisma.user.findUnique({
      where: {
        Mobile: user.Mobile
      }
    });

    if (phoneExists) {
      if (phoneExists.IsDeleted == false) {
        return {
          'success': false,
          'error': 'The mobile number provided exists, Login instead.'
        }
      } else {
        return {
          'success': false,
          'error': 'Sorry, your account has been terminated. Contact us for assistance'
        }
      }
    }

    let idExists = await this.prisma.user.findUnique({
      where: {
        IdentificationNumber: user.IdentificationNumber
      }
    });

    if (idExists) {
      if (idExists.IsDeleted == false) {
        return {
          'success': false,
          'error': 'The Identification number provided exists, Login instead.'
        }
      } else {
        return {
          'success': false,
          'error': 'Sorry, your account has been terminated. Contact us for assistance'
        }
      }
    }
    
    let { UserId, IsWelcomed, IsDeleted, DateCreated, HasOrder, Password, HasWishList, Orders, CustomOrders, WishListProducts, CartItems, Reviews, Progresses, Role, ...details } = user;

    let createUser = await this.prisma.user.create({
      data: {
        UserId: v4(),
        Password: bcryptjs.hashSync(user.Password, 10),
        ...details
      }
    });

    if (createUser) {
      return {
        'success': true,
        'message': `${createUser.Fullname.split(' ')[0]}, your registraation was successfull. Login ...`
      }
    } else {
      return {
        'success': false,
        'error': 'Unable to register at the moment. Try again later'
      }
    }
  }

  public async updateUser(UserId: string, user: User): Promise<{ success: boolean; error?: string; message?: string; }> {
    
    let userExists = await this.prisma.user.findUnique({
      where: {
        UserId
      }
    });

    if (userExists) {
      if (userExists.IsDeleted) {
        return {
          'success': false,
          'error': 'Update failed. Your account has been terminated'
        }
      } else {
        let { UserId, IsWelcomed, IsDeleted, DateCreated, HasOrder, Password, HasWishList, Orders, CustomOrders, WishListProducts, CartItems, Reviews, Progresses, Role, ...details } = user;

        let updateUser = await this.prisma.user.update({
          data: {
            UserId: userExists.UserId,
            ...details
          },
          where: {
            UserId
          }
        });

        if (updateUser) {
          return {
            'success': true,
            'message': `${updateUser.Fullname.split(' ')[0]}, your profile updated successfully.`
          }
        } else {
          return {
            'success': false,
            'error': 'Unable to update account. Try again later'
          }
        }
      }
    } else {
      return {
        'success': false,
        'error': 'Your account does not exist.'
      }
    }
  }
  public async updateUserRole(UserId: string): Promise<{ success: boolean; error?: string; message?: string; }> {
    let userExists = await this.prisma.user.findUnique({
      where: {
        UserId
      }
    });

    if (userExists == null) {
      return {
        'success': false,
        'error': 'User specified is not found'
      }
    }

    if (userExists.IsDeleted) {
      return {
        'success': false,
        'error': 'Unable to assign. User is deleted'
      }
    }

    if (userExists.Role == 'user') {

      let updateRole = await this.prisma.user.update({
        data: {
          Role: 'admin'
        },
        where: {
          UserId
        }
      });

      if (updateRole) {
        return {
          'success': true,
          'message': `${updateRole.Fullname.split(' ')[0]} granted previllage to admin successfully.`
        }
      } else {
        return {
          'success': false,
          'error': 'Unable to grant previledge'
        }
      }
    } else {

      let updateRole = await this.prisma.user.update({
        data: {
          Role: 'user'
        },
        where: {
          UserId
        }
      });

      if (updateRole) {
        return {
          'success': true,
          'message': `${updateRole.Fullname.split(' ')[0]} dissmissed previllage successfully.`
        }
      } else {
        return {
          'success': false,
          'error': 'Unable to dissmiss previledge at the moment'
        }
      }
    }
  }
  public async updateBackgroundPhoto(UserId: string, backgroundUrl: string): Promise<{ success: boolean; error?: string; message?: string; }> {

    let userExists = await this.prisma.user.findUnique({
      where: {
        UserId
      }
    });

    if (userExists) {
      if (userExists.IsDeleted) {
        return {
          'success': false,
          'error': 'Update failed because account is terminated. Contact admin'
        }
      } else {

        let updateBackgroundPhoto = await this.prisma.user.update({
          data: {
            BackgroundWallpaper: backgroundUrl
          },
          where: {
            UserId
          }
        });

        if (updateBackgroundPhoto) {
          return {
            'success': true,
            'message': 'Profile updated successfully'
          }
        } else {
          return {
            'success': false,
            'error': 'Unable to update background image.'
          }
        }
      }
    } else {
      return {
        'success': false,
        'error': 'User is not found'
      }
    }
  }
  public async restoreSoftDeletedUser(UserId: string): Promise<{ success: boolean; error?: string; message?: string; }> {
    let userExists = await this.prisma.user.findUnique({
      where: {
        UserId
      }
    });

    if (userExists == null) {
      return {
        'success': false,
        'error': 'User specified not found.'
      }
    }

    if (!userExists.IsDeleted) {
      return {
        'success': false,
        'error': 'User specified status is active.'
      }
    }

    let softDeleteSingleUser = await this.prisma.user.update({
      data: {
        IsDeleted: false
      },
      where: {
        UserId
      }
    });

    if (softDeleteSingleUser) {
      return {
        'success': true,
        'message': 'User restored successfully.'
      }
    } else {
      return {
        'success': false,
        'error': 'Unable to restore user at the moment.'
      }
    }
  }
  public async softDeleteMultipleUsers(UserIds: string[]): Promise<{ success: boolean; error?: string; message?: string; }> {
    let usersExists = await this.prisma.user.findMany({
      where: {
        UserId: {
          in: UserIds
        }
      }
    });

    if (usersExists.length == 0) {
      return {
        'success': false,
        'error': 'The specified users are not found'
      }
    }

    let softDeleteMultipleUsers = await this.prisma.user.updateMany({
      data: {
        IsDeleted: true
      },
      where: {
        UserId: {
          in: UserIds
        }
      }
    });

    if (softDeleteMultipleUsers.count > 0) {
      return {
        'success': true,
        'message': 'Users deleted successfully'
      }
    } else {
      return {
        'success': false,
        'error': 'Unable to delete the specified users'
      }
    }
  }
  public async deleteMultipleUsers(UserIds: string[]): Promise<{ success: boolean; error?: string; message?: string; }> {
    let usersExists = await this.prisma.user.findMany({
      where: {
        UserId: {
          in: UserIds
        }
      }
    });

    if (usersExists.length == 0) {
      return {
        'success': false,
        'error': 'The specified users are not found'
      }
    }

    let deleteMultipleUsers = await this.prisma.user.deleteMany({
      where: {
        UserId: {
          in: UserIds
        }
      }
    });

    if (deleteMultipleUsers.count > 0) {
      return {
        'success': true,
        'message': 'Users deleted successfully.'
      }
    } else {
      return {
        'success': false,
        'error': 'Unable to delete users at the moment'
      }
    }
  }
  public async deleteSingleUser(UserId: string): Promise<{ success: boolean; error?: string; message?: string; }> {
    let userExists = await this.prisma.user.findUnique({
      where: {
        UserId
      }
    });

    if (userExists == null) {
      return {
        'success': false,
        'error': 'User specified is not found.'
      }
    } else {
      let deleteSingleUser = await this.prisma.user.delete({
        where: {
          UserId
        }
      });

      if (deleteSingleUser) {
        return {
          'success': true,
          'message': 'User deleted successfully.'
        }
      } else {
        return {
          'success': false,
          'error': 'Unable to delete user at the moment.'
        }
      }
    }
  }
  public async softDeleteSingleUser(UserId: string): Promise<{ success: boolean; error?: string; message?: string; }> {
    let userExists = await this.prisma.user.findUnique({
      where: {
        UserId
      }
    });

    if (userExists == null) {
      return {
        'success': false,
        'error': 'User is not found.'
      }
    }

    if (userExists.IsDeleted) {
      return {
        'success': false,
        'error': 'User status is currently deleted.'
      }
    }

    let softDeleteSingleUser = await this.prisma.user.update({
      data: {
        IsDeleted: true,
      },
      where: {
        UserId
      }
    });

    if (softDeleteSingleUser) {
      return {
        'success': true,
        'message': 'User successfully deleted.'
      }
    } else {
      return {
        'success': false,
        'error': 'User deleted successfully.'
      }
    }
  }
  public async restoreMultipleSoftDeletedUser(UserIds: string[]): Promise<{ success: boolean; error?: string; message?: string; }> {
    let usersExists = await this.prisma.user.findMany({
      where: {
        UserId: {
          in: UserIds
        }
      }
    });

    if (usersExists.length == 0) {
      return {
        'success': false,
        'error': 'The specified users are not found'
      }
    }

    let restoreMultipleSoftDeletedUser = await this.prisma.user.updateMany({
      data: {
        IsDeleted: false
      },
      where: {
        UserId: {
          in: UserIds
        }
      }
    });

    if (restoreMultipleSoftDeletedUser.count > 0) {
      return {
        'success': true,
        'message': 'Users restored successfully'
      }
    } else {
      return {
        'success': false,
        'error': 'Unable to restore the specified users'
      }
    }
  }
  
  public async getAllSoftDeletedUsers(): Promise<{ success: boolean; error?: string; message?: string; users?: User[] | unknown[]; }> {

    let usersExists = await this.prisma.user.findMany({
      where: {
        IsDeleted: true,
        Role: {
          not: 'admin'
        }
      }
    });

    if (usersExists.length == 0) {
      return {
        'success': false,
        'error': 'The specified users are not found.'
      }
    } else {
      return {
        'success': true,
        'message': 'Users retrieved successfully.',
        'users': usersExists
      }
    }
  }
  public async getAllUsers(): Promise<{ success: boolean; error?: string; message?: string; users?: User[] | unknown[] }> {
    let usersExists = await this.prisma.user.findMany({
      where: {
        IsDeleted: false,
        Role: {
          not: 'admin'
        }
      },
      include: {
        Orders: true,
        CustomOrders: true,
        WishListProducts: true,
        CartItems: true,
        Reviews: true,
        Progresses: true
      }
    });

    if (usersExists.length == 0) {
      return {
        'success': false,
        'error': 'Users are not found.'
      }
    } else {
      return {
        'success': true,
        'message': 'Users retreived successfully.',
        'users': usersExists
      }
    }
  }
  public async getSingleUser(UserId: string): Promise<{ success: boolean; error?: string; message?: string; user?: User | unknown; }> {
    let userExists = await this.prisma.user.findUnique({
      where: {
        UserId
      },
      include: {
        Orders: true,
        CustomOrders: true,
        WishListProducts: true,
        CartItems: true,
        Reviews: true,
        Progresses: true
      }
    });

    if (userExists) {
      if (userExists.IsDeleted) {
        return {
          'success': false,
          'error': 'Your account is deactivated. Contact us.'
        }
      } else {
        return {
          'success': true,
          'message': 'User fetched successfully.',
          'user': userExists
        }
      }
    } else {
      return {
        'success': false,
        'error': 'User specified does not exist.'
      }
    }
  }
}