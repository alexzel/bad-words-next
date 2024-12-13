#!/bin/sh

set -e

for file in ../bad-words-next-data/*.json ; do
  filename=$(basename $file .json)

  echo "// NOTE: this script was auto-generated using generate.sh\nimport { dd } from './decode'\nexport default dd('$(cat ../bad-words-next-data/$filename.json | jq -c | hexdump -v -e '/1 "%02X "' | tr -d ' ')')" > ./src/$filename.ts

  echo "Generating $filename..."
done
