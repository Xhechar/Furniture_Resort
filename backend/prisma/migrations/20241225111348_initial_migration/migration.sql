BEGIN TRY

BEGIN TRAN;

-- CreateTable
CREATE TABLE [dbo].[User] (
    [UserId] NVARCHAR(1000) NOT NULL,
    [Fullname] NVARCHAR(1000) NOT NULL,
    [Email] NVARCHAR(1000) NOT NULL,
    [Mobile] NVARCHAR(1000) NOT NULL,
    [Country] NVARCHAR(1000) NOT NULL,
    [City] NVARCHAR(1000) NOT NULL,
    [IdentificationNumber] INT NOT NULL,
    [ProfileImage] NVARCHAR(1000) NOT NULL,
    [BackgroundWallpaper] NVARCHAR(1000) NOT NULL,
    [Password] NVARCHAR(1000) NOT NULL,
    [IsWelcomed] BIT NOT NULL CONSTRAINT [User_IsWelcomed_df] DEFAULT 0,
    [IsDeleted] BIT NOT NULL CONSTRAINT [User_IsDeleted_df] DEFAULT 0,
    [DateCreated] DATETIME2 NOT NULL CONSTRAINT [User_DateCreated_df] DEFAULT CURRENT_TIMESTAMP,
    [HasOrder] BIT NOT NULL CONSTRAINT [User_HasOrder_df] DEFAULT 0,
    [HasWishList] BIT NOT NULL CONSTRAINT [User_HasWishList_df] DEFAULT 0,
    CONSTRAINT [User_pkey] PRIMARY KEY CLUSTERED ([UserId]),
    CONSTRAINT [User_UserId_key] UNIQUE NONCLUSTERED ([UserId]),
    CONSTRAINT [User_Email_key] UNIQUE NONCLUSTERED ([Email])
);

-- CreateTable
CREATE TABLE [dbo].[Product] (
    [ProductId] NVARCHAR(1000) NOT NULL,
    [ProductName] NVARCHAR(1000) NOT NULL,
    [ProductImages] NVARCHAR(1000) NOT NULL,
    [ShortDesc] NVARCHAR(1000) NOT NULL,
    [LongDesc] NVARCHAR(1000) NOT NULL,
    [Sizes] NVARCHAR(1000) NOT NULL,
    [Category] NVARCHAR(1000) NOT NULL,
    [Colour] NVARCHAR(1000) NOT NULL,
    [Prize] FLOAT(53) NOT NULL,
    [StockQuantity] INT NOT NULL,
    [StockLimit] INT NOT NULL,
    [CustomPrize] FLOAT(53) NOT NULL,
    [OnOffer] BIT NOT NULL CONSTRAINT [Product_OnOffer_df] DEFAULT 0,
    [OnFlushSale] BIT NOT NULL CONSTRAINT [Product_OnFlushSale_df] DEFAULT 0,
    [DateCreated] DATETIME2 NOT NULL CONSTRAINT [Product_DateCreated_df] DEFAULT CURRENT_TIMESTAMP,
    [Discount] FLOAT(53) NOT NULL,
    [MakePeriods] INT NOT NULL,
    [Deposit] FLOAT(53) NOT NULL,
    [IsActivated] BIT NOT NULL CONSTRAINT [Product_IsActivated_df] DEFAULT 0,
    CONSTRAINT [Product_pkey] PRIMARY KEY CLUSTERED ([ProductId]),
    CONSTRAINT [Product_ProductId_key] UNIQUE NONCLUSTERED ([ProductId])
);

-- CreateTable
CREATE TABLE [dbo].[ProductQuantityTime] (
    [ProductQuantityTimeId] NVARCHAR(1000) NOT NULL,
    [ProductId] NVARCHAR(1000) NOT NULL,
    [Quantity] INT NOT NULL,
    [Period] INT NOT NULL,
    CONSTRAINT [ProductQuantityTime_pkey] PRIMARY KEY CLUSTERED ([ProductQuantityTimeId]),
    CONSTRAINT [ProductQuantityTime_ProductQuantityTimeId_key] UNIQUE NONCLUSTERED ([ProductQuantityTimeId])
);

