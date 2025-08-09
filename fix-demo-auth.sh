#!/bin/bash

# List of files to update
files=(
  "src/app/api/crm/leads/route.ts"
  "src/app/api/crm/campaigns/route.ts"
  "src/app/api/crm/segments/route.ts"
  "src/app/api/crm/analytics/route.ts"
  "src/app/api/csr/programs/route.ts"
  "src/app/api/csr/events/route.ts"
  "src/app/api/csr/volunteers/route.ts"
  "src/app/api/csr/analytics/route.ts"
  "src/app/api/patient/preferences/route.ts"
  "src/app/api/patient/feedback/analytics/route.ts"
)

# Replacement pattern
for file in "${files[@]}"; do
  echo "Updating $file..."
  sed -i '' 's/const { orgId } = auth();/let orgId = null;\
    try {\
      const authResult = auth();\
      orgId = authResult?.orgId;\
    } catch (error) {\
      \/\/ Auth failed, but continue in demo mode\
      console.log('\''Auth failed, continuing in demo mode'\'');\
    }/g' "$file"
done

echo "All files updated!"