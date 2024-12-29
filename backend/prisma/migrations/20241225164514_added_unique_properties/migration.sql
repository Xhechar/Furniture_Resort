/*
  Warnings:

  - A unique constraint covering the columns `[Mobile]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[IdentificationNumber]` on the table `User` will be added. If there are existing duplicate values, this will fail.

*/
BEGIN TRY

BEGIN TRAN;

-- CreateIndex
ALTER TABLE [dbo].[User] ADD CONSTRAINT [User_Mobile_key] UNIQUE NONCLUSTERED ([Mobile]);

-- CreateIndex
ALTER TABLE [dbo].[User] ADD CONSTRAINT [User_IdentificationNumber_key] UNIQUE NONCLUSTERED ([IdentificationNumber]);

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
