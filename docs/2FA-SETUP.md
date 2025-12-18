# 2FA Setup Guide

## Overview

Two-Factor Authentication (2FA) is now implemented and ready to use. It's currently **DISABLED** for all users, but can be enabled at any time.

## How It Works

### Backend Configuration

- **Library**: `otplib` with `authenticator`
- **Token Length**: 6 digits
- **Time Step**: 30 seconds
- **Time Window**: ±2 steps (±60 seconds) - tolerant of clock drift between servers
- **Service Name**: "PuntoNet Service Desk"

### Security Features

- CORS properly configured with `x-2fa-token` header
- Rate limiting on login endpoint (20 attempts / 15 min)
- Temp token expires in 5 minutes during 2FA flow
- CSRF protection excluded from auth routes

## How to Enable 2FA for a User

### Option 1: Via Frontend (When you're logged in)

1. Login to the dashboard
2. Go to Settings or Profile
3. Click "Enable 2FA"
4. Scan QR code with Google Authenticator or Authy
5. Verify with generated code

### Option 2: Via API (Postman/curl)

```bash
# 1. Generate QR Code (requires auth token)
POST /api/auth/2fa/generate
Headers: Cookie: token=<your-jwt-token>

# Response will include:
# - qrCode: data URL for QR image
# - secret: for manual entry

# 2. Verify setup with code from authenticator app
POST /api/auth/2fa/verify
Headers: Cookie: token=<your-jwt-token>
Body: { "token": "123456" }
```

### Option 3: Direct Database (Emergency Only)

```sql
-- Enable 2FA for a specific user
UPDATE "User"
SET "isTwoFactorEnabled" = true,
    "twoFactorSecret" = '<generated-secret>'
WHERE email = 'user@example.com';
```

## Login Flow with 2FA

1. **Step 1**: User enters email + password
   - Backend returns `{ require2fa: true, tempToken: "...", userId: "..." }`
2. **Step 2**: Frontend shows 2FA code input
   - User enters 6-digit code from authenticator app
3. **Step 3**: Frontend sends code to `/api/auth/2fa/validate-login`
   - Headers: `x-2fa-token: <tempToken>`
   - Body: `{ userId: "...", token: "123456" }`
4. **Step 4**: Backend validates and returns final JWT

## Disabling 2FA

### Via API

```bash
POST /api/auth/2fa/disable
Headers: Cookie: token=<your-jwt-token>
```

### Via Database

```sql
UPDATE "User"
SET "isTwoFactorEnabled" = false, "twoFactorSecret" = NULL
WHERE email = 'admin@puntonet.com';
```

## Emergency Access

If you get locked out, use the emergency route:

```
GET /api/auth/emergency-reset?secret=puntonet2024recovery
```

This will disable 2FA for `admin@puntonet.com`.

## Recommendations

1. **Don't enable 2FA until you're ready** - test the flow first
2. **Save backup codes** - when implementing, add backup codes feature
3. **Test in staging first** - enable for a test user before admin
4. **Keep emergency route** - for account recovery

## Current Status

✅ 2FA code is ENABLED and functional
⚠️ No users have 2FA enabled (safe to deploy)
✅ Production-ready configuration (time drift tolerance)
✅ Frontend handles 2FA flow correctly
✅ CORS configured for cross-origin 2FA tokens
