#!/bin/bash

export COMMIT_MESSAGE="Automatic Deployment: `date`"
export STAGE0=development
export STAGE1=test-static-analyzer-passed
export STAGE2=test-unit-tests-passed
export STAGE3=acceptance
export STAGE4=production
export BASEDIR="`pwd`/../../"
export JSLINT=$BASEDIR/tests/static-analyzer/node_modules/jslint
export DIR=`pwd`
export CUR_SCRIPT="`basename $0`.log"
# Default port number for test
export TEST_PORT=3001
# Default port number for acceptance
export ACCEPTANCE_PORT=3002

while getopts ":a:t:" opt; do
  case $opt in
    t)
      TEST_PORT=$OPTARG
      ;;
    a)
      ACCEPTANCE_PORT=$OPTARG
      ;;
    \?)
      echo "Invalid option: -$OPTARG" >&2
      exit 1
      ;;
    :)
      echo "Option -$OPTARG requires an argument." >&2
      exit 1
      ;;
  esac
done

echo "`date` Verify that no other process is running by checking the pid file"
if [ -f pid ]; then
    echo "`date` A pid file exists. Let's check if the process is still running."
    export PID=`cat pid`
    export PROCESS_IS_RUNNING=`ps -aef|grep $PID|grep -v grep|wc|awk {'print $1'}`

    if [ $PROCESS_IS_RUNNING != 0 ]; then
        echo "`date` Other process is running. Aborting now. Wait till the current process is finished (or remove the pid file)."
        exit 1;
    else
        echo "`date` No process is running but pid file exist. Let's remove the pid file."
        rm -f pid
    fi

fi

echo "`date` ******************************** New log" > "$PWD/$CUR_SCRIPT"
export PARENT_COMMAND=$(ps $PPID | tail -n 1 | awk "{print \$5}")
echo "`date` Executed by $PARENT_COMMAND" | tee -a "$PWD/$CUR_SCRIPT"

echo
echo "`date` -------------------------------------------------------------------------------" | tee -a "$DIR/$CUR_SCRIPT"
echo "`date` - Preflight checks" | tee -a "$DIR/$CUR_SCRIPT"
echo "`date` -------------------------------------------------------------------------------" | tee -a "$DIR/$CUR_SCRIPT"
echo

export OWN_PID=$$
echo "`date` Writing process id = $OWN_PID to pid file." | tee -a "$DIR/$CUR_SCRIPT"
echo $OWN_PID > pid

echo "`date` Make sure jslint is installed" | tee -a "$DIR/$CUR_SCRIPT"
if [[ ! -d $JSLINT ]]; then
	#install jslint locally
	echo "`date` Please install jslint first." | tee -a "$DIR/$CUR_SCRIPT"
	echo "`date`   jslint is expected to be installed in $BASEDIR/tests/static-analyzer/." | tee -a "$DIR/$CUR_SCRIPT"
	exit 1
fi

echo "`date` Resetting data sets." | tee -a "$DIR/$CUR_SCRIPT"
cd $BASEDIR/data
./restoreDatabases.sh  | tee -a "$DIR/$CUR_SCRIPT"
cd -



echo | tee -a "$DIR/$CUR_SCRIPT"
echo "`date` -------------------------------------------------------------------------------" | tee -a "$DIR/$CUR_SCRIPT"
echo "`date` - STAGE0, development" | tee -a "$DIR/$CUR_SCRIPT"
echo "`date` -------------------------------------------------------------------------------" | tee -a "$DIR/$CUR_SCRIPT"
echo | tee -a "$DIR/$CUR_SCRIPT"

git checkout $STAGE0 | tee -a "$DIR/$CUR_SCRIPT"
git fetch --all
git reset --hard
git pull | tee -a "$DIR/$CUR_SCRIPT"

