#!/bin/bash

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "🧪 TESTING PUNTONET-DESK DEPLOYMENT"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# Test 1: Backend Health Check
echo ""
echo "1️⃣ Testing Backend Health Check..."
HEALTH=$(curl -s https://puntonet-desk-production.up.railway.app/health)
echo "Response: $HEALTH"

if echo "$HEALTH" | grep -q "healthy"; then
    echo "✅ Health check PASSED"
else
    echo "❌ Health check FAILED"
fi

# Test 2: CORS Preflight (OPTIONS)
echo ""
echo "2️⃣ Testing CORS Preflight..."
CORS=$(curl -s -X OPTIONS \
  https://puntonet-desk-production.up.railway.app/api/auth/login \
  -H "Origin: https://punto-net-desk.vercel.app" \
  -H "Access-Control-Request-Method: POST" \
  -H "Access-Control-Request-Headers: Content-Type" \
  -i | grep -i "access-control-allow-origin")

echo "CORS Headers: $CORS"

if echo "$CORS" | grep -q "punto-net-desk.vercel.app"; then
    echo "✅ CORS PASSED"
else
    echo "❌ CORS FAILED - Vercel origin not allowed"
fi

# Test 3: Database Connection (implicitly checked via health endpoint often, but dependent on implementation)
echo ""
echo "3️⃣ Testing Database Connection..."
# Assuming 'connected' or similar is returned in the health check JSON based on earlier context
if echo "$HEALTH" | grep -q "connected"; then
    echo "✅ Database connection PASSED"
elif echo "$HEALTH" | grep -q "database"; then
     # Fallback check if it mentions database but maybe dynamic status
     echo "⚠️ Database mentioned in health check, verify status manually: $HEALTH"
else
    echo "❌ Database connection FAILED or not reported in health check"
fi

# Test 4: Frontend Loading
echo ""
echo "4️⃣ Testing Frontend Loading..."
FRONTEND=$(curl -s -o /dev/null -w "%{http_code}" https://punto-net-desk.vercel.app)

if [ "$FRONTEND" -eq 200 ]; then
    echo "✅ Frontend PASSED (HTTP $FRONTEND)"
else
    echo "❌ Frontend FAILED (HTTP $FRONTEND)"
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "📊 SUMMARY"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
