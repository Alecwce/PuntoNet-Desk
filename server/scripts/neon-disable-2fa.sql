-- ============================================
-- EMERGENCY: Disable 2FA for Admin User
-- Run this in Neon SQL Editor
-- ============================================

-- 1. First, check the current admin status
SELECT id, email, "isTwoFactorEnabled", "twoFactorSecret" 
FROM "User" 
WHERE email = 'admin@puntonet.com';

-- 2. Disable 2FA and clear secret
UPDATE "User" 
SET 
  "isTwoFactorEnabled" = false,
  "twoFactorSecret" = NULL
WHERE email = 'admin@puntonet.com';

-- 3. Verify the change
SELECT id, email, "isTwoFactorEnabled", "twoFactorSecret" 
FROM "User" 
WHERE email = 'admin@puntonet.com';

-- Expected result: isTwoFactorEnabled should be false, twoFactorSecret should be NULL
