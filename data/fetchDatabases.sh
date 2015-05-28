#!/bin/bash

echo "Please enter the database you want to fetch (e.g. s514073-dev):"
read DATABASE

echo "Fetching data into /tmp directory"
mongodump --host server3.tezzt.nl --out /tmp --db $DATABASE

echo "Copying bson and json files into /data/seed directory"
cp /tmp/$DATABASE/* ./seed/

echo "Add new files to git"
git add ./seed/*