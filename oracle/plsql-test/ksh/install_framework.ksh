#!/bin/ksh
# #####################################################
# Script to invoke SQLPlus and load and prepare the
# automated database tests to be run by the CI pipeline
# #####################################################
sqlplus -s $APPN_DATABASE << EOF
-- Create the tables
@../GDD/TEST_FRAMEWORK_GDD.sql

-- Create supporting test package and procedures
@../sql/test_pkg_spec.sql
@../sql/test_pkg.sql
@../sql/test_routines.sql
@../sql/server_test_logging.sql

-- Create the supporting dynamic SQL procedures
@../sql/pkg_dynamic_sql_spec.sql
@../sql/pkg_dynamic_sql.sql

-- Create the main framework procedures
@../sql/pkg_server_testing_spec.sql
@../sql/pkg_server_testing.sql
exit
EOF
