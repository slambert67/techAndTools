#!/bin/ksh
# #####################################################
# Script to invoke SQLPlus and load and prepare the
# automated database tests to be run by the CI pipeline
# #####################################################

dir=$(dirname $0)

sqlplus -s $APPN_DATABASE << EOF
-- Create the tables
@$dir/../GDD/TEST_FRAMEWORK_GDD.sql

-- Create supporting test package and procedures
@$dir/../sql/test_pkg_spec.sql
@$dir/../sql/test_pkg.sql
@$dir/../sql/test_routines.sql
@$dir/../sql/server_test_logging.sql

-- Create the supporting dynamic SQL procedures
@$dir/../sql/pkg_dynamic_sql_spec.sql
@$dir/../sql/pkg_dynamic_sql.sql

-- Create the main framework procedures
@$dir/../sql/pkg_server_testing_spec.sql
@$dir/../sql/pkg_server_testing.sql
exit
EOF