echo | tee -a "$DIR/$CUR_SCRIPT"
echo "`date` -------------------------------------------------------------------------------" | tee -a "$DIR/$CUR_SCRIPT"
echo "`date` - STAGE1, static-analyzer" | tee -a "$DIR/$CUR_SCRIPT"
echo "`date` -------------------------------------------------------------------------------" | tee -a "$DIR/$CUR_SCRIPT"
echo | tee -a "$DIR/$CUR_SCRIPT"

git checkout $STAGE1 | tee -a "$DIR/$CUR_SCRIPT"

cd $BASEDIR/tests/static-analyzer
./run_lint.sh

if [ -f $BASEDIR/tests/static-analyzer/static-analyzer-error-results.json ]; then
	echo "`date` >>>>> ERRORS: No commit for branch 'test' was performed." | tee -a "$DIR/$CUR_SCRIPT"
	echo "`date` >>>>>   Resolve the conflicts before continuing." | tee -a "$DIR/$CUR_SCRIPT"
	git checkout $STAGE0 | tee -a "$DIR/$CUR_SCRIPT"
	exit 1
fi

git merge --no-edit $STAGE0 | tee -a "$DIR/$CUR_SCRIPT"
git commit -am "Merging from $STAGE0 to $STAGE1: `date`" | tee -a "$DIR/$CUR_SCRIPT"
git push origin $STAGE1 | tee -a "$DIR/$CUR_SCRIPT"

echo "`date` -------------------------------------------------------------------------------" | tee -a "$DIR/$CUR_SCRIPT"
echo "`date` - STAGE2, unit-tests" | tee -a "$DIR/$CUR_SCRIPT"
echo "`date` -------------------------------------------------------------------------------" | tee -a "$DIR/$CUR_SCRIPT"

git checkout $STAGE2 | tee -a "$DIR/$CUR_SCRIPT"
git fetch --all
git reset --hard
git pull

# Set environment for stage
export NODE_ENV=test

# Check if node is already started
echo "`date` Check if Node.js is already started on port $TEST_PORT" | tee -a $CUR_SCRIPT
export node_PID=`lsof|grep $TEST_PORT|awk {'print $2'}|uniq`
if [ "$node_PID" != "" ]; then
    echo "`date` Killing Node.js that was already started with $node_PID" | tee -a $CUR_SCRIPT
    kill -9 $node_PID 2>&1 &
fi

cd "$BASEDIR/server"
node bin/www.js >/dev/null 2>&1 &
export node_PID=$!
echo "`date` Node.js started with process id = $node_PID" | tee -a $CUR_SCRIPT
sleep 4

# Change directory to unit-tests
cd "$BASEDIR/tests/unit-tests"

rm -f unit-tests-results.json

# Run the unit test
mocha > unit-tests-results.json

# kill node
echo "`date` Killing Node.js started with process id = $node_PID" | tee -a $CUR_SCRIPT
kill -9 $node_PID 2>&1 &

# count fail occurences
#export TEST_FAILURUES=`grep -ci 'fail' unit-tests-results.log`
export TEST_FAILURUES=`grep -ci '"failures": 0' unit-tests-results.json`

if [ -z "$TEST_FAILURUES" ]; then
    echo "`date` >>>>> ERRORS ERRORS ERRORS" | tee -a "$DIR/$CUR_SCRIPT"
	echo "`date` >>>>>   Could not execute the tests. Variable is not set TEST_FAILURUES=$TEST_FAILURUES" | tee -a "$DIR/$CUR_SCRIPT"
	git checkout $STAGE0 | tee -a "$DIR/$CUR_SCRIPT"
    exit 1
fi

if [ $TEST_FAILURUES -ne 1 ]; then
    echo "`date` >>>>> ERRORS ERRORS ERRORS" | tee -a "$DIR/$CUR_SCRIPT"
	echo "`date` >>>>>   Did not pass the unit-tests with $TEST_FAILURUES errors" | tee -a "$DIR/$CUR_SCRIPT"
	echo "`date` >>>>>   Fix the erros in unit-tests-results.json" | tee -a "$DIR/$CUR_SCRIPT"
	git checkout $STAGE0 | tee -a "$DIR/$CUR_SCRIPT"
	exit 1
