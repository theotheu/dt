#!/bin/bash

# deeltijd-prd keeps its data
for db in S513753-dev S513753-tst S513753-acc
do
    echo "Dropping $db"
    mongo $db --eval "db.dropDatabase()"
    echo "Restoring $db"
    mongorestore -d $db seed
done
