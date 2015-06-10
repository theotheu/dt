#!/bin/bash
usage="$(basename "$0") -- script to fetch the data from the mongoDB @ server3 and stores it in the /data/seed folder

where:
    -h  show this help text
    -d  set the database to fetch"

# Set database value to be empty
DATABASE=""

# Handle the commandline options
while getopts ':hd:' option; do
  case "$option" in
    h) echo "$usage"
       exit;;
    d) DATABASE=$OPTARG
       dFlag=true
       ;;
    :) printf "missing argument for -%s\n" "$OPTARG" >&2
       echo "$usage" >&2
       exit 1
       ;;
   \?) printf "illegal option: -%s\n" "$OPTARG" >&2
       echo "$usage" >&2
       exit 1
       ;;
  esac
done
shift "$((OPTIND - 1))"

# If option -d is not given ask the user for the database name.
if [ -z "$DATABASE" ]; then
    echo "Please enter the database you want to fetch (e.g. s514073-dev):"
    read DATABASE
fi

# If database name is given exit the script
if [ -z "$DATABASE" ]; then
    echo "Database name is required. Exiting script."  >&2
    exit 1
fi


echo "Fetching data into /tmp directory"
mongodump --host server3.tezzt.nl --out /tmp --db $DATABASE

echo "Copying bson and json files into /data/seed directory"
cp /tmp/$DATABASE/* ./seed/

echo "Add new files to git"
git add ./seed/*