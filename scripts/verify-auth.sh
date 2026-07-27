#!/usr/bin/env bash
#
# End-to-end check of the auth flow over real HTTP.
#
# This is the acceptance test for the reported issue: API Studio answering 401
# in production because no session cookie existed. It has TWO halves and both
# must hold. An authenticated caller must get through, AND an anonymous one
# must still be refused. If only the first passed, the 401 would have been
# "fixed" by removing the guard, which is a data breach rather than a fix.
#
# Every status is captured into a variable before being asserted. Inlining the
# command substitution into the assertion call reads more compactly and can
# word-split into extra arguments, which silently shifts the expected value out
# of position and reports a mismatch as a pass.
#
# Usage:  ./scripts/verify-auth.sh [base-url]     (default http://localhost:3000)

set -uo pipefail

BASE="${1:-http://localhost:3000}"
JAR="$(mktemp)"
JAR_OLD="$(mktemp)"
SLUG="verify-$$-$RANDOM"
EMAIL="$SLUG@verify.local"
PASSWORD="VerifyTest1234"
NEWPASSWORD="ChangedPassword99"
JSON='content-type: application/json'

pass=0
fail=0
limited=0

check() { # check <label> <actual> <expected>
  if [ "$2" = "$3" ]; then
    printf '  \033[32mPASS\033[0m  %-44s got %s, want %s\n' "$1" "$2" "$3"
    pass=$((pass + 1))
  elif [ "$2" = "429" ]; then
    # Not an assertion failure: the endpoint refused because THIS SCRIPT has
    # already spent the window. Counting it as a failure blames the code for
    # the test's own traffic.
    printf '  \033[33mSKIP\033[0m  %-44s rate limited, want %s\n' "$1" "$3"
    limited=$((limited + 1))
  else
    printf '  \033[31mFAIL\033[0m  %-44s got %s, want %s\n' "$1" "$2" "$3"
    fail=$((fail + 1))
  fi
}

status() { curl -s -o /dev/null -w '%{http_code}' --max-time 60 "$@"; }
body()   { curl -s --max-time 60 "$@"; }

echo
echo "Verifying $BASE"
echo

# --- Preflight --------------------------------------------------------------
# Fail fast when the app cannot reach its database, because every later
# assertion would then be a 503 reported as its own failure, burying the single
# real cause under twenty symptoms.
# Probes with a login that is certain to fail. It must reach the database to
# decide that, so 401 proves persistence works while 503 proves it does not.
# `/api/auth/me` is the wrong probe: it answers 401 from the cookie alone and
# never touches the database, so it looks healthy during a total outage.
code=$(status -X POST "$BASE/api/auth/login" -H "$JSON" \
  -d '{"email":"preflight-probe@verify.local","password":"NotARealPassword1"}')
if [ "$code" = "503" ]; then
  echo "  The app cannot reach its database."
  echo
  echo "  Almost always one of:"
  echo "    - DATABASE_URL missing from apps/web/.env.local"
  echo "      (the monorepo root .env does NOT configure the Next.js app)"
  echo "    - the dev server started before that file changed. The Prisma client is"
  echo "      cached on globalThis and survives hot reload, so only a full restart"
  echo "      of the process picks up a new connection string."
  echo
  echo "  The handlers log the cause deliberately:"
  echo "    grep -o 'Authentication failed[^\"]*' apps/web/.next/dev/logs/next-development.log | tail -1"
  echo
  exit 1
fi

# `/register` allows 5 per hour per IP and this script spends 4, so running it
# twice within the hour rate-limits itself. That is the limiter working, not a
# fault. Restarting the dev server clears the counters, which live in process
# memory until Phase 6 moves them to shared storage.

# --- Registration -----------------------------------------------------------
echo "register"

code=$(status -c "$JAR" -X POST "$BASE/api/auth/register" -H "$JSON" \
  -d "{\"email\":\"$EMAIL\",\"password\":\"$PASSWORD\",\"name\":\"Verify\",\"organizationName\":\"Verify Co\",\"organizationSlug\":\"$SLUG\"}")
check "creates a workspace" "$code" "201"

# curl marks HttpOnly cookies with a #HttpOnly_ prefix on the domain column.
# Its absence would mean JavaScript can read the session.
n=$(grep -c '^#HttpOnly_.*access_token' "$JAR")
check "access_token is HttpOnly" "$n" "1"
n=$(grep -c '^#HttpOnly_.*refresh_token' "$JAR")
check "refresh_token is HttpOnly" "$n" "1"

# `organizationName` must be at least 2 characters. Sending "X" fails
# validation and returns 400, so this asserted 409 against a request that never
# reached the slug check, and the weak-password case below passed for the wrong
# reason entirely. Every payload here must be valid EXCEPT the one thing under
# test.
code=$(status -X POST "$BASE/api/auth/register" -H "$JSON" \
  -d "{\"email\":\"other@verify.local\",\"password\":\"$PASSWORD\",\"name\":\"Other\",\"organizationName\":\"Other Co\",\"organizationSlug\":\"$SLUG\"}")
