#!/bin/sh
BACKUP_DIR='/backup'
FILENAME='mongobackup'
NOW=$(date +%Y%m%d%H%M%S)
RETAIN=20
/usr/bin/mongodump --host=mongo --archive=${BACKUP_DIR}/${FILENAME}_$NOW.gz --gzip
# Keep the 10 most recent backups
ls -t1 $BACKUP_DIR/$FILENAME* | tail -n +$((RETAIN+1)) | xargs rm -f
