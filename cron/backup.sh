#!/bin/sh
BACKUP_DIR='/backup'
FILENAME='mongobackup'
NOW=$(date +%Y%m%d%H%M%S)
RETAIN=10
/usr/bin/mongodump --host=mongo --archive=/backup/mongobackup.gz --gzip
# Keep the 10 most recent backups
ls -t1 $BACKUP_DIR/$FILENAME* | tail -n +$((RETAIN+1)) | xargs rm -f
