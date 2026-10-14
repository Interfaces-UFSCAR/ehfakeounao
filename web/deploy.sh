#!/bin/bash
set -euo pipefail

cd "$(dirname "$0")"
source .env.local

cd frontend
bun install --frozen-lockfile
STATIC_EXPORT=1 NEXT_PUBLIC_API_URL=/api bun run build

aws s3 sync out/ "s3://$DEPLOY_BUCKET" --delete --no-progress
aws cloudfront create-invalidation --distribution-id "$DEPLOY_DISTRIBUTION" --paths "/*" --query Invalidation.Status --output text
