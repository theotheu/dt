#!/bin/bash

# deeltijd-prd keeps its data
for db in deeltijd-dev deeltijd-tst deeltijd-acc

do
    echo "Dropping $db"
    mongo $db --eval "db.dropDatabase()"
    echo "Restoring $db"
    mongorestore -d $db seed
done