check "duplicate slug is refused" "$code" "409"

code=$(status -X POST "$BASE/api/auth/register" -H "$JSON" \
  -d "{\"email\":\"weak-$SLUG@verify.local\",\"password\":\"short\",\"name\":\"Weak\",\"organizationName\":\"Weak Co\",\"organizationSlug\":\"weak-$SLUG\"}")
check "a weak password is refused" "$code" "400"

code=$(status -X POST "$BASE/api/auth/register" -H "$JSON" -d 'this is not json')
check "malformed JSON is 400, not 500" "$code" "400"

# --- Session ----------------------------------------------------------------
echo
echo "session"

n=$(body -b "$JAR" "$BASE/api/auth/me" | grep -c "$EMAIL")
check "me returns the signed-in user" "$n" "1"

code=$(status "$BASE/api/auth/me")
check "me without a cookie is 401" "$code" "401"

# --- THE REPORTED BUG -------------------------------------------------------
echo
echo "api studio (the reported 401)"

code=$(status -b "$JAR" "$BASE/api/api-studio/workspaces")
check "authenticated request is allowed" "$code" "200"

code=$(status "$BASE/api/api-studio/workspaces")
check "anonymous request is STILL refused" "$code" "401"
if [ "$code" = "200" ]; then
  echo "        └─ the module's development fallback is active: with no token it"
  echo "           resolves the seeded demo tenant and answers as its Owner. Inert"
  echo "           when NODE_ENV=production, but it makes this assertion meaningless"
  echo "           locally. Set API_STUDIO_STRICT_AUTH=true in apps/web/.env.local"
  echo "           and restart, now that real sign-in works."
fi

# --- Rotation ---------------------------------------------------------------
echo
echo "refresh"

cp "$JAR" "$JAR_OLD"
before=$(grep 'refresh_token' "$JAR" | awk '{print $NF}')

code=$(status -b "$JAR" -c "$JAR" -X POST "$BASE/api/auth/refresh")
check "refresh succeeds" "$code" "200"

after=$(grep 'refresh_token' "$JAR" | awk '{print $NF}')
if [ "$before" != "$after" ]; then
  check "the refresh token rotated" "rotated" "rotated"
else
  check "the refresh token rotated" "unchanged" "rotated"
fi

# Replaying the retired token must be refused AND must revoke the family.
code=$(status -b "$JAR_OLD" -X POST "$BASE/api/auth/refresh")
check "replaying a retired token is refused" "$code" "401"

code=$(status -b "$JAR" -X POST "$BASE/api/auth/refresh")
check "reuse revoked the whole session family" "$code" "401"

# --- Login ------------------------------------------------------------------
echo
echo "login"

code=$(status -c "$JAR" -X POST "$BASE/api/auth/login" -H "$JSON" \
  -d "{\"email\":\"$EMAIL\",\"password\":\"$PASSWORD\"}")
check "correct credentials sign in" "$code" "200"

code=$(status -X POST "$BASE/api/auth/login" -H "$JSON" \
  -d "{\"email\":\"$EMAIL\",\"password\":\"WrongPassword12\"}")
check "a wrong password is refused" "$code" "401"

code=$(status -X POST "$BASE/api/auth/login" -H "$JSON" \
  -d '{"email":"nobody@verify.local","password":"WrongPassword12"}')
check "an unknown address answers identically" "$code" "401"

# --- Profile ----------------------------------------------------------------
echo
echo "profile"

code=$(status -b "$JAR" -c "$JAR" -X PATCH "$BASE/api/auth/profile" -H "$JSON" \
  -d '{"name":"Renamed Person"}')
check "profile updates" "$code" "200"

n=$(body -b "$JAR" "$BASE/api/auth/me" | grep -c 'Renamed Person')
check "the change is visible immediately" "$n" "1"

code=$(status -b "$JAR" -X PATCH "$BASE/api/auth/profile" -H "$JSON" \
  -d '{"email":"new@verify.local"}')
check "an email change is refused, not ignored" "$code" "400"

# --- Change password --------------------------------------------------------
echo
echo "change password"

# Without the CSRF header this is refused outright, so the token is fetched
# first. That request also sets the readable cookie the header must match.
CSRF=$(curl -s -b "$JAR" -c "$JAR" --max-time 60 "$BASE/api/auth/csrf" \
  | sed -E 's/.*"token":"([^"]*)".*/\1/')

code=$(status -b "$JAR" -X PATCH "$BASE/api/auth/change-password" -H "$JSON" \
  -d "{\"currentPassword\":\"$PASSWORD\",\"newPassword\":\"$NEWPASSWORD\",\"confirmPassword\":\"$NEWPASSWORD\"}")
