#!/bin/ksh
# ***************************************************************************
# *                                                                         *
# *             Copyright (c) ADB SAFEGATE Airport Systems 2020.            *
# *                           All rights reserved.                          *
# *                                                                         *
# ***************************************************************************
# *                                                                         *
# * Filename:              run_tests.ksh                                    *
# * Module Name:           Automated Testing                                *
# * Subsystem Name:        Automated Testing                                *
# * Originating Author:    Ian Cowburn                                      *
# * Design Reference:      AIMS-4345                                        *
# *                                                                         *
# ***************************************************************************
# *                                                                         *
# * Description:                                                            *
# *                                                                         *
# * This script acts as a wrapper around the release automated test script. *
# *                                                                         *
# ***************************************************************************

if [ ! "$APPN_HOME" ] ; then
    echo $0: APPN_HOME not set
    exit 1
fi

TEST_SCRIPT=$APPN_HOME/test/automated_server_testing/execute_tests.ksh

if [ ! -f $APPN_HOME/test/automated_server_testing/execute_tests.ksh ] ; then
    echo $0: No automated test script
    exit 1
fi

cd $APPN_HOME/test/automated_server_testing
./execute_tests.ksh