fi

if [ -f ./test/static-analyzer/static-analyzer-error-results.json ]; then
	echo ">>>>> ERRORS: No commit for branch 'test' was performed." | tee -a "$DIR/$CUR_SCRIPT"
	echo ">>>>>   Resolve the conflicts before continuing." | tee -a "$DIR/$CUR_SCRIPT"
	git checkout $STAGE0 | tee -a "$DIR/$CUR_SCRIPT"
	exit 1
fi

git merge --no-edit $STAGE1 | tee -a "$DIR/$CUR_SCRIPT"
git commit -am "Merging from $STAGE2 to $STAGE2: `date`" | tee -a "$DIR/$CUR_SCRIPT"
git push origin $STAGE2 | tee -a "$DIR/$CUR_SCRIPT"

echo | tee -a "$DIR/$CUR_SCRIPT"
echo "`date` -------------------------------------------------------------------------------" | tee -a "$DIR/$CUR_SCRIPT"
echo "`date` - STAGE3, end to end" | tee -a "$DIR/$CUR_SCRIPT"
echo "`date` -------------------------------------------------------------------------------" | tee -a "$DIR/$CUR_SCRIPT"
echo | tee -a "$DIR/$CUR_SCRIPT"

git checkout $STAGE3 | tee -a "$DIR/$CUR_SCRIPT"
git fetch --all
git reset --hard
git pull

# Set environment for stage
export NODE_ENV=acceptance


# Check if node is already started

echo "`date` Check if Node.js is already started on port $ACCEPTANCE_PORT" | tee -a $CUR_SCRIPT
export node_PID=`lsof|grep $ACCEPTANCE_PORT|awk {'print $2'}|uniq`
if [ "$node_PID" != "" ]; then
    echo "`date` Killing Node.js that was already started with $node_PID" | tee -a $CUR_SCRIPT
    kill -9 $node_PID  2>&1 &
fi

# start up node
cd "$BASEDIR/server"
node bin/www.js >/dev/null 2>&1 &
export node_PID=$!
sleep 4
echo "`date` Node.js started with process id = $node_PID" | tee -a $CUR_SCRIPT

# Check if selenium is already started
export selenium_PID=`lsof|grep 4444|awk {'print $2'}|uniq`

if [ "$selenium_PID" != "" ]; then
    echo "`date` Selenium already running with id = $selenium_PID" | tee -a $CUR_SCRIPT
else
    # start up selenium-stand-alone
    selenium-standalone start --version=2.43.1 >/dev/null 2>&1 &
    export selenium_PID=$!
    echo "`date` Selenium started with process id=$selenium_PID" | tee -a $CUR_SCRIPT
fi

# run e2e tests
cd "$BASEDIR/tests/e2e"
echo "`date` Current directory = `pwd`. It should end with e2e." | tee -a $CUR_SCRIPT
echo "`date` Running the e2e tests." | tee -a $CUR_SCRIPT
protractor conf.js
echo "`date` Finished the e2e tests." | tee -a $CUR_SCRIPT

# kill node process
echo "`date` Killing Node.js id=$node_PID" | tee -a $CUR_SCRIPT
kill -9 $node_PID 2>&1 &

# kill selenium process
echo "`date` No need to kill Selenium. It keeps on running with id=$selenium_PID" | tee -a $CUR_SCRIPT
#kill -9 $selenium_PID

# count fail occurences
export TEST_FAILURUES=`grep -ci '"status": "failed"' end-to-end-results.json`

if [ -z "$TEST_FAILURUES" ]; then
    echo "`date` >>>>> ERRORS ERRORS ERRORS" | tee -a "$DIR/$CUR_SCRIPT"
	echo "`date`   Could not execute the tests. Variable TEST_FAILURUES=$TEST_FAILURUES (is not set)" | tee -a "$DIR/$CUR_SCRIPT"
	git checkout $STAGE0 | tee -a "$DIR/$CUR_SCRIPT"
    exit 1
