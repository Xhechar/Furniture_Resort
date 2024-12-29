BEGIN TRY

BEGIN TRAN;

-- AlterTable
ALTER TABLE [dbo].[Product] ADD [IsCustommable] BIT NOT NULL CONSTRAINT [Product_IsCustommable_df] DEFAULT 0,
[IsFlushed] BIT NOT NULL CONSTRAINT [Product_IsFlushed_df] DEFAULT 0;

-- AlterTable
ALTER TABLE [dbo].[Progress] ADD CONSTRAINT [Progress_Status_df] DEFAULT 'incomplete' FOR [Status];
ALTER TABLE [dbo].[Progress] ADD [IsApproved] BIT NOT NULL CONSTRAINT [Progress_IsApproved_df] DEFAULT 0;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
