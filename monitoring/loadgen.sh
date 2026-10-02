#!/usr/bin/env bash
# Sends mixed traffic (good requests, a 404 and a 500) so every dashboard panel has data.
# Usage: bash monitoring/loadgen.sh        (stop with Ctrl+C)
URL="${1:-http://localhost:3000}"
echo "Sending traffic to $URL ... press Ctrl+C to stop"
while true; do
  curl -s -o /dev/null "$URL/"
  curl -s -o /dev/null "$URL/attendance"
  curl -s -o /dev/null "$URL/healthz"
  [ $((RANDOM % 4)) -eq 0 ] && curl -s -o /dev/null "$URL/fail"
  [ $((RANDOM % 8)) -eq 0 ] && curl -s -o /dev/null "$URL/does-not-exist"
  sleep 0.3
done
