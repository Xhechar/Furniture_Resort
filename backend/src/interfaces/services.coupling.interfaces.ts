import { PrismaClient, Wishlist } from "@prisma/client";
import { Cart, Category, CustomOrder, LoginDetails, Messages, MpesaReferals, MpesaReferalsBalance, Order, orderDetails, Product, ProductQuantityTime, Progress, Recovery, RecoveryDetails, Review, TokenDetails, User } from "./backend.interfaces";

export interface UserInterface {
  prisma: PrismaClient,
  createUser(user: User): Promise<{success: boolean, error?: string, message?: string}>,
  updateUser(UserId: string, user: User): Promise<{success: boolean, error?: string, message?: string}>,
  updateUserRole(UserId: string): Promise<{success: boolean, error?: string, message?: string}>,
  updateBackgroundPhoto(UserId: string, backgroundUrl: string): Promise<{ success: boolean, error?: string, message?: string }>,
  softDeleteSingleUser(UserId: string): Promise<{success: boolean, error?: string, message?: string}>,
  softDeleteMultipleUsers(UserIds: string[]): Promise<{success: boolean, error?: string, message?: string}>,
  deleteMultipleUsers(UserIds: string[]): Promise<{success: boolean, error?: string, message?: string}>,
  deleteSingleUser(UserId: string): Promise<{success: boolean, error?: string, message?: string}>,
  restoreSoftDeletedUser(UserId: string): Promise<{success: boolean, error?: string, message?: string}>,
  restoreMultipleSoftDeletedUser(UserIds: string[]): Promise<{success: boolean, error?: string, message?: string}>,
  getAllSoftDeletedUsers(): Promise<{success: boolean, error?: string, message?: string, users?: User[] | unknown[]}>,
  getAllUsers(): Promise<{success: boolean, error?: string, message?: string, users?: User[] | unknown[]}>,
  getSingleUser(UserId: string): Promise<{success: boolean, error?: string, message?: string, user?: User | unknown}>
}

export interface AuthInterface {
  prisma: PrismaClient;
  loginUser(Logins: LoginDetails): Promise<{ success: boolean, error?: string, message?: string, role?: string, token?: string }>,
  changePassword(Details: RecoveryDetails) : Promise<{success: boolean, error?:string, message?: string}>,
  getAllRecoveries() : Promise<{success: boolean, error?:string, message?: string, recoveries?: Recovery[] | unknown[]}>,
  verifyMail(Email: string) : Promise<{success: boolean, error?:string, message?: string}>
}

export interface CartInterface {
  prisma: PrismaClient;
  createCart(UserId: string, ProductId: string , cart: Cart): Promise<{success: boolean, error?: string, message?:string}>,
  updateCart(UserId: string, CartId: string, cart: Cart): Promise<{ success: boolean, error?: string, message?: string }>,
  deleteCart(UserId: string, CartId: string): Promise<{success: boolean, error?: string, message?:string}>,
  getCartByUserId(UserId: string): Promise<{success: boolean, error?: string, message?:string, carts?: Cart[] | unknown[]}>,
}

export interface CategoryInterface {
  prisma: PrismaClient;
  createCategory(category: Category): Promise<{success: boolean, error?: string, message?:string}>,
  updateCategory(CategoryId: string, category: Category): Promise<{ success: boolean, error?: string, message?: string }>,
  deleteCategory(CategoryId: string): Promise<{success: boolean, error?: string, message?:string}>,
  getAllCategories(): Promise<{success: boolean, error?: string, message?:string, categories?: Category[] | unknown[]}>,
}

export interface CustomOrderInterface {
  prisma: PrismaClient;
  createCustomOrder(UserId: string, referal: MpesaReferals): Promise<{success: boolean, error?: string, message?:string}>,
  updateCustomOrder(UserId: string, CustomOrderId: string, referal: MpesaReferalsBalance): Promise<{ success: boolean, error?: string, message?: string }>,
  updateCustomOrderStatus(UserId: string, CustomOrderId: string): Promise<{success: boolean, error?: string, message?:string}>,
  deleteCustomOrder(UserId: string, CustomOrderId: string): Promise<{success: boolean, error?: string, message?:string}>,
  getAllCustomOrders(): Promise<{ success: boolean, error?: string, message?: string, customOrders?: CustomOrder[] | unknown[] }>,
  getAllCustomOrdersDelivered(): Promise<{success: boolean, error?: string, message?:string, customOrders?: CustomOrder[] | unknown[]}>,
  getCustomOrdersByUserId(UserId: string): Promise<{success: boolean, error?: string, message?:string, customOrders?: CustomOrder[] | unknown[]}>,
}

export interface OrderInterface {
  prisma: PrismaClient;
  createOrder(UserId: string, order: orderDetails): Promise<{success: boolean, error?: string, message?:string}>,
  updateOrderStatus(UserId: string, OrderId: string): Promise<{success: boolean, error?: string, message?:string}>,
  deleteOrder(UserId: string, OrderId: string): Promise<{success: boolean, error?: string, message?:string}>,
  getAllOrders(): Promise<{success: boolean, error?: string, message?:string, orders?: Order[] | unknown[]}>,
  getAllOrdersDelivered(): Promise<{success: boolean, error?: string, message?:string, orders?: Order[] | unknown[]}>,
  getOrdersByUserId(UserId: string): Promise<{success: boolean, error?: string, message?:string, orders?: Order[] | unknown[]}>,
}