-- CreateTable
CREATE TABLE [dbo].[Order] (
    [OrderId] NVARCHAR(1000) NOT NULL,
    [UserId] NVARCHAR(1000) NOT NULL,
    [ProductId] NVARCHAR(1000) NOT NULL,
    [Quantity] INT NOT NULL,
    [Price] FLOAT(53) NOT NULL,
    [AmountPaid] FLOAT(53) NOT NULL,
    [OrderType] NVARCHAR(1000) NOT NULL CONSTRAINT [Order_OrderType_df] DEFAULT 'normal',
    [Discount] NVARCHAR(1000) NOT NULL,
    [MpesaCode] NVARCHAR(1000),
    [DateCreated] DATETIME2 NOT NULL CONSTRAINT [Order_DateCreated_df] DEFAULT CURRENT_TIMESTAMP,
    [DeliveryStatus] NVARCHAR(1000) NOT NULL,
    CONSTRAINT [Order_pkey] PRIMARY KEY CLUSTERED ([OrderId]),
    CONSTRAINT [Order_OrderId_key] UNIQUE NONCLUSTERED ([OrderId])
);

-- CreateTable
CREATE TABLE [dbo].[Recovery] (
    [RecoveryId] NVARCHAR(1000) NOT NULL,
    [Email] NVARCHAR(1000) NOT NULL,
    [RecoveryCode] INT NOT NULL,
    [CodeSent] BIT NOT NULL CONSTRAINT [Recovery_CodeSent_df] DEFAULT 0,
    CONSTRAINT [Recovery_pkey] PRIMARY KEY CLUSTERED ([RecoveryId]),
    CONSTRAINT [Recovery_RecoveryId_key] UNIQUE NONCLUSTERED ([RecoveryId])
);

-- CreateTable
CREATE TABLE [dbo].[CustomOrder] (
    [CustomOrderId] NVARCHAR(1000) NOT NULL,
    [ProductId] NVARCHAR(1000) NOT NULL,
    [UserId] NVARCHAR(1000) NOT NULL,
    [Price] FLOAT(53) NOT NULL,
    [Discount] FLOAT(53) NOT NULL,
    [Quantity] INT NOT NULL,
    [Deposit] FLOAT(53) NOT NULL,
    [Balance] FLOAT(53) NOT NULL,
    [DateCreated] DATETIME2 NOT NULL CONSTRAINT [CustomOrder_DateCreated_df] DEFAULT CURRENT_TIMESTAMP,
    [DateModified] DATETIME2 NOT NULL CONSTRAINT [CustomOrder_DateModified_df] DEFAULT CURRENT_TIMESTAMP,
    [DepMpesaCode] NVARCHAR(1000),
    [BalMpesaCode] NVARCHAR(1000),
    CONSTRAINT [CustomOrder_pkey] PRIMARY KEY CLUSTERED ([CustomOrderId]),
    CONSTRAINT [CustomOrder_CustomOrderId_key] UNIQUE NONCLUSTERED ([CustomOrderId])
);

-- CreateTable
CREATE TABLE [dbo].[Category] (
    [CategoryId] NVARCHAR(1000) NOT NULL,
    [CategoryName] NVARCHAR(1000) NOT NULL,
    CONSTRAINT [Category_pkey] PRIMARY KEY CLUSTERED ([CategoryId]),
    CONSTRAINT [Category_CategoryId_key] UNIQUE NONCLUSTERED ([CategoryId])
);

-- CreateTable
CREATE TABLE [dbo].[Messages] (
    [MessagesId] NVARCHAR(1000) NOT NULL,
    [SenderId] NVARCHAR(1000) NOT NULL,
    [ReceiverId] NVARCHAR(1000) NOT NULL,
    [Message] NVARCHAR(1000) NOT NULL,
    [DateCreated] DATETIME2 NOT NULL CONSTRAINT [Messages_DateCreated_df] DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT [Messages_pkey] PRIMARY KEY CLUSTERED ([MessagesId]),
    CONSTRAINT [Messages_MessagesId_key] UNIQUE NONCLUSTERED ([MessagesId])
);

-- CreateTable
CREATE TABLE [dbo].[Cart] (
    [CartId] NVARCHAR(1000) NOT NULL,
    [ProductId] NVARCHAR(1000) NOT NULL,
    [UserId] NVARCHAR(1000) NOT NULL,
    [Quantity] INT NOT NULL,
    [Discount] FLOAT(53) NOT NULL,
    [Price] FLOAT(53) NOT NULL,
    [OrderType] NVARCHAR(1000) NOT NULL,
    [DateCreated] DATETIME2 NOT NULL CONSTRAINT [Cart_DateCreated_df] DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT [Cart_pkey] PRIMARY KEY CLUSTERED ([CartId]),
    CONSTRAINT [Cart_CartId_key] UNIQUE NONCLUSTERED ([CartId])
);

