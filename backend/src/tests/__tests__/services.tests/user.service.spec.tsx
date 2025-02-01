
import { PrismaClient } from "@prisma/client";
import { v4 } from "uuid";
import bcryptjs, { hashSync } from 'bcryptjs';
import { UserService } from "../../../services/user.service";
import { mockedUser } from "../../modules/tests.data";

jest.mock("@prisma/client", () => {
  const PrismaClient = jest.fn().mockImplementation(() => {
    return {
      user: {
        findUnique: jest.fn(),
        create: jest.fn()
      }
    }
  });

  return { PrismaClient };
});

jest.mock("bcryptjs", () => {
  return {
    hashSync: jest.fn()
  }
});

jest.mock("uuid", () => {
  return {
    v4: jest.fn()
  }
});

const mockedPrisma = new PrismaClient();

// describe("User-service: Create User Service", () => {

//   let userService: UserService;
  
//   beforeEach(() => {
//     userService = new UserService();
//     userService.prisma = mockedPrisma;
//   });

//   afterEach(() => jest.clearAllMocks());

//   it('should return an error if email passed exists', async () => {
    
//     (mockedPrisma.user.findUnique as jest.Mock).mockResolvedValueOnce(mockedUser);

//     let result = await userService.createUser({ ...mockedUser });

//     expect(mockedPrisma.user.findUnique).toHaveBeenCalledWith({
//       where: {
//         Email: mockedUser.Email
//       }
//     });

//     expect(mockedPrisma.user.findUnique).toHaveBeenCalledTimes(1);

//     expect(result).toEqual({
//       "success": false,
//       "error": "The email provided exists, Login instead."
//     });
//   });

//   it("should return an error if the user is deleted", async () => {
//     (mockedPrisma.user.findUnique as jest.Mock).mockResolvedValueOnce({ ...mockedUser, IsDeleted: true });
    
//     let result = await userService.createUser({ ...mockedUser, IsDeleted: true });

//     expect(mockedPrisma.user.findUnique).toHaveBeenCalledTimes(1);

//     expect(mockedPrisma.user.findUnique).toHaveBeenCalledWith({
//       where: {
//         Email: mockedUser.Email
//       }
//     });

//     expect(result).toEqual({
//       'success': false,
//       'error': 'Sorry, your account has been terminated. Contact us for assistance'
//     });
//   });

//   it('should return an error if the mobile is found.', async () => {
//     (mockedPrisma.user.findUnique as jest.Mock).mockResolvedValueOnce(null);
//     (mockedPrisma.user.findUnique as jest.Mock).mockResolvedValueOnce(mockedUser);

//     let result = await userService.createUser({...mockedUser, Mobile: "0700000000", Email: "mockeduser02@gmail.com"});

//     expect(mockedPrisma.user.findUnique).toHaveBeenCalledWith({
//       where: {
//         Email: "mockeduser02@gmail.com"
//       }
//     });

//     expect(mockedPrisma.user.findUnique).toHaveBeenCalledWith({
//       where: {
//         Mobile: "0700000000"
//       }
//     });

//     expect(result).toEqual({
//       'success': false,
//       'error': 'The mobile number provided exists, Login instead.'
//     });
    
//   })
// })