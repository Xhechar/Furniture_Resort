BEGIN TRY

BEGIN TRAN;

-- AlterTable
ALTER TABLE [dbo].[CustomOrder] ADD [DeliveryMailSent] BIT NOT NULL CONSTRAINT [CustomOrder_DeliveryMailSent_df] DEFAULT 0;

-- AlterTable
ALTER TABLE [dbo].[Order] ADD [DeliveryMailSent] BIT NOT NULL CONSTRAINT [Order_DeliveryMailSent_df] DEFAULT 0;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