-- CreateTable
CREATE TABLE [dbo].[Wishlist] (
    [WishlistId] NVARCHAR(1000) NOT NULL,
    [ProductId] NVARCHAR(1000) NOT NULL,
    [UserId] NVARCHAR(1000) NOT NULL,
    [DateCreated] DATETIME2 NOT NULL CONSTRAINT [Wishlist_DateCreated_df] DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT [Wishlist_pkey] PRIMARY KEY CLUSTERED ([WishlistId]),
    CONSTRAINT [Wishlist_WishlistId_key] UNIQUE NONCLUSTERED ([WishlistId])
);

-- CreateTable
CREATE TABLE [dbo].[Review] (
    [ReviewId] NVARCHAR(1000) NOT NULL,
    [ProductId] NVARCHAR(1000) NOT NULL,
    [UserId] NVARCHAR(1000) NOT NULL,
    [ReviewText] NVARCHAR(1000) NOT NULL,
    [Rating] FLOAT(53) NOT NULL,
    [DateCreated] DATETIME2 NOT NULL CONSTRAINT [Review_DateCreated_df] DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT [Review_pkey] PRIMARY KEY CLUSTERED ([ReviewId]),
    CONSTRAINT [Review_ReviewId_key] UNIQUE NONCLUSTERED ([ReviewId])
);

-- CreateTable
CREATE TABLE [dbo].[Progress] (
    [ProgressId] NVARCHAR(1000) NOT NULL,
    [ProductId] NVARCHAR(1000) NOT NULL,
    [UserId] NVARCHAR(1000) NOT NULL,
    [CustomOrderId] NVARCHAR(1000) NOT NULL,
    [DateCreated] DATETIME2 NOT NULL CONSTRAINT [Progress_DateCreated_df] DEFAULT CURRENT_TIMESTAMP,
    [MaterialsImages] NVARCHAR(1000) NOT NULL,
    [ProgressImages] NVARCHAR(1000) NOT NULL,
    [FinalImages] NVARCHAR(1000) NOT NULL,
    [Status] NVARCHAR(1000) NOT NULL,
    [DateCompleted] DATETIME2,
    CONSTRAINT [Progress_pkey] PRIMARY KEY CLUSTERED ([ProgressId]),
    CONSTRAINT [Progress_ProgressId_key] UNIQUE NONCLUSTERED ([ProgressId])
);

-- AddForeignKey
ALTER TABLE [dbo].[ProductQuantityTime] ADD CONSTRAINT [ProductQuantityTime_ProductId_fkey] FOREIGN KEY ([ProductId]) REFERENCES [dbo].[Product]([ProductId]) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[Order] ADD CONSTRAINT [Order_UserId_fkey] FOREIGN KEY ([UserId]) REFERENCES [dbo].[User]([UserId]) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[Order] ADD CONSTRAINT [Order_ProductId_fkey] FOREIGN KEY ([ProductId]) REFERENCES [dbo].[Product]([ProductId]) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[CustomOrder] ADD CONSTRAINT [CustomOrder_UserId_fkey] FOREIGN KEY ([UserId]) REFERENCES [dbo].[User]([UserId]) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[CustomOrder] ADD CONSTRAINT [CustomOrder_ProductId_fkey] FOREIGN KEY ([ProductId]) REFERENCES [dbo].[Product]([ProductId]) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[Cart] ADD CONSTRAINT [Cart_UserId_fkey] FOREIGN KEY ([UserId]) REFERENCES [dbo].[User]([UserId]) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[Cart] ADD CONSTRAINT [Cart_ProductId_fkey] FOREIGN KEY ([ProductId]) REFERENCES [dbo].[Product]([ProductId]) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[Wishlist] ADD CONSTRAINT [Wishlist_ProductId_fkey] FOREIGN KEY ([ProductId]) REFERENCES [dbo].[Product]([ProductId]) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[Wishlist] ADD CONSTRAINT [Wishlist_UserId_fkey] FOREIGN KEY ([UserId]) REFERENCES [dbo].[User]([UserId]) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[Review] ADD CONSTRAINT [Review_ProductId_fkey] FOREIGN KEY ([ProductId]) REFERENCES [dbo].[Product]([ProductId]) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[Review] ADD CONSTRAINT [Review_UserId_fkey] FOREIGN KEY ([UserId]) REFERENCES [dbo].[User]([UserId]) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[Progress] ADD CONSTRAINT [Progress_ProductId_fkey] FOREIGN KEY ([ProductId]) REFERENCES [dbo].[Product]([ProductId]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[Progress] ADD CONSTRAINT [Progress_UserId_fkey] FOREIGN KEY ([UserId]) REFERENCES [dbo].[User]([UserId]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[Progress] ADD CONSTRAINT [Progress_CustomOrderId_fkey] FOREIGN KEY ([CustomOrderId]) REFERENCES [dbo].[CustomOrder]([CustomOrderId]) ON DELETE NO ACTION ON UPDATE CASCADE;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
