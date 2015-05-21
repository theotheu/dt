#!/bin/bash

# books-prd keeps its data
for db in tahartemin-dev tahartemin-tst tahartemin-acc
do
    echo "Dropping $db"
    mongo $db --eval "db.dropDatabase()"
    echo "Restoring $db"
    mongorestore -d $db seed
done