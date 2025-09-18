#!/bin/bash

# --- Config ---
HOST="yenzer.net"
USER="steven@yenzer.net"
PASS="fUvpa5-potzek-vebkuc"
REMOTE_DIR="public_html/chords"

# --- Build the app ---
npm run build

# --- Deploy over SFTP ---
lftp -u $USER,$PASS sftp://$HOST <<EOF
set sftp:auto-confirm yes
mkdir -p $REMOTE_DIR
mirror -R dist $REMOTE_DIR --delete --verbose
bye
EOF
