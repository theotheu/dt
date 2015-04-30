#!/bin/bash

# books-prd keeps its data
for db in books-dev books-tst books-acc
do
    echo "Dropping $db"
    mongo $db --eval "db.dropDatabase()"
    echo "Restoring $db"
    mongorestore -d $db seed
done