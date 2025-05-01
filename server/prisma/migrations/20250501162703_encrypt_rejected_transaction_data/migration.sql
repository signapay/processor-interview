/*
  Warnings:

  - You are about to drop the column `recordData` on the `RejectedTransaction` table. All the data in the column will be lost.
  - Added the required column `authTag` to the `RejectedTransaction` table without a default value. This is not possible if the table is not empty.
  - Added the required column `encryptedData` to the `RejectedTransaction` table without a default value. This is not possible if the table is not empty.
  - Added the required column `iv` to the `RejectedTransaction` table without a default value. This is not possible if the table is not empty.

*/

-- First, add the new columns with default values
ALTER TABLE "RejectedTransaction"
ADD COLUMN "encryptedData" TEXT DEFAULT '',
ADD COLUMN "iv" TEXT DEFAULT '',
ADD COLUMN "authTag" TEXT DEFAULT '';

-- For existing records, we'll set the encryptedData to the recordData value
-- In a real production scenario, you would encrypt the data here
UPDATE "RejectedTransaction"
SET
  "encryptedData" = "recordData",
  "iv" = 'migrated-data',
  "authTag" = 'migrated-data';

-- Now remove the defaults and make the columns NOT NULL
ALTER TABLE "RejectedTransaction"
ALTER COLUMN "encryptedData" DROP DEFAULT,
ALTER COLUMN "iv" DROP DEFAULT,
ALTER COLUMN "authTag" DROP DEFAULT,
ALTER COLUMN "encryptedData" SET NOT NULL,
ALTER COLUMN "iv" SET NOT NULL,
ALTER COLUMN "authTag" SET NOT NULL;

-- Finally, drop the old column
ALTER TABLE "RejectedTransaction" DROP COLUMN "recordData";
