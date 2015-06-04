#!/bin/bash

<<<<<<< HEAD
# books-prd keeps its data
for db in tahartemin-dev tahartemin-tst tahartemin-acc
=======
# deeltijd-prd keeps its data
for db in deeltijd-dev deeltijd-tst deeltijd-acc
>>>>>>> 403946fc1b733a3be555b529002dbbac5978bfa7
do
    echo "Dropping $db"
    mongo $db --eval "db.dropDatabase()"
    echo "Restoring $db"
    mongorestore -d $db seed
done