fi

if [ $TEST_FAILURUES -ne 0 ]; then
    echo "`date` >>>>> ERRORS ERRORS ERRORS" | tee -a "$DIR/$CUR_SCRIPT"
	echo "`date` >>>>>   Did not pass the end-to-end tests." | tee -a "$DIR/$CUR_SCRIPT"
	echo "`date` >>>>>   Fix the errors in the end-to-end-results.json" | tee -a "$DIR/$CUR_SCRIPT"
	git checkout $STAGE0 | tee -a "$DIR/$CUR_SCRIPT"
	exit 1
fi

git merge --no-edit $STAGE2 | tee -a "$DIR/$CUR_SCRIPT"
git commit -am "Merging from $STAGE2 to $STAGE3: `date`" | tee -a "$DIR/$CUR_SCRIPT"
git push origin $STAGE3 | tee -a "$DIR/$CUR_SCRIPT"

echo | tee -a "$DIR/$CUR_SCRIPT"
echo "`date` -------------------------------------------------------------------------------" | tee -a "$DIR/$CUR_SCRIPT"
echo "`date` - STAGE4, production" | tee -a "$DIR/$CUR_SCRIPT"
echo "`date` -------------------------------------------------------------------------------" | tee -a "$DIR/$CUR_SCRIPT"
echo | tee -a "$DIR/$CUR_SCRIPT"

git checkout $STAGE4 | tee -a "$DIR/$CUR_SCRIPT"
git fetch --all
git reset --hard
git pull

git merge --no-edit $STAGE3 | tee -a "$DIR/$CUR_SCRIPT"
git commit -am "Merging from $STAGE3 to $STAGE4: `date`" | tee -a "$DIR/$CUR_SCRIPT"
git push origin $STAGE4 | tee -a "$DIR/$CUR_SCRIPT"

echo | tee -a "$DIR/$CUR_SCRIPT"
echo "`date` -------------------------------------------------------------------------------" | tee -a "$DIR/$CUR_SCRIPT"
echo "`date` - master" | tee -a "$DIR/$CUR_SCRIPT"
echo "`date` -------------------------------------------------------------------------------" | tee -a "$DIR/$CUR_SCRIPT"
echo | tee -a "$DIR/$CUR_SCRIPT"

git checkout master | tee -a "$DIR/$CUR_SCRIPT"
git fetch --all
git reset --hard
git pull

git merge --no-edit $STAGE4 | tee -a "$DIR/$CUR_SCRIPT"
git commit -am "Merging from $STAGE4 to master: `date`" | tee -a "$DIR/$CUR_SCRIPT"
git push origin master | tee -a "$DIR/$CUR_SCRIPT"

echo | tee -a "$DIR/$CUR_SCRIPT"
echo "`date` -------------------------------------------------------------------------------" | tee -a "$DIR/$CUR_SCRIPT"
echo "`date` - All stages successfull tested." | tee -a "$DIR/$CUR_SCRIPT"
echo "`date` -------------------------------------------------------------------------------" | tee -a "$DIR/$CUR_SCRIPT"
echo | tee -a "$DIR/$CUR_SCRIPT"

echo "`date` Checking out $STAGE0" | tee -a "$DIR/$CUR_SCRIPT"
git checkout $STAGE0 | tee -a "$DIR/$CUR_SCRIPT"

cd "$BASEDIR/server"
echo "`date` Current directory `pwd`" | tee -a "$DIR/$CUR_SCRIPT"

export NODE_ENV=production

echo "`date` Stop running Node.js (don't show errors if Node.js is not running)." | tee -a "$DIR/$CUR_SCRIPT"
forever stop bin/www.js >/dev/null 2>&1

echo "`date` Start running Node.js." | tee -a "$DIR/$CUR_SCRIPT"
forever start bin/www.js

echo "`date` Removing pid file" | tee -a "$DIR/$CUR_SCRIPT"
rm -f "$DIR/pid"