export interface MessagesInterface {
  prisma: PrismaClient;
  sendMessage(SenderId: string, message: Messages): Promise<{success: boolean, error?: string, message?:string}>,
  updateMessage(SenderId: string, MessagesId: string, message: Messages): Promise<{success: boolean, error?: string, message?:string}>,
  deleteMessage(UserId: string, MessagesId: string): Promise<{success: boolean, error?: string, message?:string}>,
  getAllSendersMessages(SenderId: string): Promise<{success: boolean, error?: string, message?:string, messages?: Messages[] | unknown[]}>,
  getMessageByMessageId(MessagesId: string): Promise<{success: boolean, error?: string, message?:string, messages?: Messages | unknown}>
}

export interface ProgressInterface {
  prisma: PrismaClient;
  createProgress(UserId: string, CustomOrderId: string): Promise<{success: boolean, error?: string, message?:string}>,
  updateProgress(UserId: string, ProgressId: string, progress: Progress): Promise<{success: boolean, error?: string, message?:string}>,
  updateProgressStatus(UserId: string, ProgressId: string): Promise<{success: boolean, error?: string, message?:string}>,
  approveProgress(UserId: string, ProgressId: string): Promise<{success: boolean, error?: string, message?:string}>,
  deleteProgress(UserId: string, ProgressId: string): Promise<{success: boolean, error?: string, message?:string}>,
  getAllProgresses(): Promise<{success: boolean, error?: string, message?:string, progresses?: Progress[] | unknown[]}>,
  getCompletedProgresses(): Promise<{success: boolean, error?: string, message?:string, progresses?: Progress[] | unknown[]}>,
  getProgressesByUserId(UserId: string): Promise<{success: boolean, error?: string, message?:string, progresses?: Progress[] | unknown[]}>,
}

export interface ReviewInterface {
  prisma: PrismaClient;
  createReview(UserId: string, ProductId: string, review: Review): Promise<{success: boolean, error?: string, message?:string}>,
  updateReview(UserId: string, ReviewId: string, review: Review): Promise<{success: boolean, error?: string, message?:string}>,
  deleteReview(ReviewId: string): Promise<{success: boolean, error?: string, message?:string}>,
  getAllReviews(): Promise<{success: boolean, error?: string, message?:string, reviews?: Review[] | unknown[]}>,
  getReviewsByUserId(UserId: string): Promise<{success: boolean, error?: string, message?:string, reviews?: Review[] | unknown[]}>,
}

export interface WishlistInterface {
  prisma: PrismaClient;
  createWishlist(UserId: string, ProductId: string): Promise<{success: boolean, error?: string, message?:string}>,
  deleteWishlist(UserId: string, WishlistId: string): Promise<{success: boolean, error?: string, message?:string}>,
  getWishlistByUserId(UserId: string): Promise<{success: boolean, error?: string, message?:string, wishlists?: Wishlist[]}>,
}

export interface ProductInterface {
  prisma: PrismaClient,
  createProduct(UserId: string, product: Product): Promise<{success: boolean, error?: string, message?: string}>,
  updateProduct(UserId: string, ProductId: string, product: Product): Promise<{success: boolean, error?: string, message?: string}>,
  toggleActivationStatus(UserId: string, ProductId: string): Promise<{success: boolean, error?: string, message?: string}>,
  toggleActivationOfMultipleProducts(UserId: string, ProductIds: string[]): Promise<{success: boolean, error?: string, message?: string}>,
  toggleOnOffer(UserId: string, ProductId: string): Promise<{ success: boolean, error?: string, message?: string }>,
  toggleOnOfferOfMultipleProducts(UserId: string, ProductIds: string[]): Promise<{success: boolean, error?: string, message?: string}>,
  toggleFlushSaleProduct(UserId: string, ProductId: string): Promise<{success: boolean, error?: string, message?: string}>,
  toggleMultipleFlushSaleProducts(UserId: string, ProductIds: string[]): Promise<{success: boolean, error?: string, message?: string}>,
  automateFlashSaleProducts(): Promise<{success: boolean, error?: string, message?: string}>,
  toggleCustomisationOfSingleProduct(UserId: string, ProductId: string): Promise<{success: boolean, error?: string, message?: string}>,
  toggleMultipleCustomisationOfProducts(UserId: string, ProductIds: string[]): Promise<{success: boolean, error?: string, message?: string}>,
  deleteMultipleProducts(UserId: string, ProductIds: string[]): Promise<{success: boolean, error?: string, message?: string}>,
  deleteSingleProduct(UserId: string, ProductId: string): Promise<{success: boolean, error?: string, message?: string}>,
  getAllActivatedProducts(): Promise<{success: boolean, error?: string, message?: string, products?: Product[] | unknown[]}>,
  getAllActivatedProductsOnOffer(): Promise<{success: boolean, error?: string, message?: string, products?: Product[] | unknown[]}>,
  getAllActivatedProductsOnFlushsale(): Promise<{success: boolean, error?: string, message?: string, products?: Product[] | unknown[]}>,
  getAllProducts(UserId: string): Promise<{success: boolean, error?: string, message?: string, products?: Product[] | unknown[]}>,
  getSingleActivatedProduct(UserId: string, ProductId: string): Promise<{success: boolean, error?: string, message?: string, product?: Product | unknown}>
}

export interface PtQTInteface {
  prisma: PrismaClient,
  createPQT(ProductId: string, pqt: ProductQuantityTime): Promise<{success: boolean, error?: string, message?:string}>,
  updatePQT(ProductQuantityTimeId: string, pqt: ProductQuantityTime): Promise<{success: boolean, error?: string, message?:string}>,
  deletePQT(ProductQuantityTimeId: string): Promise<{success: boolean, error?: string, message?:string}>,
  getPQTByProductId(ProductId: string): Promise<{success: boolean, error?: string, message?:string, pqts?: ProductQuantityTime[] | unknown[]}>,
}