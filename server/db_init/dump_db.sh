#!/bin/bash

# Database credentials
DB_USER="mlt"
DB_NAME="mltdb"

# Output file paths
SCHEMA_FILE="./schema.sql"
USERS_FILE="./users.sql"

# Dump the schema
pg_dump -U $DB_USER -s -d $DB_NAME -f $SCHEMA_FILE
if [ $? -eq 0 ]; then
  echo "Schema dumped successfully to $SCHEMA_FILE"
else
  echo "Failed to dump schema" >&2
  exit 1
fi

# Dump the users table data
pg_dump -U $DB_USER -t users -d $DB_NAME -f $USERS_FILE
if [ $? -eq 0 ]; then
  echo "Users data dumped successfully to $USERS_FILE"
else
  echo "Failed to dump users data" >&2
  exit 1
fi

echo "Database dump completed successfully."
