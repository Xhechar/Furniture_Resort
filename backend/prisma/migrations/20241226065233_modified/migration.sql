BEGIN TRY

BEGIN TRAN;

-- AlterTable
ALTER TABLE [dbo].[CustomOrder] ADD [DeliveryStatus] NVARCHAR(1000) NOT NULL CONSTRAINT [CustomOrder_DeliveryStatus_df] DEFAULT 'pending';

-- AlterTable
ALTER TABLE [dbo].[Order] ADD CONSTRAINT [Order_DeliveryStatus_df] DEFAULT 'pending' FOR [DeliveryStatus];

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
