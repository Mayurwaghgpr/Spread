-- Run once against the production PostgreSQL database before deploying the
-- E2EE application build. The statements are idempotent.
--
-- Existing plaintext messages cannot safely be converted to E2EE because the
-- server never had recipients' private keys. They are marked legacy and the
-- client deliberately refuses to render their plaintext.

DO $$
BEGIN
  -- Add encryptionPublicKey to users if not present
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'users' AND column_name = 'encryptionPublicKey'
  ) THEN
    ALTER TABLE "users" ADD COLUMN "encryptionPublicKey" JSONB;
  END IF;

  -- Alter Messages.content to JSONB if it is not already jsonb
  IF EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'Messages' AND column_name = 'content' AND data_type <> 'jsonb'
  ) THEN
    ALTER TABLE "Messages"
      ALTER COLUMN "content" TYPE JSONB
      USING jsonb_build_object('v', 0, 'legacy', "content");
  END IF;
END $$;

UPDATE "Conversations"
SET "lastMessage" = 'Encrypted message'
WHERE "lastMessage" IS NOT NULL AND "lastMessage" <> '';