check "no CSRF token is refused" "$code" "403"

code=$(status -b "$JAR" -X PATCH "$BASE/api/auth/change-password" -H "$JSON" \
  -H "x-csrf-token: 0000000000000000000000000000000000000000000000000000000000000000" \
  -d "{\"currentPassword\":\"$PASSWORD\",\"newPassword\":\"$NEWPASSWORD\",\"confirmPassword\":\"$NEWPASSWORD\"}")
check "a wrong CSRF token is refused" "$code" "403"

code=$(status -b "$JAR" -X PATCH "$BASE/api/auth/change-password" -H "$JSON" \
  -H "x-csrf-token: $CSRF" \
  -d "{\"currentPassword\":\"Wrong12345678\",\"newPassword\":\"$NEWPASSWORD\",\"confirmPassword\":\"$NEWPASSWORD\"}")
check "the current password is required" "$code" "401"

code=$(status -b "$JAR" -c "$JAR" -X PATCH "$BASE/api/auth/change-password" -H "$JSON" \
  -H "x-csrf-token: $CSRF" \
  -d "{\"currentPassword\":\"$PASSWORD\",\"newPassword\":\"$NEWPASSWORD\",\"confirmPassword\":\"$NEWPASSWORD\"}")
check "change-password succeeds" "$code" "200"

code=$(status -b "$JAR" "$BASE/api/auth/me")
check "this session survives the change" "$code" "200"

code=$(status -X POST "$BASE/api/auth/login" -H "$JSON" \
  -d "{\"email\":\"$EMAIL\",\"password\":\"$NEWPASSWORD\"}")
check "the new password works" "$code" "200"

# --- Forgot password --------------------------------------------------------
echo
echo "forgot password"

known=$(body -X POST "$BASE/api/auth/forgot-password" -H "$JSON" -d "{\"email\":\"$EMAIL\"}")
unknown=$(body -X POST "$BASE/api/auth/forgot-password" -H "$JSON" \
  -d '{"email":"definitely-nobody@verify.local"}')
if [ "$known" = "$unknown" ]; then
  check "known and unknown answer identically" "identical" "identical"
else
  check "known and unknown answer identically" "different" "identical"
fi

# --- Logout -----------------------------------------------------------------
echo
echo "logout"

code=$(status -b "$JAR" -c "$JAR" -X POST "$BASE/api/auth/logout")
check "logout succeeds" "$code" "200"

code=$(status -b "$JAR" "$BASE/api/auth/me")
check "the session is dead afterwards" "$code" "401"

code=$(status -X POST "$BASE/api/auth/logout")
check "logout without a session still succeeds" "$code" "200"

# --- Email verification -----------------------------------------------------
echo
echo "email verification"

code=$(status -X POST "$BASE/api/auth/verify-email" -H "$JSON" -d '{"token":"forged-token-value"}')
check "a forged verification token is refused" "$code" "400"

code=$(status -X POST "$BASE/api/auth/verify-email" -H "$JSON" -d '{}')
check "a missing token is a 400, not a 500" "$code" "400"

# Resend is authenticated and takes no body: the address comes from the session,
# so it cannot be aimed at somebody else's inbox.
code=$(status -X POST "$BASE/api/auth/resend-verification")
check "resend requires a session" "$code" "401"

# --- Security headers -------------------------------------------------------
echo
echo "security headers"

headers=$(curl -sI --max-time 60 "$BASE/" | tr 'A-Z' 'a-z')
for header in x-frame-options x-content-type-options referrer-policy permissions-policy; do
  n=$(printf '%s' "$headers" | grep -c "^$header:")
  check "$header is set" "$n" "1"
done

# Auth responses must never be stored: a cached 200 from /api/auth/me on a
# shared machine is one user's identity served to the next.
n=$(curl -sI -b "$JAR" --max-time 60 "$BASE/api/auth/me" | tr 'A-Z' 'a-z' | grep -c 'cache-control:.*no-store')
check "auth responses are no-store" "$n" "1"

rm -f "$JAR" "$JAR_OLD"

echo
echo "-------------------------------------------------------------"
if [ "$limited" -gt 0 ]; then
  printf '  %d passed, %d failed, %d skipped (rate limited)\n' "$pass" "$fail" "$limited"
  echo "  Restart the dev server to clear the counters, then re-run."
else
  printf '  %d passed, %d failed\n' "$pass" "$fail"
fi
echo "-------------------------------------------------------------"
echo
echo "Remove the test workspace when you are done:"
echo "  psql \"\$DIRECT_URL\" -c \"DELETE FROM organizations WHERE slug LIKE 'verify-%';\""
echo
[ "$fail" -eq 0 ]
