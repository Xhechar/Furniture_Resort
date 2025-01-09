import { User } from "@prisma/client";

export const mockedUser: User = {
  UserId: "usr-1",
  Fullname: "Mocked User",
  Email: "mockeduser01@gmail.com",
  Mobile: "0700000000",
  Country: "None",
  City: "None",
  Gender: "Neither",
  IdentificationNumber: 0,
  ProfileImage: "no-profile",
  BackgroundWallpaper: "no-wallpaper",
  Password: "myPassword",
  IsWelcomed: false,
  IsDeleted: false,
  DateCreated: new Date(),
  HasOrder: false,
  HasWishList: false,
  Role: "user",
  Selected: false
}