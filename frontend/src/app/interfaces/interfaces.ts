export interface User {
  UserId: string, 
  Fullname: string,
  Email: string,
  Mobile: string,
  Country: string,
  City: string,
  Gender: string,
  IdentificationNumber: number,
  ProfileImage: string,
  BackgroundWallpaper: string,
  Password: string,
  IsWelcomed: boolean, 
  IsDeleted: boolean, 
  DateCreated: Date,
  HasOrder: boolean,  
  HasWishList: boolean,
  Role: string,
  Selected: boolean,
  Orders?: Order[],
  CustomOrders?: CustomOrder[],
  WishListProducts?: Wishlist[],
  CartItems?: Cart[],
  Reviews?: Review[],
  Progresses?: Progress[]
}

export interface Product {
  ProductId: string,
  ProductName: string,
  ProductImages: string,
  ShortDesc: string,
  LongDesc: string,
  Sizes: string,
  Category: string,
  Colour: string,
  Prize: number,
  StockQuantity: number,
  StockLimit: number,
  CustomPrize: number,
  OnOffer: boolean, 
  OnFlushSale: boolean,
  Discount: number,
  MakePeriods: number,
  Deposit: number,
  DateCreated: Date,
  ProductQuantityTimes?: ProductQuantityTime[],
  Reviews?: Review[],
  Orders?: Order[],
  CustomOrders?: CustomOrder[],
  Carts?: Cart[],
  Wishlists?: Wishlist[],
  Progresses?: Progress[],
  IsActivated: boolean,
  IsFlushed?: boolean
}

export interface ProductQuantityTime {
  ProductQuantityTimeId: string,
  ProductId: string,
  Quantity: number,
  Price: number,
  Period: number,
  Product?: Product
}

export interface Order {
  OrderId: string,
  UserId: string,
  ProductId: string,
  Quantity: number,
  Price: number,
  AmountPaid: number,
  OrderType: string,
  Discount: number,
  MpesaCode?: string,
  DateCreated: string,
  DeliveryStatus: string,
  User?: User,
  Product?: Product
}

export interface orderDetails {
  AmountPaid: number,
  MpesaCode?: string,
  OrderType: string
}

export interface Recovery {
  RecoveryId: string,
  Email: string,
  RecoveryCode: number
  CodeSent: boolean,
  DateCreated: string
}

export interface CustomOrder {
  CustomOrderId: string,
  ProductId: string,
  UserId: string,
  Price: number,
  Discount: number,
  Quantity: number,
  Deposit: number,
  Balance: number,
  DateCreated: string,
  DateModified: Date,
  DepMpesaCode?: string,
  BalMpesaCode?: string,
  DeliveryStatus: boolean,
  User?: User,
  Product?: Product,
  Progresses?: Progress[]
}


export interface MpesaReferalsBalance extends MpesaReferals{
  Balance: number
}

export interface Category {
  CategoryId: string,
  CategoryName: string
}

export interface Messages {
  MessagesId: string,
  SenderId: string,
  ReceiverId: string,
  Message: string,
  DateCreated: string
}

export interface Cart {
  CartId: string,
  ProductId: string,
  UserId: string,
  Quantity: number,
  Discount: number,
  Price: number,
  OrderType: string,
  DateCreated: string,
  User?: User,
  Product?: Product
}

export interface MpesaReferals {
  DepMpesaCode?: string,
  BalMpesaCode?: string
}

export interface Wishlist {
  WishlistId: string,
  ProductId: string,
  UserId: string,
  DateCreated: string,
  Products?: Product,
  User?: User
}

export interface Review {
  ReviewId: string,
  ProductId: string,
  UserId: string,
  ReviewText: string,
  Rating: number,
  DateCreated: string,
  Product?: Product,
  User?: User
}

export interface Progress {
  ProgressId: string,
  ProductId: string,
  UserId: string,
  CustomOrderId: string,
  DateCreated: string,
  MaterialsImages: string,
  ProgressImages: string,
  FinalImages: string,
  Status: string,
  DateCompleted: Date,
  Product?: Product,
  User?: User,
  CustomOrder?: CustomOrder
}

export interface LoginDetails {
  Email: string,
  Password: string
}

export interface RecoveryDetails {
  Email: string
  RecoveryCode: number,
  Password: string
}