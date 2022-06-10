-- -----------------------------------------------------------------------------
--
--              Copyright (c) ADB SAFEGATE Airport Systems UK Ltd 2020 
--                            All rights reserved
--
-- -----------------------------------------------------------------------------
--            
-- Subsystem Name  : Automated Server Testing Framework
-- Module          : Automated Server Testing       
-- Original Author : Steve Lambert                
--
-- -----------------------------------------------------------------------------
--
-- Description
-- -----------
-- Provides a framework for executing and reporting on server tests specified as data
-- See individual routines for more in depth detail.
--
--
-- Design Notes
-- ------------
--
-- See http://man-cisrv-1.ultra-as.net:8000/aims/server/wikis/Automated%20Server%20Testing
--
--
-- Modification History
-- --------------------
-- AIMS-3460 - Steve Lambert - 03/06/20 - Initial revision.
-- AIMS-3676 - Steve Lambert - 09/07/20 - Implement SELECT functionality to enable
--                                        framework to make available any database data
--                                        to subsequent test steps
-- AIMS-3833 - Steve Lambert - 02/09/20 - Enable assertions against exception messages
-- AIMS-3805 - Steve Lambert - 29/09/20 - Implement today and now date functionality
-- AIMS_3957 - Steve Lambert - 01/10/20 - Prefix all generated packages with AST_
-- AIMS-4076 - Steve Lambert - 06/11/20 - Handle CLOBs representing JSON for routine parameters
-- AIMS-4039 - Steve Lambert - 22/10/20 - Implement seed data functionality
-- AIMS-4285 - Steve Lambert - 30/11/20 - Improve reporting of failed assertions
-- AIMS-4382 - Steve Lambert - 11/12/20 - Support much larger sizes for dynamically created packages
-- AIMS-4417 - Steve Lambert - 18/12/20 - Support 128 byte/char lengths for identifiers
-- AIMS-4433 - Steve Lambert - 22/12/20 - WHERE clause no longer mandatory for DML operations and assertions
-- AIMS-4446 - Steve Lambert - 24/12/20 - Miscellaneous naming changes
-- AIMS-4650 - Steve Lambert - 12/02/21 - Add sequence to SERVER_TEST_RUN_STATUSES table
-- AIMS-5022 - Steve Lambert - 03/08/21 - Rework of seed data functionality. Added backout functionality
-- AIMS-5475 - Steve Lambert - 20/08/21 - Support an action of (C)ommit
-- AIMS-5957 - Steve Lambert - 21/01/22 - Support new 'exists' and '!exists' matchers
-- AIMS-6201 - Steve Lambert - 17/05/22 - Improve Logging
-- -----------------------------------------------------------------------------

CREATE OR REPLACE PACKAGE BODY 
-- Identifier: AIMS-6201

pkg_server_testing
IS

-- =============================================================================
--
--                          Global declarations
--
-- =============================================================================


  TYPE TEST_STEPS IS TABLE OF server_tests%ROWTYPE INDEX BY PLS_INTEGER;  -- steps for a suite and test number
  TYPE SEED_DATA IS TABLE OF TEST_STEPS INDEX BY VARCHAR2(10);

  -- package globals
  g_log_detail           SMALLINT;  -- 0:none, 1:low, 2:medium, 3:high
  g_expectation_index    SMALLINT;
  g_package_spec         VARCHAR2(32767);
  g_package_body         CLOB;
  g_current_package_name VARCHAR2(128);

  g_primary_keys     JSON_OBJECT_T;
  g_framework_values JSON_OBJECT_T;
  g_column_types     JSON_OBJECT_T;

  g_log_number              server_test_logs.log_number%TYPE;
  g_current_functional_area server_tests.functional_area%TYPE;
  g_current_test_suite      server_tests.test_suite%TYPE;
  g_current_test_number     server_tests.test_number%TYPE;
  g_current_test_step       server_tests%ROWTYPE;
  g_current_assertion       INTEGER;
  g_site_id                 VARCHAR2(3);
  g_test_stage              SMALLINT;  
  g_bypass_operation        BOOLEAN;
  g_all_seed_data           SEED_DATA;
  g_all_seed_data_backout   SEED_DATA;
  g_seed_data_backout       JSON_ARRAY_T;

  -- package constants
  DIAG                           CONSTANT SMALLINT     := 1;
  HIGH_DETAIL                    CONSTANT SMALLINT     := 3;
  NO_DETAIL                      CONSTANT SMALLINT     := 4;
  DATE_FORMAT                    CONSTANT VARCHAR2(20) := 'YYYY-MM-DD"T"HH24:MI';
  DBMS_TYPES_BOOLEAN             CONSTANT PLS_INTEGER  := 0;
  DBMS_TYPES_NULL_JSON           CONSTANT PLS_INTEGER  := -1;
  DBMS_TYPES_JSON_OBJECT         CONSTANT PLS_INTEGER  := -2;
  DBMS_TYPES_JSON_ARRAY          CONSTANT PLS_INTEGER  := -3;
  SEED_DATA_STAGE                CONSTANT SMALLINT     := 1;
  OPERATION_STAGE                CONSTANT SMALLINT     := 2;
  EXPECTATION_STAGE              CONSTANT SMALLINT     := 3;
  LAST_TEST_STEP_BEFORE_BACKOUT  CONSTANT SMALLINT     := 900;


  -- procedure types
  NORMAL_TEST_PROCEDURE       CONSTANT SMALLINT := 1;
  BACKOUT_SEED_DATA_PROCEDURE CONSTANT SMALLINT := 2;
  BACKOUT_TEST_DATA_PROCEDURE CONSTANT SMALLINT := 3;


  -- application exceptions
  invalid_test_run      CONSTANT NUMBER := -20101;
  invalid_test_run_excp EXCEPTION;
  PRAGMA EXCEPTION_INIT(invalid_test_run_excp, invalid_test_run);

  invalid_functional_area      CONSTANT NUMBER := -20102;
  invalid_functional_area_excp EXCEPTION;
  PRAGMA EXCEPTION_INIT(invalid_functional_area_excp, invalid_functional_area);

  invalid_suite      CONSTANT NUMBER := -20103;
  invalid_suite_excp EXCEPTION;
  PRAGMA EXCEPTION_INIT(invalid_suite_excp, invalid_suite);

  -- operation exceptions
  missing_operation      CONSTANT NUMBER := -20104;
  missing_operation_excp EXCEPTION;
  PRAGMA EXCEPTION_INIT(missing_operation_excp, missing_operation);

  invalid_operation      CONSTANT NUMBER := -20105;
  invalid_operation_excp EXCEPTION;
  PRAGMA EXCEPTION_INIT(invalid_operation_excp, invalid_operation);

  missing_crud_table_name      CONSTANT NUMBER := -20106;
  missing_crud_table_name_excp EXCEPTION;
  PRAGMA EXCEPTION_INIT(missing_crud_table_name_excp, missing_crud_table_name);

  -- insert exceptions
  missing_i_columns      CONSTANT NUMBER := -20107;
  missing_i_columns_excp EXCEPTION;
  PRAGMA EXCEPTION_INIT(missing_i_columns_excp, missing_i_columns);

  missing_i_ref CONSTANT NUMBER := -20108; 
  missing_i_ref_excp EXCEPTION;
  PRAGMA EXCEPTION_INIT(missing_i_ref_excp, missing_i_ref);

  invalid_i_ref CONSTANT NUMBER := -20109; 
  invalid_i_ref_excp EXCEPTION;
  PRAGMA EXCEPTION_INIT(invalid_i_ref_excp, invalid_i_ref);

  -- update exceptions
  missing_u_columns      CONSTANT NUMBER := -20110;
  missing_u_columns_excp EXCEPTION;
  PRAGMA EXCEPTION_INIT(missing_u_columns_excp, missing_u_columns);

  missing_u_ref CONSTANT NUMBER := -20111;
  missing_u_ref_excp EXCEPTION;
  PRAGMA EXCEPTION_INIT(missing_u_ref_excp, missing_u_ref);

  invalid_u_ref CONSTANT NUMBER := -20112;
  invalid_u_ref_excp EXCEPTION;
  PRAGMA EXCEPTION_INIT(invalid_u_ref_excp, invalid_u_ref);

  missing_d_ref CONSTANT NUMBER := -20115;
  missing_d_ref_excp EXCEPTION;
  PRAGMA EXCEPTION_INIT(missing_d_ref_excp, missing_d_ref);

  invalid_d_ref CONSTANT NUMBER := -20116;
  invalid_d_ref_excp EXCEPTION;
  PRAGMA EXCEPTION_INIT(invalid_d_ref_excp, invalid_d_ref);

  -- select exceptions
  missing_s_columns      CONSTANT NUMBER := -20117;
  missing_s_columns_excp EXCEPTION;
  PRAGMA EXCEPTION_INIT(missing_s_columns_excp, missing_s_columns);

  missing_s_ref CONSTANT NUMBER := -20118;
  missing_s_ref_excp EXCEPTION;
  PRAGMA EXCEPTION_INIT(missing_s_ref_excp, missing_s_ref);

  invalid_s_ref CONSTANT NUMBER := -20119;
  invalid_s_ref_excp EXCEPTION;
  PRAGMA EXCEPTION_INIT(invalid_s_ref_excp, invalid_s_ref);

  too_many_s_rows CONSTANT NUMBER := -20121;
  too_many_s_rows_excp EXCEPTION;
  PRAGMA EXCEPTION_INIT(too_many_s_rows_excp, too_many_s_rows);

  -- expectation exceptions
  missing_e_table_name CONSTANT NUMBER := -20151;
  missing_e_table_name_excp EXCEPTION;
  PRAGMA EXCEPTION_INIT(missing_e_table_name_excp,missing_e_table_name);

  missing_e_ref CONSTANT NUMBER := -20153;
  missing_e_ref_excp EXCEPTION;
  PRAGMA EXCEPTION_INIT(missing_e_ref_excp, missing_e_ref);

  invalid_e_ref CONSTANT NUMBER := -20154; 
  invalid_e_ref_excp EXCEPTION;
  PRAGMA EXCEPTION_INIT(invalid_e_ref_excp, invalid_e_ref);

  missing_e_assertions CONSTANT NUMBER := -20155;
  missing_e_assertions_excp EXCEPTION;
  PRAGMA EXCEPTION_INIT(missing_e_assertions_excp, missing_e_assertions);

  missing_e_source CONSTANT NUMBER := -20156;
  missing_e_source_excp EXCEPTION;
  PRAGMA EXCEPTION_INIT(missing_e_source_excp, missing_e_source);

  invalid_e_source CONSTANT NUMBER := -20157;
  invalid_e_source_excp EXCEPTION;
  PRAGMA EXCEPTION_INIT(invalid_e_source_excp, invalid_e_source);

  missing_r_ref CONSTANT NUMBER := -20173; 
  missing_r_ref_excp EXCEPTION;
  PRAGMA EXCEPTION_INIT(missing_r_ref_excp, missing_r_ref);

  invalid_r_ref CONSTANT NUMBER := -20174; 
  invalid_r_ref_excp EXCEPTION;
  PRAGMA EXCEPTION_INIT(invalid_r_ref_excp, invalid_r_ref);

  -- assertion exceptions
  invalid_assertion_column      CONSTANT NUMBER := -20156;
  invalid_assertion_column_excp EXCEPTION;
  PRAGMA EXCEPTION_INIT(invalid_assertion_column_excp, invalid_assertion_column);

  missing_matcher CONSTANT NUMBER := -20162;
  missing_matcher_excp EXCEPTION;
  PRAGMA EXCEPTION_INIT(missing_matcher_excp, missing_matcher);

  invalid_matcher CONSTANT NUMBER := -20158;
  invalid_matcher_excp EXCEPTION;
  PRAGMA EXCEPTION_INIT(invalid_matcher_excp, invalid_matcher);

  missing_matcher_value CONSTANT NUMBER := -20159;
  missing_matcher_value_excp EXCEPTION;
  PRAGMA EXCEPTION_INIT(missing_matcher_value_excp, missing_matcher_value);

  invalid_data_type      CONSTANT NUMBER := -20160;
  invalid_data_type_excp EXCEPTION;
  PRAGMA EXCEPTION_INIT(invalid_data_type_excp, invalid_data_type);

  invalid_a_ref CONSTANT NUMBER := -20161;  
  invalid_a_ref_excp EXCEPTION;
  PRAGMA EXCEPTION_INIT(invalid_a_ref_excp, invalid_a_ref);

  missing_a_ref CONSTANT NUMBER := -20162; 
  missing_a_ref_excp EXCEPTION;
  PRAGMA EXCEPTION_INIT(missing_a_ref_excp, missing_a_ref);

  invalid_matcher_data_type CONSTANT NUMBER := -20163;  
  invalid_matcher_data_type_excp EXCEPTION;
  PRAGMA EXCEPTION_INIT(invalid_matcher_data_type_excp, invalid_matcher_data_type);

  -- package call exceptions
  missing_package_name CONSTANT NUMBER := -20170;
  missing_package_name_excp EXCEPTION;
  PRAGMA EXCEPTION_INIT(missing_package_name_excp, missing_package_name);

  missing_routine_name CONSTANT NUMBER := -20171;
  missing_routine_name_excp EXCEPTION;
  PRAGMA EXCEPTION_INIT(missing_routine_name_excp, missing_routine_name);

  missing_parameters      CONSTANT NUMBER := -20172;
  missing_parameters_excp EXCEPTION;
  PRAGMA EXCEPTION_INIT(missing_parameters_excp, missing_parameters);

  -- misc exceptions
  uninitialized_collection      CONSTANT NUMBER := -6531;
  uninitialized_collection_excp EXCEPTION;
  PRAGMA EXCEPTION_INIT(uninitialized_collection_excp, uninitialized_collection);

  missing_object CONSTANT NUMBER := -30625;
  missing_object_excp EXCEPTION;
  PRAGMA EXCEPTION_INIT(missing_object_excp, missing_object);    

  expected_seed_data_error CONSTANT NUMBER := -20196;
  expected_seed_data_error_excp EXCEPTION;
  PRAGMA EXCEPTION_INIT(expected_seed_data_error_excp, expected_seed_data_error);

  expected_expectation_error CONSTANT NUMBER := -20197;
  expected_expectation_error_excp EXCEPTION;
  PRAGMA EXCEPTION_INIT(expected_expectation_error_excp, expected_expectation_error);

  expected_operation_error CONSTANT NUMBER := -20198;
  expected_operation_error_excp EXCEPTION;
  PRAGMA EXCEPTION_INIT(expected_operation_error_excp, expected_operation_error);

  fatal_test_error CONSTANT NUMBER := -20199;
  fatal_test_error_excp EXCEPTION;
  PRAGMA EXCEPTION_INIT(fatal_test_error_excp, fatal_test_error);  

  suite_failed_compilation      CONSTANT NUMBER := -20300;
  suite_failed_compilation_excp EXCEPTION;
  PRAGMA EXCEPTION_INIT(suite_failed_compilation_excp, suite_failed_compilation);

  invalid_seed_data_reference CONSTANT NUMBER := -20301;
  invalid_seed_data_reference_excp EXCEPTION;
  PRAGMA EXCEPTION_INIT(invalid_seed_data_reference_excp, invalid_seed_data_reference);

  missing_seed_data_backout CONSTANT NUMBER := -20302;
  missing_seed_data_backout_excp EXCEPTION;
  PRAGMA EXCEPTION_INIT(missing_seed_data_backout_excp, missing_seed_data_backout);

  temp_seed_data CONSTANT NUMBER := -20307;
  temp_seed_data_excp EXCEPTION;
  PRAGMA EXCEPTION_INIT(temp_seed_data_excp, temp_seed_data);

  fatal_seed_data CONSTANT NUMBER := -20304;
  fatal_seed_data_excp EXCEPTION;
  PRAGMA EXCEPTION_INIT(fatal_seed_data_excp, fatal_seed_data);

  -- forward declarations for mutually recursive routines
  PROCEDURE flatten_json_object(p_key IN VARCHAR2, p_object IN JSON_OBJECT_T);
  PROCEDURE flatten_json_array(p_key IN VARCHAR2, p_array IN JSON_ARRAY_T);




-- =============================================================================
--
--                          Logging
--
-- =============================================================================




-- =============================================================================
-- Name: get_returned_json_value
-- =============================
--
-- Summary
-- =======
-- Values retrieved from the DB by the framework have the form:
-- name:{'data_type':dbms_types.TYPECODE_VARCHAR2, 'data_value':value}
--
-- This routine retrieves the value for logging purposes
--
-- Parameters
-- ==========
-- p_obj : JSON object representing value details
-- =============================================================================
FUNCTION get_returned_json_value( p_obj IN JSON_OBJECT_T ) RETURN CLOB
IS
  l_data_type SMALLINT;
  l_string    VARCHAR2(4000);
  l_value     CLOB;
  l_boolean   BOOLEAN;
BEGIN
  IF p_obj.get('data_value').is_Null() THEN
    RETURN 'null';
  END IF;

  l_data_type := p_obj.get_Number('data_type');
  CASE
    -- Process strings
    WHEN l_data_type IN ( dbms_types.TYPECODE_VARCHAR2, 
                          dbms_types.TYPECODE_VARCHAR, 
                          dbms_types.TYPECODE_CHAR )
    THEN
      l_value := '"' || p_obj.get_String('data_value') || '"';

    -- Process numbers
    WHEN l_data_type = dbms_types.TYPECODE_NUMBER
    THEN
      l_value := to_char( p_obj.get_Number('data_value') );

    -- Process dates
    WHEN l_data_type = dbms_types.TYPECODE_DATE
    THEN
      l_value := '"' || to_char(p_obj.get_Date('data_value'),DATE_FORMAT) || '"';

    -- Process booleans
    WHEN l_data_type = DBMS_TYPES_BOOLEAN
    THEN
      IF p_obj.get_Boolean('data_value') THEN
        l_value := 'true';
      ELSE
        l_value := 'false';
      END IF;

    -- Process clobs
    WHEN l_data_type = dbms_types.TYPECODE_CLOB THEN
      l_value := '"' || p_obj.get_Clob('data_value') || '"';
    ELSE
      -- unsupported data type 
      RAISE_APPLICATION_ERROR(invalid_data_type, 'Data type not supported: ' || l_data_type); 
  END CASE;

  RETURN l_value;
END get_returned_json_value;


-- =============================================================================
-- Name: get_defined_json_value
-- =============================
--
-- Summary
-- =======
-- Retrieves the value of user supplied JSON for logging purposes
--
-- Parameters
-- ==========
-- p_obj : JSON object
-- p_key : JSON key
-- =============================================================================
FUNCTION get_defined_json_value( p_obj IN JSON_OBJECT_T, p_key IN VARCHAR2 ) RETURN VARCHAR2
IS
  l_element             JSON_ELEMENT_T;
  l_value VARCHAR2(4000);
BEGIN
  l_element := p_obj.get(p_key);
  IF l_element.is_Null() THEN
    l_value := 'null';
  ELSIF l_element.is_String() THEN
    l_value := '"' || p_obj.get_String(p_key) || '"';
  ELSIF l_element.is_Number() THEN
    l_value := p_obj.get_Number(p_key);
  ELSIF l_element.is_True() THEN
    l_value := 'true';
  ELSIF l_element.is_False() THEN
    l_value := 'false';
  END IF;

  RETURN l_value;
END get_defined_json_value;


-- =============================================================================
-- Name: log
-- =========
--
-- Summary
-- =======
-- If global variable v_debug_log = 'DBMS' then logs to STDOUT
-- If global variable v_debug_log = 'TRACE' then logs to TRACE_LOGS
--
-- Parameters
-- ==========
-- p_message : the message to be logged
-- =============================================================================
PROCEDURE log(p_message IN CLOB)
IS
  l_length  INTEGER;
  l_start   INTEGER := 1;
  l_recsize CONSTANT INTEGER := 4000;
BEGIN

  IF v_debug_log = 'DBMS' THEN
    dbms_output.put_line(p_message);
  ELSE
    IF v_debug_log = 'TRACE' THEN    
      l_length   := DBMS_LOB.getlength (p_message);
      WHILE l_start <= l_length
      LOOP
        p73_insert_trace( DBMS_LOB.SUBSTR(p_message, l_recsize, l_start) );
        l_start   := l_start + l_recsize;
      END LOOP;
    END IF;
  END IF;

EXCEPTION
   WHEN OTHERS THEN
     --A failure to write output logs should not affect the main transaction
     dbms_output.put_line('****ERROR in log: '|| SUBSTR(SQLERRM,1,200));
END;


-- =============================================================================
-- Name: log_call_routine
-- ======================
--
-- Summary
-- =======
-- Logs the details of a routine call
--
-- =============================================================================
PROCEDURE log_call_routine( p_package_name IN VARCHAR2,
                            p_routine_name IN VARCHAR2,
                            p_parameters   IN JSON_OBJECT_T )
IS
  l_param_names JSON_KEY_LIST;
  l_param_name  VARCHAR2(200);
  l_log_msg     VARCHAR2(4000);
BEGIN
  IF p_parameters IS NULL THEN
    l_log_msg := 'Calling ' || p_package_name || '.' || p_routine_name || ' with no parameters';
  ELSE
    l_log_msg := 'Calling ' || p_package_name || '.' || p_routine_name || ' with the following parameters - ' || chr(10);

    l_param_names := p_parameters.get_keys;
    FOR i IN 1..l_param_names.COUNT() 
    LOOP
      l_param_name := l_param_names(i);
      l_log_msg := l_log_msg || l_param_name || ':' || get_defined_json_value(p_parameters, l_param_name) || ', ';
    END LOOP;
    l_log_msg := substr(l_log_msg,1, instr(l_log_msg, ', ', -1)-1);
    log( l_log_msg );
  END IF;
END log_call_routine;


-- =============================================================================
-- Name: log_call_routine_results
-- ==============================
--
-- Summary
-- =======
-- Logs the results of a routine call
--
-- =============================================================================
PROCEDURE log_call_routine_results( p_results IN JSON_OBJECT_T )
IS
  l_param_names     JSON_KEY_LIST;
  l_param_name      VARCHAR2(200);
  l_param_details   JSON_OBJECT_T;
  l_log_msg         CLOB;
BEGIN
  IF p_results IS NULL THEN
    log('No results from calling routine');
  ELSE
    l_log_msg := 'Results from calling routine - ';

    l_param_names := p_results.get_keys;
    FOR i IN 1..l_param_names.COUNT() 
    LOOP
      l_param_name := l_param_names(i);
      l_param_details := p_results.get_Object(l_param_name);
      l_log_msg := l_log_msg || l_param_name || ':' || get_returned_json_value(l_param_details) || ', ';
    END LOOP;
    l_log_msg := substr(l_log_msg,1, instr(l_log_msg, ', ', -1)-1);
    log( l_log_msg );
  END IF;
END log_call_routine_results;


-- =============================================================================
-- Name: log_insert_row
-- ====================
--
-- Summary
-- =======
-- Logs the details of an Insert
--
-- =============================================================================
PROCEDURE log_insert_row( p_table_name IN VARCHAR2,
                          p_columns    IN JSON_OBJECT_T )
IS
  l_column_names JSON_KEY_LIST;
  l_column_name  VARCHAR2(200);
  l_log_msg      VARCHAR2(4000);
BEGIN
  l_log_msg := 'INSERTING ';

  l_column_names := p_columns.get_keys;
  FOR i IN 1..l_column_names.COUNT() 
  LOOP
    l_column_name := l_column_names(i);
    l_log_msg := l_log_msg || l_column_name || ':' || get_defined_json_value(p_columns, l_column_name) || ', ';
  END LOOP;
  l_log_msg := substr(l_log_msg,1, instr(l_log_msg, ', ', -1)-1);
  l_log_msg := l_log_msg || ' INTO ' || p_table_name;
  log(l_log_msg);
END log_insert_row;


-- =============================================================================
-- Name: log_insert_row_results
-- ============================
--
-- Summary
-- =======
-- Logs the results of an Insert
--
-- =============================================================================
PROCEDURE log_insert_row_results( p_table_name IN VARCHAR2,
                                  p_ari        IN JSON_OBJECT_T )
IS
BEGIN

  IF p_ari IS NOT NULL THEN
    log('Generated appn_row_id: ' || p_ari.get_Number('data_value'));
  ELSE
    log('No appn_row_id generated for the ' || p_table_name || ' table');
  END IF;

END log_insert_row_results;


-- =============================================================================
-- Name: log_delete_row
-- ====================
--
-- Summary
-- =======
-- Logs the details of a Delete
--
-- =============================================================================
PROCEDURE log_delete_row( p_table_name IN VARCHAR2,
                          p_where      IN JSON_OBJECT_T )
IS
  l_where_names JSON_KEY_LIST;
  l_where_name  VARCHAR2(200);
  l_where_value VARCHAR2(500);
  l_log_msg     VARCHAR2(4000);
BEGIN

  IF p_where IS NOT NULL 
  THEN
    l_log_msg := 'DELETING FROM ' || p_table_name || ' WHERE ';
    l_where_names := p_where.get_keys;
    FOR i IN 1..l_where_names.COUNT() 
    LOOP
      l_where_name := l_where_names(i);
      l_log_msg := l_log_msg || l_where_name || ':' || get_defined_json_value(p_where, l_where_name) || ' AND ';
    END LOOP;
    l_log_msg := substr(l_log_msg,1, instr(l_log_msg, ' AND ', -1)-1);
    log( l_log_msg );
  ELSE
    log('DELETING all rows FROM ' || p_table_name);
  END IF;
END log_delete_row;


-- =============================================================================
-- Name: log_delete_row_results
-- ============================
--
-- Summary
-- =======
-- Logs the results of a Delete
--
-- =============================================================================
PROCEDURE log_delete_row_results( p_rows_deleted IN INTEGER )
IS
BEGIN
  log(p_rows_deleted || ' rows deleted');
END log_delete_row_results;


-- =============================================================================
-- Name: log_update_row
-- ====================
--
-- Summary
-- =======
-- Logs the details of an Update
--
-- =============================================================================
PROCEDURE log_update_row( p_table_name IN VARCHAR2,
                          p_columns    IN JSON_OBJECT_T,
                          p_where      IN JSON_OBJECT_T )
IS
  l_column_names JSON_KEY_LIST;
  l_column_name  VARCHAR2(200);
  l_column_value VARCHAR2(500);
  l_where_names  JSON_KEY_LIST;
  l_where_name   VARCHAR2(200);
  l_where_value  VARCHAR2(500);
  l_log_msg      VARCHAR2(4000);
BEGIN
  l_log_msg := 'UPDATING ' || p_table_name || ' with the following values - ';

  l_column_names := p_columns.get_keys;
  FOR i IN 1..l_column_names.COUNT() 
  LOOP
    l_column_name := l_column_names(i);
    l_column_value := p_columns.get_String(l_column_name);
    l_log_msg := l_log_msg || l_column_name || ':' || get_defined_json_value(p_columns, l_column_name) || ', ';
  END LOOP;

  IF p_where IS NOT NULL THEN
    l_log_msg := l_log_msg || ' WHERE ';

    l_where_names := p_where.get_keys;
    FOR i IN 1..l_where_names.COUNT() 
    LOOP
      l_where_name := l_where_names(i);
      l_log_msg := l_log_msg || l_where_name || '=' || get_defined_json_value(p_where, l_where_name) || ' AND ';
    END LOOP;
    l_log_msg := substr(l_log_msg,1, instr(l_log_msg, ' AND ', -1)-1);
  END IF;
  log( l_log_msg );

END log_update_row;


-- =============================================================================
-- Name: log_update_row_results
-- ============================
--
-- Summary
-- =======
-- Logs the results of an Update
--
-- =============================================================================
PROCEDURE log_update_row_results( p_rows_updated IN INTEGER )
IS
BEGIN
  log(p_rows_updated || ' rows updated');
END log_update_row_results;


-- =============================================================================
-- Name: log_select_row
-- ====================
--
-- Summary
-- =======
-- Logs the details of a Select
--
-- =============================================================================
PROCEDURE log_select_row( p_table_name IN VARCHAR2,
                          p_columns    IN JSON_ARRAY_T,
                          p_where      IN JSON_OBJECT_T )
IS
  l_where_names JSON_KEY_LIST;
  l_where_name  VARCHAR2(200);
  l_where_value VARCHAR2(500);
  l_columns     VARCHAR2(500) := NULL;
  l_log_msg     VARCHAR2(4000);
BEGIN
  FOR i IN 0..p_columns.get_size()-1 LOOP
    l_columns := l_columns || p_columns.get_String(i) || ', ';
  END LOOP;

  IF p_where IS NULL THEN
    log('SELECTING ' || substr(l_columns,1, instr(l_columns, ', ', -1)-1) || ' FROM ' || p_table_name);
  ELSE
    l_log_msg := 'SELECTING ' || substr(l_columns,1, instr(l_columns, ', ', -1)-1) || ' FROM ' || p_table_name || ' WHERE ';
    l_where_names := p_where.get_keys;
    FOR i IN 1..l_where_names.COUNT() 
    LOOP
      l_where_name := l_where_names(i);
      l_log_msg := l_log_msg || l_where_name || '=' || get_defined_json_value(p_where, l_where_name) || ' AND ';
    END LOOP;
    l_log_msg := substr(l_log_msg,1, instr(l_log_msg, ' AND ', -1)-1);
    log( l_log_msg );
  END IF;

END log_select_row;


-- =============================================================================
-- Name: log_select_row_results
-- ============================
--
-- Summary
-- =======
-- Logs the results of a Select
--
-- =============================================================================
PROCEDURE log_select_row_results( p_results IN JSON_ARRAY_T, p_rows_selected IN INTEGER )
IS
  l_row          JSON_OBJECT_T;
  l_column       JSON_OBJECT_T;
  l_column_names JSON_KEY_LIST;
  l_column_name  VARCHAR2(200);
  l_column_value VARCHAR2(200);
  l_log_msg      VARCHAR2(4000);
BEGIN
  log( p_rows_selected || ' rows selected');
  -- iterate over each row
  FOR i IN 0..p_results.get_size()-1 
  LOOP
    l_log_msg := 'Row ' || (i+1) || ' - ';
    l_row := treat(p_results.get(i) AS JSON_OBJECT_T);

    l_column_names := l_row.get_keys;
    FOR i IN 1..l_column_names.COUNT() 
    LOOP
      l_column_name := l_column_names(i);
      l_column := l_row.get_Object(l_column_name);
      l_log_msg := l_log_msg || l_column_name || ':' || get_returned_json_value(l_column) || ', ';
    END LOOP;
    l_log_msg := substr(l_log_msg,1, instr(l_log_msg, ', ', -1)-1);
    log( l_log_msg );
  END LOOP;

END log_select_row_results;


-- =============================================================================
-- Name: update_test_status
-- ========================
--
-- Summary
-- =======
-- This routine updates the server_test_run_statuses entry for the currently executed 
-- test step within an autonomous transaction
--
-- Parameters
-- ==========
-- p_test_status       : COMPLETED or FAIL
-- p_exception_code    : The exception code responsible for the FAIL status
-- p_exception_message : The exception message associated with p_exception_code
-- p_compilation_excp  : Flags the special case when a dynamically generated suite 
--                       package fails compilation.
--
-- =============================================================================
PROCEDURE update_test_status(p_test_status       IN server_test_run_statuses.test_status%TYPE,
                             p_exception_code    IN server_test_run_statuses.exception_code%TYPE,
                             p_exception_message IN server_test_run_statuses.exception_message%TYPE,
                             p_compilation_excp  IN BOOLEAN DEFAULT FALSE)
IS
  PRAGMA AUTONOMOUS_TRANSACTION;
BEGIN

  IF p_compilation_excp
  THEN

    INSERT INTO server_test_run_statuses VALUES
    (server_test_run_statuses_seq.nextval, g_current_functional_area, g_current_test_suite, -1, -1,
     'FAILED', p_exception_code, SUBSTR(p_exception_message,1,4000));

  ELSE

    INSERT INTO server_test_run_statuses VALUES
    (server_test_run_statuses_seq.nextval, g_current_functional_area, g_current_test_suite, g_current_test_number, g_current_test_step.test_step,
     p_test_status, p_exception_code, SUBSTR(p_exception_message,1,4000));

  END IF;

  COMMIT;

END update_test_status;




-- =============================================================================
--
--                          Exception Handling
--
-- =============================================================================




-- =============================================================================
-- Name: is_exception_expected
-- ===========================
--
-- Summary
-- =======
-- Determines if an encountered exception is expected
-- This will be the case if we are actually testing for this exception
-- As such, an appropriate assertion should be present within the 
-- defined expectations for the current test step
--
-- Parameters
-- ==========
-- p_exception_code     : The code of the raised exception
-- p_exception_expected : Output parameter set to TRUE or FALSE
--
-- =============================================================================
PROCEDURE is_exception_expected(p_exception_code      IN  server_test_run_statuses.exception_code%TYPE,
                                p_exception_msg       IN  server_test_run_statuses.exception_message%TYPE,
                                p_exception_expected  OUT BOOLEAN)
IS
  l_source            VARCHAR2(9);
  l_exception_message VARCHAR2(500);
  l_expectations      JSON_ARRAY_T;
  l_expectation       JSON_OBJECT_T;
  l_assertion         JSON_OBJECT_T;

BEGIN
  -- assume initially the exception is unexpected
  p_exception_expected := FALSE;

  IF g_current_test_step.expectations IS NOT NULL THEN

    -- retrieve the defined expectations and search for an assertion testing for this exception
    l_expectations := JSON_ARRAY_T.parse(g_current_test_step.expectations);

    -- examine each expectation in turn
    FOR i IN 0..l_expectations.get_size()-1 
    LOOP

      -- ignore the expectation that raised the original exception if this is the case
      IF i = g_expectation_index THEN
        CONTINUE;
      END IF;

      l_expectation := treat(l_expectations.get(i) AS JSON_OBJECT_T);

      -- this search still requires the validation of the defined expectations
      -- abort if expectation fails validation

      -- retrieve and validate source
      l_source := l_expectation.get_String('source');  
      IF l_source IS NULL THEN
        l_exception_message := 'Unspecified or misspelled source key for expectation';
        RAISE_APPLICATION_ERROR(missing_e_source, l_exception_message); -- careful - recursion!
      END IF;

      IF l_source = 'framework' THEN

        -- retrieve and validate assertions
        IF NOT l_expectation.has('assertions') THEN
          l_exception_message := 'Missing assertions in expectation';
          RAISE_APPLICATION_ERROR(missing_e_assertions, l_exception_message);  -- careful - recursion!
        END IF;

        IF l_expectation.get_Object('assertions').has('step' || g_current_test_step.test_step || '.exception_code') 
        THEN
          -- an assertion is present - checking for an exception from this current test step
          l_assertion := l_expectation.get_Object('assertions').get_Object('step' || g_current_test_step.test_step || '.exception_code');

          -- validate the utPLSQL matcher
          IF NOT l_assertion.has('matcher') THEN
            l_exception_message := 'utPLSQL matcher not specified in assertion';
            RAISE_APPLICATION_ERROR(missing_matcher, l_exception_message);
          END IF;
          
          IF l_assertion.get_String('matcher') = '=' THEN

            IF NOT l_assertion.has('value') THEN
              l_exception_message := 'utPLSQL matcher has no expected value';
              RAISE_APPLICATION_ERROR(missing_matcher_value, l_exception_message);
            END IF;

            IF l_assertion.get_Type('value') != 'OBJECT' THEN

              IF l_assertion.get_Number('value') = p_exception_code THEN
                -- the raised exception has the same code as that expected
                l_assertion := l_expectation.get_Object('assertions').get_Object('step' || g_current_test_step.test_step || '.exception_msg');

                IF l_expectation.get_Object('assertions').has('step' || g_current_test_step.test_step || '.exception_msg') THEN
                  -- message raised must match expected message

                  -- validate the utPLSQL matcher
                  IF NOT l_assertion.has('matcher') THEN
                    l_exception_message := 'utPLSQL matcher not specified in assertion';
                    RAISE_APPLICATION_ERROR(missing_matcher, l_exception_message);
                  END IF;

                  IF l_assertion.get_String('matcher') != 'like' THEN
                    l_exception_message := 'Invalid utPLSQL matcher specified in assertion'; 
                    RAISE_APPLICATION_ERROR(invalid_matcher, l_exception_message);
                  END IF;

                  IF NOT l_assertion.has('value') THEN
                    l_exception_message := 'utPLSQL matcher has no expected value';
                    RAISE_APPLICATION_ERROR(missing_matcher_value, l_exception_message);
                  END IF;

                  IF l_assertion.get_Type('value') != 'OBJECT' THEN
                    IF p_exception_msg LIKE l_assertion.get_String('value') THEN
                      p_exception_expected := TRUE;
                    END IF;
                  END IF;

                ELSE
                  p_exception_expected := TRUE;
                END IF;

                EXIT;
              END IF;
            END IF;
          END IF;
        END IF;
      END IF;
    END LOOP;
  END IF;
END is_exception_expected;


-- =============================================================================
-- Name: handle_exception
-- ======================
--
-- Summary
-- =======
-- Processes any raised exceptions. There are 2 main scenarios:
--
-- Scenario 1 : Exception not expected
--              This is the typical, standard scenario
--              We just need to cleanup and end the current test number (transaction)
--              and then move onto the next test number (transaction)
--              - update server_test_run_statuses with a status of FAILED
--              - raise fatal_test_error exception which ensures:
--                - the expectations for this step are not executed (exception may have come from here)
--                - further steps for this test number (transaction) are ignored
--                - the transaction is rolled back
--                - we move onto the next test
--
-- Scenario 2 : An exception that we are actually testing for.
--              We will know this by the presence of an appropriate assertion
--              for the current test step
--              If exception expected
--              - If in operation phase of test step then abort and begin processing
--                the defined expectations 
--              - If in expectation phase of test step then abort and move onto 
--                the next expectation
-- Parameters
-- ==========
-- p_exception_code   : The code of the raised exception
-- p_exception_msg    : Associated exception message
-- p_raise_excp       : Determines if fatal exception should be raised
-- p_compilation_excp : Flags the special case when a dynamically generated suite 
--                      package fails compilation.
--
-- =============================================================================
PROCEDURE handle_exception(p_exception_code   IN server_test_run_statuses.exception_code%TYPE,
                           p_exception_msg    IN server_test_run_statuses.exception_message%TYPE,
                           p_raise_excp       IN BOOLEAN DEFAULT TRUE,
                           p_compilation_excp IN BOOLEAN DEFAULT FALSE)
IS
  l_exception_expected BOOLEAN;
  l_output             JSON_OBJECT_T;
  l_exception_msg      VARCHAR2(1000);
  l_assertion_string   VARCHAR2(2000);

BEGIN

  IF p_compilation_excp THEN
    log(p_exception_code || ' - ' || p_exception_msg);
    update_test_status('FAILED', p_exception_code, p_exception_msg, TRUE);
    -- move on to the next functional area test suite
    RETURN;
  END IF;

  -- populate g_framework_values with exception code
  l_output := new JSON_OBJECT_T;
  l_output.put('data_type', dbms_types.TYPECODE_NUMBER);
  l_output.put('data_value',p_exception_code);
  g_framework_values.put('step' || g_current_test_step.test_step || '.exception_code', l_output );

  -- populate g_framework_values with exception message
  l_output := new JSON_OBJECT_T;
  l_output.put('data_type', dbms_types.TYPECODE_VARCHAR2);
  l_output.put('data_value',p_exception_msg);
  g_framework_values.put('step' || g_current_test_step.test_step || '.exception_msg', l_output );

  BEGIN
    is_exception_expected(p_exception_code, p_exception_msg, l_exception_expected);
  EXCEPTION
    WHEN missing_e_source_excp OR
         missing_e_assertions_excp OR
         missing_matcher_excp OR
         missing_matcher_value_excp
    THEN
      -- If here then we have a malformed expectation
      -- do nothing. this malformed expectation will be encountered after the
      -- current exception has been reported and corrected
      null;
  END;

  IF l_exception_expected  -- not a problem - continue processing
  THEN
    log('Successfully caught expected exception');
    CASE g_test_stage

      WHEN SEED_DATA_STAGE THEN
        -- exit and move onto expectations (bypassing operation)
        RAISE_APPLICATION_ERROR(expected_seed_data_error, 'SEED DATA ERROR - but expected');

      WHEN OPERATION_STAGE THEN
        -- exit and move onto expectations
        RAISE_APPLICATION_ERROR(expected_operation_error, 'OPERATION ERROR - but expected');

      WHEN EXPECTATION_STAGE THEN
        -- move on to the next expectation
        RAISE_APPLICATION_ERROR(expected_expectation_error, 'EXPECTATION ERROR - but expected');

    END CASE;

  ELSE
    -- unanticipated exception
    log('UNANTICIPATED EXCEPTION RAISED!!! - ' || p_exception_code || ': ' || p_exception_msg);
    update_test_status('FAILED', p_exception_code, p_exception_msg);

    -- create assertion to highlight test failure
    l_exception_msg := g_current_functional_area || ' : ' || 'Suite ' || g_current_test_suite || ' : ' ||
                       'Test ' || g_current_test_number || ' : ' || 'Step ' || g_current_test_step.test_step || ' : ' ||
                       p_exception_msg;

    l_assertion_string := 'ut.expect(' || '''' || p_exception_code || ':' || p_exception_msg || '''' || ',' || '''' || l_exception_msg || '''' || ')' ||
                          '.to_equal(' || '''' || 'Success' || '''' || ');' || CHR(10);
    dbms_lob.writeappend(g_package_body, length(l_assertion_string), l_assertion_string);

    IF g_current_functional_area = 'BACKOUT'
    THEN
      log('*** IMPORTANT - FIX ASAP!!! The backout script has failed and so unwanted data may still reside in the DB. As such, all subsequent test cases may be compromised!');
      update_test_status('FAILED', -1, '*** IMPORTANT - FIX ASAP!!! The backout script has failed and so unwanted data may still reside in the DB. As such, all subsequent test cases may be compromised!');
    END IF;

    IF p_raise_excp = TRUE THEN
      log('FATAL TEST ERROR - Test cannot be completed');
      RAISE_APPLICATION_ERROR(fatal_test_error, 'FATAL TEST ERROR - Test cannot be completed');
    END IF;

  END IF;
END handle_exception;




-- =============================================================================
--
--                Dynamically created package handling
--
-- =============================================================================




-- =============================================================================
-- Name: create_pkg
-- ================
--
-- Summary
-- =======
-- A package is created and executed for each specified test suite
-- This routine simply applies the dynamically created package to the database
--
-- =============================================================================
PROCEDURE create_pkg
IS
  PRAGMA AUTONOMOUS_TRANSACTION;
BEGIN

  EXECUTE IMMEDIATE g_package_spec;
  EXECUTE IMMEDIATE g_package_body;

EXCEPTION 
  WHEN OTHERS THEN
    RAISE_APPLICATION_ERROR(suite_failed_compilation, sqlerrm);

END create_pkg;


-- =============================================================================
-- Name: create_pkg_code
-- =====================
--
-- Summary
-- =======
-- Begins the creation of the dynamically created utPLSQL package
-- This package will contain all the procedures for a particular test suite.
-- These procedures will in turn contain all the assertions for a particular test number
--
-- =============================================================================
PROCEDURE create_pkg_code( p_functional_area IN server_tests.functional_area%TYPE,
                           p_test_suite      IN server_tests.test_suite%TYPE )
IS
  l_package_description server_tests.test_suite_desc%TYPE;
  l_package_declaration VARCHAR2(200);
BEGIN
  -- determine suite description for reporting purposes
  SELECT test_suite_desc
    INTO l_package_description
    FROM server_tests
   WHERE functional_area = g_current_functional_area
     AND test_suite = g_current_test_suite
     and rownum = 1;

  g_current_package_name := 'AST_' || p_functional_area || '_Suite' || p_test_suite;

  g_package_spec := 'CREATE OR REPLACE PACKAGE ' || g_current_package_name || ' IS' || chr(10) ||
                    '--%suite(' || p_functional_area || ' - suite:' || p_test_suite || ' - ' || l_package_description  || ')' || chr(10) || chr(10);

  l_package_declaration := g_current_package_name || ' IS' || chr(10);
  g_package_body := 'CREATE OR REPLACE PACKAGE BODY ';
  dbms_lob.writeappend(g_package_body, length(l_package_declaration), l_package_declaration);

END create_pkg_code;


-- =============================================================================
-- Name: add_procedure_to_pkg
-- ==========================
--
-- Summary
-- =======
-- Begins the addition of a procedure to the dynamically created utPLSQL package
-- This procedure will contain all the assertions for a particular test number
--
-- =============================================================================
PROCEDURE add_procedure_to_pkg( p_procedure_type        IN SMALLINT,
                                p_main_test_number      IN SMALLINT DEFAULT NULL,
                                p_seed_data_backout_key IN VARCHAR2 DEFAULT NULL )
IS
  l_procedure_name        VARCHAR2(128);
  l_procedure_description server_tests.test_number_desc%TYPE := NULL;
  l_procedure_declaration VARCHAR2(200);
  l_backout_key           VARCHAR2(10);
BEGIN
  -- replace . with _ in key
  l_backout_key := p_seed_data_backout_key;
  select REPLACE(l_backout_key,'.','_') into l_backout_key from dual;

  -- structure of procedure names is dependant on context
  CASE p_procedure_type

    WHEN NORMAL_TEST_PROCEDURE THEN
      l_procedure_name := 'test_' || g_current_test_number;

      SELECT test_number_desc
        INTO l_procedure_description
        FROM server_tests
       WHERE functional_area = g_current_functional_area
         AND test_suite = g_current_test_suite
         AND test_number = g_current_test_number
         AND ROWNUM = 1;

    WHEN BACKOUT_SEED_DATA_PROCEDURE THEN
      l_procedure_name := 'test_' || p_main_test_number || '_backout_SEED_DATA_' || l_backout_key;

    WHEN BACKOUT_TEST_DATA_PROCEDURE THEN
      l_procedure_name := 'test_' || g_current_test_number || '_backout_TEST_DATA';

  END CASE;

  g_package_spec := g_package_spec ||
                    '--%test(Test number: ' || l_procedure_name || ' : ' || l_procedure_description || ')' || chr(10) ||
                    'PROCEDURE ' || l_procedure_name || ';' || chr(10);

  l_procedure_declaration := 'PROCEDURE ' || l_procedure_name || ' IS BEGIN' || chr(10);
  dbms_lob.writeappend(g_package_body, length(l_procedure_declaration), l_procedure_declaration);

END add_procedure_to_pkg;


-- =============================================================================
-- Name: finalise_pkg_code
-- =======================
--
-- Summary
-- =======
-- Ensures a package procedure is ended correctly
--
-- =============================================================================
PROCEDURE finalise_pkg_code
IS
  l_finalise VARCHAR2(20);
BEGIN
  g_package_spec := g_package_spec || chr(10) || 'END;';
  l_finalise := chr(10) || 'BEGIN NULL; END;';
  dbms_lob.writeappend(g_package_body, length(l_finalise), l_finalise); 

  --log(DIAG, null, HIGH_DETAIL, g_package_body);
END finalise_pkg_code;


-- =============================================================================
-- Name: finalise_proc_code
-- ========================
--
-- Summary
-- =======
-- Ensures a package procedure is ended correctly
--
-- =============================================================================
PROCEDURE finalise_proc_code
IS
  l_finalise VARCHAR2(20);
BEGIN
  l_finalise := 'NULL; END;' || chr(10);
  dbms_lob.writeappend(g_package_body, length(l_finalise), l_finalise);
END finalise_proc_code;


-- =============================================================================
-- Name: invoke_test_pkg
-- =====================
--
-- Summary
-- =======
-- Execute the dynamically created package to evaluate all the assertions for a test suite
--
-- =============================================================================
PROCEDURE invoke_test_pkg
IS
BEGIN
  EXECUTE IMMEDIATE 'BEGIN ut.run(' || '''' || g_current_package_name || '''' || '); END;';
END invoke_test_pkg;




-- =============================================================================
--
--                          CLOB Result Processing
--
-- =============================================================================




-- =============================================================================
-- Name: store_json_scalar
-- =======================
--
-- Summary
-- =======
-- This routine stores a scalar value with a fully qualified key based on a flattened JSON structure
--
-- Parameters
-- ==========
-- p_fully_qualified_key : the fully qualified key generated up to this point
-- p_string              : String value
-- p_number              : Number value
-- p_boolean             : Boolean value
-- p_null                : NULL value
-- =============================================================================
PROCEDURE store_json_scalar( p_fully_qualified_key IN VARCHAR2,
                             p_string              IN VARCHAR2 DEFAULT NULL,
                             p_number              IN VARCHAR2 DEFAULT NULL,
                             p_boolean             IN BOOLEAN  DEFAULT NULL,
                             p_null                IN BOOLEAN  DEFAULT FALSE )
IS
  l_scalar_result JSON_OBJECT_T;

BEGIN
  l_scalar_result := new JSON_OBJECT_T;

  IF p_string IS NOT NULL THEN
    l_scalar_result.put('data_type', dbms_types.TYPECODE_VARCHAR2);
    l_scalar_result.put('data_value', p_string);

  ELSIF p_number IS NOT NULL THEN
    l_scalar_result.put('data_type', dbms_types.TYPECODE_NUMBER);
    l_scalar_result.put('data_value', p_number);

  ELSIF p_boolean IS NOT NULL THEN
    l_scalar_result.put('data_type', DBMS_TYPES_BOOLEAN);
    l_scalar_result.put('data_value', p_boolean);

  ELSIF p_null = TRUE THEN
    l_scalar_result.put('data_type', DBMS_TYPES_NULL_JSON);
    l_scalar_result.put_Null('data_value');

  END IF;

  g_framework_values.put(p_fully_qualified_key, l_scalar_result);
END;


-- =============================================================================
-- Name: flatten_json_object
-- =========================
--
-- Summary
-- =======
-- This routine 'flattens' a JSON object.
-- This means that every scalar value can be identified by a single composite key
--
-- Parameters
-- ==========
-- p_key    : the fully qualified key generated up to this point
-- p_object : the JSON array
-- =============================================================================
PROCEDURE flatten_json_object(p_key IN VARCHAR2, p_object IN JSON_OBJECT_T)
IS
  l_object_keys         JSON_KEY_LIST;
  l_object_key          VARCHAR2(1000);
  l_element             JSON_ELEMENT_T;
  l_fully_qualified_key VARCHAR2(1000);
  l_result              JSON_OBJECT_T;

BEGIN
  -- get object keys
  l_object_keys := p_object.get_keys;

  IF l_object_keys IS NULL THEN
    -- create entry to allow null/not null assertions against an object as a whole
    l_result := new JSON_OBJECT_T;
    l_result.put('data_type', DBMS_TYPES_JSON_OBJECT);
    l_result.put_Null('data_value');
    g_framework_values.put(p_key, l_result);

  ELSE
    -- create entry to allow null/not null assertions against an object as a whole
    l_result := new JSON_OBJECT_T;
    l_result.put('data_type', DBMS_TYPES_JSON_OBJECT);
    l_result.put('data_value', 'Not NULL');
    g_framework_values.put(p_key, l_result);

    -- process each object key in turn
    FOR i IN 1..l_object_keys.COUNT()
    LOOP
      l_object_key          := l_object_keys(i);
      l_fully_qualified_key := p_key || '.' || l_object_key;
      l_element             := p_object.get(l_object_key);

      IF l_element.is_Object() THEN
        flatten_json_object(l_fully_qualified_key, treat(l_element AS JSON_OBJECT_T));

      ELSIF l_element.is_Array() THEN
        flatten_json_array(l_fully_qualified_key, treat(l_element AS JSON_ARRAY_T));

      ELSIF l_element.is_String() THEN
        store_json_scalar( p_fully_qualified_key => l_fully_qualified_key,
                           p_string              => p_object.get_String(l_object_key) );

      ELSIF l_element.is_Number() THEN
        store_json_scalar( p_fully_qualified_key => l_fully_qualified_key,
                           p_number              => p_object.get_String(l_object_key) );   

      ELSIF l_element.is_True() THEN
        store_json_scalar( p_fully_qualified_key => l_fully_qualified_key,
                           p_boolean             => TRUE );

      ELSIF l_element.is_False() THEN
        store_json_scalar( p_fully_qualified_key => l_fully_qualified_key,
                           p_boolean             => FALSE );

      ELSIF l_element.is_Null() THEN
        store_json_scalar( p_fully_qualified_key => l_fully_qualified_key,
                           p_null             => TRUE );
      ELSE
        null; --  raise exception
      END IF;
    END LOOP;
  END IF;

END flatten_json_object;


-- =============================================================================
-- Name: flatten_json_array
-- ========================
--
-- Summary
-- =======
-- This routine 'flattens' a JSON array.
-- This means that every scalar value can be identified by a single composite key
--
-- Parameters
-- ==========
-- p_key   : the fully qualified key generated up to this point
-- p_array : the JSON array
-- =============================================================================
PROCEDURE flatten_json_array(p_key IN VARCHAR2, p_array IN JSON_ARRAY_T)
IS
  l_element             JSON_ELEMENT_T;
  l_fully_qualified_key VARCHAR2(1000);
  l_result              JSON_OBJECT_T;

BEGIN
  -- check if array is empty
  IF p_array.get_Size() = 0 THEN
    -- create entry to allow null/not null assertions against array as a whole
    l_result := new JSON_OBJECT_T;
    l_result.put('data_type', DBMS_TYPES_JSON_ARRAY);
    l_result.put_Null('data_value');
    g_framework_values.put(p_key, l_result);

  ELSE
    -- create entry to allow null/not null assertions against an array as a whole
    l_result := new JSON_OBJECT_T;
    l_result.put('data_type', DBMS_TYPES_JSON_ARRAY);
    l_result.put('data_value', 'Not NULL');
    g_framework_values.put(p_key, l_result);

    -- examine each array element in turn
    FOR i IN 0..p_array.get_size()-1
    LOOP
      l_fully_qualified_key := p_key || '[' || i || ']';

      l_element := treat(p_array.get(i) AS JSON_ELEMENT_T);

      IF l_element.is_Object() THEN
        flatten_json_object(l_fully_qualified_key, treat(l_element AS JSON_OBJECT_T));

      ELSIF l_element.is_Array() THEN
        flatten_json_array(l_fully_qualified_key, treat(l_element AS JSON_ARRAY_T));

      ELSIF l_element.is_String() THEN
        store_json_scalar( p_fully_qualified_key => l_fully_qualified_key,
                           p_string              => p_array.get_String(i) );

      ELSIF l_element.is_Number() THEN
        store_json_scalar( p_fully_qualified_key => l_fully_qualified_key,
                           p_number              => p_array.get_Number(i) );

      ELSIF l_element.is_True() THEN
        store_json_scalar( p_fully_qualified_key => l_fully_qualified_key,
                           p_boolean             => TRUE );

      ELSIF l_element.is_False() THEN
        store_json_scalar( p_fully_qualified_key => l_fully_qualified_key,
                           p_boolean             => FALSE );

      ELSIF l_element.is_Null() THEN
        store_json_scalar( p_fully_qualified_key => l_fully_qualified_key,
                           p_null                => TRUE );
      ELSE
        null; --  raise exception
      END IF;

    END LOOP;
  END IF;

END flatten_json_array;


-- =============================================================================
-- Name: process_clob_as_json
-- ==========================
--
-- Summary
-- =======
-- This routine 'flattens' a CLOB that parses to JSON.
-- This means that every scalar value can be identified by a single composite key
-- e.g.
--   p_result     = { "num1":1, arr1[ {"str1":"string1"}, {"str2":"string2"}, [[[{"bool1":true}]]] ]}
--   p_param_name = pOut1
--   - num1  = step[n].pOut1.num1
--   - str1  = step[n].pOut1.arr1[0].str1
--   - bool1 = step[n].pOut1.arr1[2][0][0][0].bool1
--  where n = g_current_test_step.test_step
--
-- Parameters
-- ==========
-- p_param_name : Parameter name
-- p_result     : Output parameter result from a routine call or a function return value
--                that is a CLOB that parses to JSON
--
-- =============================================================================
PROCEDURE process_clob_as_json( p_param_name IN VARCHAR2,
                                p_result     IN JSON_OBJECT_T )
IS
  l_key_root    VARCHAR2(200);
  l_json_object JSON_OBJECT_T;
  l_json_array  JSON_ARRAY_T;

BEGIN
  l_key_root := 'step' || g_current_test_step.test_step || '.' || p_param_name;

  -- attempt to parse CLOB as json object or array
  BEGIN
    l_json_object := JSON_OBJECT_T.parse( p_result.get_Clob('data_value') );
    flatten_json_object( l_key_root, l_json_object );
  EXCEPTION
    WHEN OTHERS THEN
      BEGIN
        l_json_array := JSON_ARRAY_T.parse( p_result.get_Clob('data_value') );
        flatten_json_array( l_key_root, l_json_array );
      EXCEPTION
        WHEN OTHERS THEN
          -- CLOB failed to parse as JSON object or array - treat as non JSON CLOB
          null; -- no assertions on clob yet supported
      END;
  END;
END process_clob_as_json;




-- =============================================================================
--
--                      Framework Value Reference Processing
--
-- =============================================================================




-- =============================================================================
-- Name: validate_reference_object
-- ===============================
--
-- Summary
-- =======
-- This routine is invoked if the JSON specifies an object as opposed to a scalar value
-- A key of 'ref' is expected and the reference value must exist
-- An exception is raised otherwise

-- Parameters
-- ==========
-- p_operation   : the current operation                   
--                 - needed for clear exception reporting
-- p_key         : the key of the value object in question
--                 - needed for clear exception reporting
-- p_ref_object  : the object in question
--
-- =============================================================================
PROCEDURE validate_reference_object(p_operation  IN VARCHAR2,
                                    p_key        IN VARCHAR2,
                                    p_ref_object IN JSON_OBJECT_T)
IS
  l_exception_message VARCHAR2(500);
BEGIN
  -- check that a step output is actually specified
  IF NOT p_ref_object.has('ref') THEN
    CASE p_operation
      WHEN 'S' THEN   
        l_exception_message := 'Missing value reference for ' || p_key || ' in SELECT statement';        
        RAISE_APPLICATION_ERROR(missing_s_ref, l_exception_message);
      WHEN 'I' THEN   
        l_exception_message := 'Missing value reference for ' || p_key || ' in INSERT statement';      
        RAISE_APPLICATION_ERROR(missing_i_ref, l_exception_message);
      WHEN 'U' THEN 
        l_exception_message := 'Missing value reference for ' || p_key || ' in UPDATE statement'; 
        RAISE_APPLICATION_ERROR(missing_u_ref, l_exception_message);
      WHEN 'D' THEN 
        l_exception_message := 'Missing value reference for ' || p_key || ' in DELETE statement'; 
        RAISE_APPLICATION_ERROR(missing_d_ref, l_exception_message);
      WHEN 'E' THEN 
        l_exception_message := 'Missing value reference for ' || p_key || ' in expectation'; 
        RAISE_APPLICATION_ERROR(missing_e_ref, l_exception_message);
      WHEN 'R' THEN 
        l_exception_message := 'Missing value reference for ' || p_key || ' in call routine'; 
        RAISE_APPLICATION_ERROR(missing_r_ref, l_exception_message);
      WHEN 'A' THEN 
        l_exception_message := 'Missing value reference for ' || p_key || ' in assertion'; 
        RAISE_APPLICATION_ERROR(missing_a_ref, l_exception_message);
    END CASE;
  END IF;

  -- check that it exists
  IF NOT g_framework_values.has(p_ref_object.get_String('ref')) THEN
    l_exception_message := 'Value reference specified incorrectly for (' || p_key || '). Check previous test steps have actually generated the required value';
    CASE p_operation
      WHEN 'I' THEN             
        RAISE_APPLICATION_ERROR(invalid_i_ref, l_exception_message); 
      WHEN 'U' THEN 
        RAISE_APPLICATION_ERROR(invalid_u_ref, l_exception_message); 
      WHEN 'D' THEN             
        RAISE_APPLICATION_ERROR(invalid_d_ref, l_exception_message);
      WHEN 'S' THEN 
        RAISE_APPLICATION_ERROR(invalid_s_ref, l_exception_message); 
      WHEN 'E' THEN 
        RAISE_APPLICATION_ERROR(invalid_e_ref, l_exception_message); 
      WHEN 'R' THEN 
        RAISE_APPLICATION_ERROR(invalid_r_ref, l_exception_message);
      WHEN 'A' THEN 
        RAISE_APPLICATION_ERROR(invalid_a_ref, l_exception_message); 
    END CASE; 
  END IF;

EXCEPTION
  WHEN missing_i_ref_excp OR invalid_i_ref_excp OR missing_u_ref_excp OR
       invalid_u_ref_excp OR missing_s_ref_excp OR invalid_s_ref_excp OR
       missing_e_ref_excp OR invalid_e_ref_excp OR missing_d_ref_excp OR
       invalid_d_ref_excp OR missing_r_ref_excp OR invalid_r_ref_excp OR
       missing_a_ref_excp OR invalid_a_ref_excp
  THEN
    handle_exception( SQLCODE, l_exception_message );
END;


-- =============================================================================
-- Name: process_sql_inputs
-- ========================
--
-- Summary
-- =======
-- Replaces references to values in test step outputs with the actual values

-- Parameters
-- ==========
-- p_operation : the current operation
-- p_sql_inputs: JSON representing input values to a SQL statement
--               { "col1":{"ref":"step1.appn_row_id"}, col2:"scalar" }
-- =============================================================================
PROCEDURE process_sql_inputs(p_operation  IN VARCHAR2,
                             p_sql_inputs IN OUT JSON_OBJECT_T)
IS
  l_key_name        VARCHAR2(200);
  l_var             VARCHAR2(200);
  l_data_type       PLS_INTEGER;
  l_sql_inputs_keys JSON_KEY_LIST;

BEGIN

  IF p_sql_inputs IS NOT NULL THEN

    l_sql_inputs_keys := p_sql_inputs.get_keys;
    FOR i IN 1..l_sql_inputs_keys.COUNT() 
    LOOP

      l_key_name := l_sql_inputs_keys(i);

      -- object denotes a value from a previous test step
      IF p_sql_inputs.get_Type(l_key_name) = 'OBJECT' THEN

        validate_reference_object(p_operation, l_key_name, p_sql_inputs.get_Object(l_key_name));
        l_var:= p_sql_inputs.get_Object(l_key_name).get_String('ref');

        l_data_type := g_framework_values.get_Object(l_var).get_Number('data_type');

        CASE l_data_type
          WHEN dbms_types.TYPECODE_VARCHAR2 THEN
            p_sql_inputs.put(l_key_name, g_framework_values.get_Object(l_var).get_String('data_value'));

          WHEN dbms_types.TYPECODE_NUMBER THEN
            p_sql_inputs.put(l_key_name, g_framework_values.get_Object(l_var).get_Number('data_value'));

          WHEN dbms_types.TYPECODE_DATE THEN
            p_sql_inputs.put(l_key_name, to_char(g_framework_values.get_Object(l_var).get_Date('data_value'), DATE_FORMAT) );

          WHEN DBMS_TYPES_BOOLEAN THEN
            p_sql_inputs.put(l_key_name, g_framework_values.get_Object(l_var).get_Boolean('data_value'));

          ELSE
            -- unsupported data type 
            RAISE_APPLICATION_ERROR(invalid_data_type, 'Data type not supported: ' || l_data_type);
        END CASE;

      ELSE
        -- standard JSON scalar - maintains key order
        IF p_sql_inputs.get(l_key_name).is_Null() THEN
          p_sql_inputs.put_Null(l_key_name);
        ELSIF p_sql_inputs.get(l_key_name).is_Number() THEN
          p_sql_inputs.put(l_key_name, p_sql_inputs.get_Number(l_key_name));
        ELSIF p_sql_inputs.get(l_key_name).is_String() THEN
          p_sql_inputs.put(l_key_name, p_sql_inputs.get_String(l_key_name));
        ELSIF p_sql_inputs.get(l_key_name).is_Boolean() THEN
          p_sql_inputs.put(l_key_name, p_sql_inputs.get_Boolean(l_key_name));
        ELSE
          -- unsupported data type 
          -- should be unreachable as textual JSON can't specify an unsupported data type
          RAISE_APPLICATION_ERROR(invalid_data_type, 'Data type not supported in unreachable code');
        END IF;
        
      END IF;
    END LOOP;
  END IF;

END process_sql_inputs;




-- =============================================================================
--
--                          Assertion Processing
--
-- =============================================================================



-- =============================================================================
-- Name: get_matcher
-- =================
--
-- Summary
-- =======
-- expand the short form user defined matcher in the JSON to the utPLSQL equivalent

-- Parameters
-- ==========
-- p_matcher: The user specified matcher in the JSON
--
-- =============================================================================
FUNCTION get_matcher( p_matcher IN VARCHAR2 ) RETURN VARCHAR2
IS
  l_matcher VARCHAR2(30);
BEGIN

  CASE p_matcher
    WHEN '=' THEN
      l_matcher := 'to_equal';
    WHEN '!=' THEN
      l_matcher := 'not_to_equal';
    WHEN '>' THEN
      l_matcher := 'to_be_greater_than';
    WHEN '!>' THEN
      l_matcher := 'not_to_be_greater_than';
    WHEN '>=' THEN
      l_matcher := 'to_be_greater_or_equal';
    WHEN '!>=' THEN
      l_matcher := 'not_to_be_greater_or_equal';
    WHEN '<' THEN
      l_matcher := 'to_be_less_than';
    WHEN '!<' THEN
      l_matcher := 'not_to_be_less_than';
    WHEN '<=' THEN
      l_matcher := 'to_be_less_or_equal';
    WHEN '!<=' THEN
      l_matcher := 'not_to_be_less_or_equal';
    WHEN 'like' THEN
      l_matcher := 'to_be_like';
    WHEN '!like' THEN
      l_matcher := 'not_to_be_like';
  END CASE;
 
  RETURN l_matcher;

END;


-- =============================================================================
-- Name: new_existence_assertion
-- =============================
--
-- Summary
-- =======
-- Constructs an existence assertion to be added to the dynamically created utPLSQL package
--
-- Parameters
-- ==========
-- p_result_column_name : name of value stored in framework e.g. step1.CLOBasJSON.elementName
-- p_matcher            : exists or !exists
-- p_assertion_msg      : message included in assertion for ease of identifying any failed assertions
--
-- =============================================================================
FUNCTION new_existence_assertion( p_result_column_name IN VARCHAR2,
                                  p_matcher            IN VARCHAR2,
                                  p_assertion_msg      IN VARCHAR2 ) RETURN VARCHAR2
IS
  l_assertion VARCHAR2(1000);
BEGIN

  l_assertion := 'ut.expect(';

  CASE p_matcher
    WHEN 'exists' THEN   

      IF g_framework_values.has(p_result_column_name) THEN
        -- element has been retrieved and stored by the framework
        l_assertion := l_assertion || '''' || p_result_column_name || ' exists' || '''' || ',' || '''' || p_assertion_msg || '''' || ').to_equal(' || '''' || p_result_column_name || ' exists' || '''' || ');';
      ELSE   
        -- element has NOT been retrieved and stored by the framework                                          
        l_assertion := l_assertion || '''' || p_result_column_name || ' does not exist' || '''' || ',' || '''' || p_assertion_msg || '''' || ').to_equal(' || '''' || p_result_column_name || ' exists' || '''' || ');';
      END IF;
      
    WHEN '!exists' THEN   

      IF g_framework_values.has(p_result_column_name) THEN
         -- element has been retrieved and stored by the framework
        l_assertion := l_assertion || '''' || p_result_column_name || ' exists' || '''' || ',' || '''' || p_assertion_msg || '''' || ').to_equal(' || '''' || p_result_column_name || ' does not exist' || '''' || ');';
      ELSE
         -- element has NOT been retrieved and stored by the framework
        l_assertion := l_assertion || '''' || p_result_column_name || ' does not exist' || '''' || ',' || '''' || p_assertion_msg || '''' || ').to_equal(' || '''' || p_result_column_name || ' does not exist' || '''' || ');';
      END IF;

  END CASE;

  RETURN l_assertion;
END new_existence_assertion;


-- =============================================================================
-- Name: add_assertion_to_pkg
-- ==========================
--
-- Summary
-- =======
-- add the assertion to the dynamically created utPLSQL package

-- Parameters
-- ==========
-- p_assertion     : a single assertion
-- p_data_type     : the data type of the assertion values                   
-- p_actual_date   : actual DATE value to be assessed against expected value in assertion
-- p_actual_number : actual NUMBER value to be assessed against expected value in assertion
-- p_actual_string : actual STRING value to be assessed against expected value in assertion
--
-- left(result) = right(expected)
-- =============================================================================
PROCEDURE add_assertion_to_pkg( p_result_column_name IN VARCHAR2,
                                p_assertion          IN JSON_OBJECT_T,
                                p_result             IN JSON_OBJECT_T)
IS
  l_matcher                       VARCHAR2(30);
  l_result_data_type              PLS_INTEGER;
  l_expected_data_type            PLS_INTEGER;
  l_result_string                 VARCHAR2(4000);
  l_result_number                 NUMBER;
  l_result_date                   DATE;
  l_result_boolean                BOOLEAN;
  l_result_json_object_or_array   VARCHAR2(10); -- chosen arbitrarily
  l_expected_string               VARCHAR2(4000);
  l_expected_number               NUMBER;
  l_expected_date                 DATE;
  l_expected_boolean              BOOLEAN;
  l_expected_json_object_or_array VARCHAR2(10); -- chosen arbitrarily
  l_expected_date_string          VARCHAR2(30);
  l_assertion                     VARCHAR2(4000);
  l_exception_message             VARCHAR2(500);
  l_expected_key                  VARCHAR2(1000);
  l_expected_object               JSON_OBJECT_T;
  l_assertion_msg                 VARCHAR2(200);

BEGIN
  g_current_assertion := g_current_assertion + 1;

  l_assertion_msg := g_current_functional_area || ' : ' || 'Suite ' || g_current_test_suite || ' : ' ||
                     'Test ' || g_current_test_number || ' : ' || 'Step ' || g_current_test_step.test_step || ' : ' ||
                     'Assertion ' || g_current_assertion;

  IF p_assertion.get_String('matcher') IN ('exists', '!exists') 
  THEN
    -- exists and !exists do not need a value to match against so create in a different form to the other assertions 
    l_assertion := new_existence_assertion( p_result_column_name, p_assertion.get_String('matcher'), l_assertion_msg );
  ELSE
    -- construct the actual result part of the assertion (left hand side of expression)
    l_result_data_type := p_result.get_Number('data_type');
    CASE
      -- Process strings
      WHEN l_result_data_type IN ( dbms_types.TYPECODE_VARCHAR2, 
                                   dbms_types.TYPECODE_VARCHAR, 
                                   dbms_types.TYPECODE_CHAR ) 
      THEN
        IF p_assertion.get_String('matcher') IN ('>', '!>', '<', '!<', '>=', '!>=', '<=', '!<=') THEN
          l_exception_message := p_assertion.get_String('matcher') || ' utplsql matcher does not support Strings';
          RAISE_APPLICATION_ERROR(invalid_matcher_data_type, l_exception_message);
        END IF;

        l_result_string := p_result.get_String('data_value');
        IF l_result_string IS NULL THEN
          l_assertion := 'ut.expect( cast(null as varchar2),' || '''' || l_assertion_msg || '''' || ').';
        ELSE
          l_assertion := 'ut.expect(' || '''' || l_result_string || '''' || ',' || '''' || l_assertion_msg || '''' || ').';
        END IF;

      -- Process numbers
      WHEN l_result_data_type = dbms_types.TYPECODE_NUMBER
      THEN
        IF p_assertion.get_String('matcher') IN ('like', '!like') THEN
          l_exception_message := p_assertion.get_String('matcher') || ' utplsql matcher does not support Numbers';
          RAISE_APPLICATION_ERROR(invalid_matcher_data_type, l_exception_message);
        END IF;

        l_result_number := p_result.get_Number('data_value');
        IF l_result_number IS NULL THEN
          l_assertion := 'ut.expect( cast(null as number),' || '''' || l_assertion_msg || '''' || ').';
        ELSE
          l_assertion := 'ut.expect(' || l_result_number || ',' || '''' || l_assertion_msg || '''' || ').';
        END IF;

      -- Process dates
      WHEN l_result_data_type = dbms_types.TYPECODE_DATE
      THEN
        IF p_assertion.get_String('matcher') IN ('like', '!like') THEN
          l_exception_message := p_assertion.get_String('matcher') || ' utplsql matcher does not support Dates';
          RAISE_APPLICATION_ERROR(invalid_matcher_data_type, l_exception_message);
        END IF;

        l_result_date := p_result.get_Date('data_value');
        IF l_result_date IS NULL THEN
          l_assertion := 'ut.expect( cast(null as date),' || '''' || l_assertion_msg || '''' || ').';
        ELSE   
          l_assertion := 'ut.expect( ' ||
                         'to_date(' || '''' || to_char(l_result_date,DATE_FORMAT) || '''' || ', ' || '''' || DATE_FORMAT || '''' || ')' || ',' || '''' || l_assertion_msg || '''' || ').';
        END IF;

      -- Process booleans
      WHEN l_result_data_type = DBMS_TYPES_BOOLEAN
      THEN
        IF p_assertion.get_String('matcher') NOT IN ('=', '!=') THEN
          l_exception_message := p_assertion.get_String('matcher') || ' utplsql matcher does not support Boolens';
          RAISE_APPLICATION_ERROR(invalid_matcher_data_type, l_exception_message);
        END IF;

        l_result_boolean := p_result.get_Boolean('data_value');
        IF l_result_boolean IS NULL THEN
          l_assertion := 'ut.expect( cast(null as boolean),' || '''' || l_assertion_msg || '''' || ').';
        ELSE
          IF l_result_boolean = TRUE THEN
            l_assertion := 'ut.expect(true,' || '''' || l_assertion_msg || '''' || ').';
          ELSE
            l_assertion := 'ut.expect(false,' || '''' || l_assertion_msg || '''' || ').';
          END IF;
        END IF;

      -- Process JSON objects and arrays
      WHEN l_result_data_type IN ( DBMS_TYPES_JSON_OBJECT, 
                                   DBMS_TYPES_JSON_ARRAY ) 
      THEN
        IF p_assertion.get_String('matcher') NOT IN ('=', '!=') THEN
          l_exception_message := p_assertion.get_String('matcher') || ' utplsql matcher does not support JSON objects or arrays';
          RAISE_APPLICATION_ERROR(invalid_matcher_data_type, l_exception_message);
        END IF;

        IF p_result.get('data_value').is_Null() THEN
          l_assertion := 'ut.expect( cast(null as varchar2),' || '''' || l_assertion_msg || '''' || ').';  -- arbitrarily chosen
        ELSE
          l_result_json_object_or_array := p_result.get_String('data_value');
          l_assertion := 'ut.expect(' || '''' || l_result_json_object_or_array || '''' || ',' || '''' || l_assertion_msg || '''' || ').';
        END IF;

      -- Process unknown
      WHEN l_result_data_type = DBMS_TYPES_NULL_JSON THEN
        -- cannot cast appropriately. Base the cast on expected data type
        NULL;

      ELSE
        -- unsupported data type 
        RAISE_APPLICATION_ERROR(invalid_data_type, 'Data type not supported: ' || l_result_data_type);

    END CASE;

    -- determine the expected value as specified by assertion (right hand side of expression)
    IF p_assertion.get_Type('value') = 'OBJECT' 
    THEN
      -- retrieve value from referenced test step (g_framework_values)
      l_expected_key := p_assertion.get_Object('value').get_String('ref');
      l_expected_object := g_framework_values.get_Object(l_expected_key);
      l_expected_data_type := l_expected_object.get_Number('data_type');

      IF l_expected_object.get('data_value').is_null() THEN
        l_expected_string      := NULL; l_expected_number               := NULL; l_expected_date      := NULL; 
        l_expected_date_string := NULL; l_expected_json_object_or_array := NULL;

        IF l_result_data_type = DBMS_TYPES_NULL_JSON THEN
          l_assertion := 'ut.expect( cast(null as varchar2) ).';  -- expand for clarity
        END IF;

      ELSE
        CASE
          WHEN l_expected_data_type IN ( dbms_types.TYPECODE_VARCHAR2, 
                                         dbms_types.TYPECODE_VARCHAR, 
                                         dbms_types.TYPECODE_CHAR ) 
          THEN

            l_expected_string := l_expected_object.get_String('data_value');
            IF l_result_data_type = DBMS_TYPES_NULL_JSON THEN
              l_assertion := 'ut.expect( cast(null as varchar2) ).';
            END IF;
       
          WHEN l_expected_data_type = dbms_types.TYPECODE_NUMBER THEN

            l_expected_number := l_expected_object.get_Number('data_value');
            IF l_result_data_type = DBMS_TYPES_NULL_JSON THEN
              l_assertion := 'ut.expect( cast(null as number) ).';
            END IF;

          WHEN l_expected_data_type = dbms_types.TYPECODE_DATE THEN

            l_expected_date := l_expected_object.get_Date('data_value');
            l_expected_date_string := to_char(l_expected_date, DATE_FORMAT);
            IF l_result_data_type = DBMS_TYPES_NULL_JSON THEN
              l_assertion := 'ut.expect( cast(null as date) ).';
            END IF;

          WHEN l_expected_data_type = DBMS_TYPES_BOOLEAN THEN

            l_expected_boolean := l_expected_object.get_Boolean('data_value');
            IF l_result_data_type = DBMS_TYPES_NULL_JSON THEN
              l_assertion := 'ut.expect( cast(null as boolean) ).';
            END IF;

          WHEN l_expected_data_type IN ( DBMS_TYPES_JSON_OBJECT, 
                                         DBMS_TYPES_JSON_ARRAY ) 
          THEN

            l_expected_json_object_or_array := l_expected_object.get_String('data_value');
            IF l_result_data_type = DBMS_TYPES_NULL_JSON THEN
              l_assertion := 'ut.expect( cast(null as varchar2) ).'; 
            END IF;

          WHEN l_expected_data_type = DBMS_TYPES_NULL_JSON THEN
            -- done above in null check
            null;

          ELSE
            -- unsupported data type 
            RAISE_APPLICATION_ERROR(invalid_data_type, 'Data type not supported: ' || l_expected_data_type);
        END CASE;
      END IF;

    ELSE
      -- determine scalar value - cannot differentiate string from date here. Use actual data type as a guide
      IF p_assertion.get('value').is_null() THEN
        l_expected_string      := NULL; l_expected_number               := NULL; l_expected_boolean := NULL;
        l_expected_date_string := NULL; l_expected_json_object_or_array := NULL;

        IF l_result_data_type = DBMS_TYPES_NULL_JSON THEN
          l_assertion := 'ut.expect( cast(null as varchar2) ).';  -- expand for clarity
        END IF;

      ELSE
        -- use actual data type as a guide to expected data type
        CASE
          WHEN l_result_data_type IN ( dbms_types.TYPECODE_VARCHAR2, 
                                       dbms_types.TYPECODE_VARCHAR, 
                                       dbms_types.TYPECODE_CHAR ) 
          THEN
            l_expected_string := p_assertion.get_String('value');
            IF l_result_data_type = DBMS_TYPES_NULL_JSON THEN
              l_assertion := 'ut.expect( cast(null as varchar2) ).';
            END IF;
       
          WHEN l_result_data_type = dbms_types.TYPECODE_NUMBER THEN
            l_expected_number := p_assertion.get_Number('value');
            IF l_result_data_type = DBMS_TYPES_NULL_JSON THEN
              l_assertion := 'ut.expect( cast(null as number) ).';
            END IF;

          WHEN l_result_data_type = dbms_types.TYPECODE_DATE THEN
            l_expected_date_string := p_assertion.get_String('value');

            BEGIN
              l_expected_date := pkg_dynamic_sql.determine_date_from_json(l_expected_date_string);
            EXCEPTION
              WHEN OTHERS THEN
                handle_exception( SQLCODE, 'Error determining_date: ' || SQLERRM );
            END;

            l_expected_date_string := TO_CHAR(l_expected_date,DATE_FORMAT);
            IF l_result_data_type = DBMS_TYPES_NULL_JSON THEN
              l_assertion := 'ut.expect( cast(null as date) ).';
            END IF;

          WHEN l_result_data_type = DBMS_TYPES_BOOLEAN THEN
            l_expected_boolean := p_assertion.get_Boolean('value');
            IF l_result_data_type = DBMS_TYPES_NULL_JSON THEN
              l_assertion := 'ut.expect( cast(null as boolean) ).';
            END IF;

          WHEN l_result_data_type IN ( DBMS_TYPES_JSON_OBJECT, 
                                       DBMS_TYPES_JSON_ARRAY ) 
          THEN
            l_expected_json_object_or_array := l_expected_object.get_String('data_value');
            IF l_result_data_type = DBMS_TYPES_NULL_JSON THEN
              l_assertion := 'ut.expect( cast(null as varchar2) ).'; 
            END IF;

          WHEN l_result_data_type = DBMS_TYPES_NULL_JSON THEN
            -- done above in null test
            IF p_assertion.get('value').is_String() THEN
              l_expected_string := p_assertion.get_String('value');
              l_assertion := 'ut.expect( cast(null as varchar2) ).'; 
            ELSIF p_assertion.get('value').is_Number() THEN
              l_expected_number := p_assertion.get_Number('value');
              l_assertion := 'ut.expect( cast(null as number) ).'; 
            ELSIF p_assertion.get('value').is_Boolean() THEN
              l_expected_boolean := p_assertion.get_Boolean('value');
              l_assertion := 'ut.expect( cast(null as boolean) ).'; 
            END IF;
  
          ELSE
            -- unsupported data type 
            RAISE_APPLICATION_ERROR(invalid_data_type, 'Data type not supported: ' || l_result_data_type);
        END CASE;
      END IF;
    END IF;

    -- finalise construction of assertion

    -- expand the short form user defined matcher in the JSON to the utPLSQL equivalent
    l_matcher := get_matcher(p_assertion.get_String('matcher'));

    CASE
      -- process string
      WHEN l_result_data_type IN ( dbms_types.TYPECODE_VARCHAR2, 
                                   dbms_types.TYPECODE_VARCHAR, 
                                   dbms_types.TYPECODE_CHAR ) 
      THEN
        IF l_expected_string IS NULL THEN
          IF l_matcher = 'to_equal' THEN
            l_assertion := l_assertion || 'to_be_null();';
          ELSE
            l_assertion := l_assertion || 'to_be_not_null();';
          END IF;
        ELSE
          l_assertion := l_assertion || l_matcher || '(' || '''' || l_expected_string || '''' || ');';
        END IF;
   
      -- process number
      WHEN l_result_data_type = dbms_types.TYPECODE_NUMBER THEN
        IF l_expected_number IS NULL THEN
          IF l_matcher = 'to_equal' THEN
            l_assertion := l_assertion || 'to_be_null();';
          ELSE
            l_assertion := l_assertion || 'to_be_not_null();';
          END IF;
        ELSE
          l_assertion := l_assertion || l_matcher || '(' || l_expected_number || ');';
        END IF;

      -- process date
      WHEN l_result_data_type = dbms_types.TYPECODE_DATE THEN
        IF l_expected_date_string IS NULL THEN
          IF l_matcher = 'to_equal' THEN
            l_assertion := l_assertion || 'to_be_null();';
          ELSE
            l_assertion := l_assertion || 'to_be_not_null();';
          END IF;
        ELSE
          l_assertion := l_assertion || l_matcher || '( ' ||
                         'to_date(' || '''' || l_expected_date_string || '''' || ',' || '''' || DATE_FORMAT || '''' || ') );';      
        END IF;

      -- process boolean
      WHEN l_result_data_type = DBMS_TYPES_BOOLEAN THEN
        IF l_expected_boolean IS NULL THEN
          IF l_matcher = 'to_equal' THEN
            l_assertion := l_assertion || 'to_be_null();';
          ELSE
            l_assertion := l_assertion || 'to_be_not_null();';
          END IF;

        ELSE
          IF l_matcher = 'to_equal' THEN
            IF l_expected_boolean = TRUE THEN
              l_assertion := l_assertion || 'to_be_true();';
            ELSE
              l_assertion := l_assertion || 'to_be_false();';
            END IF;
          ELSE  -- reverse boolean test for '!=' matcher
            IF l_expected_boolean = TRUE THEN
              l_assertion := l_assertion || 'to_be_false();';
            ELSE
              l_assertion := l_assertion || 'to_be_true();';
            END IF;
          END IF;
        END IF;

      -- Process JSON objects and arrays
      WHEN l_result_data_type IN ( DBMS_TYPES_JSON_OBJECT, 
                                   DBMS_TYPES_JSON_ARRAY ) 
      THEN
        IF l_expected_json_object_or_array IS NULL THEN
          IF l_matcher = 'to_equal' THEN
            l_assertion := l_assertion || 'to_be_null();';
          ELSE
            l_assertion := l_assertion || 'to_be_not_null();';
          END IF;
        ELSE
          l_assertion := l_assertion || l_matcher || '(' || '''' || l_expected_json_object_or_array || '''' || ');';
        END IF;

      WHEN l_result_data_type = DBMS_TYPES_NULL_JSON 
      THEN
        -- l_assertion not yet set if result = DBMS_TYPES_NULL_JSON 
        IF l_expected_data_type = DBMS_TYPES_NULL_JSON THEN
          l_assertion := 'ut.expect( cast(null as varchar2) ).' || l_matcher || '(cast(null as varchar2));';
        ELSE

          IF l_expected_string IS NOT NULL THEN
            l_assertion := l_assertion || l_matcher || '(' || '''' || l_expected_string || '''' || ');';
          ELSIF l_expected_number IS NOT NULL THEN
            l_assertion := l_assertion || l_matcher || '(' || '''' || l_expected_number || '''' || ');';
          ELSIF l_expected_boolean IS NOT NULL THEN

            IF l_matcher = 'to_equal' THEN
              IF l_expected_boolean = TRUE THEN
                l_assertion := l_assertion || 'to_be_true();';
              ELSE
                l_assertion := l_assertion || 'to_be_false();';
              END IF;
            ELSE  -- reverse boolean test for '!=' matcher
              IF l_expected_boolean = TRUE THEN
                l_assertion := l_assertion || 'to_be_false();';
              ELSE
                l_assertion := l_assertion || 'to_be_true();';
              END IF;
            END IF;  

          ELSIF l_expected_date_string IS NOT NULL THEN
            l_assertion := l_assertion || l_matcher || '( ' ||
                           'to_date(' || '''' || l_expected_date_string || '''' || ',' || '''' || DATE_FORMAT || '''' || ') );'; 
          ELSIF l_expected_json_object_or_array IS NOT NULL THEN
            l_assertion := l_assertion || l_matcher || '(' || '''' || l_expected_json_object_or_array || '''' || ');';
  
          ELSIF l_matcher = 'to_equal' THEN
            l_assertion := l_assertion || 'to_be_null();';
          ELSIF l_matcher = 'to_not_equal' THEN
            l_assertion := l_assertion || 'to_be_not_null();';
          END IF;

        END IF;
      
      ELSE
        -- unsupported data type 
        RAISE_APPLICATION_ERROR(invalid_data_type, 'Data type not supported: ' || l_result_data_type);
    END CASE;

  END IF;

  -- add assertion to package
  l_assertion := l_assertion || chr(10);
  dbms_lob.writeappend(g_package_body, length(l_assertion), l_assertion);

EXCEPTION
  WHEN invalid_matcher_data_type_excp THEN
    handle_exception( SQLCODE, l_exception_message ); 
END add_assertion_to_pkg;


-- =============================================================================
-- Name: add_assertions_to_pkg
-- ===========================
--
-- Summary
-- =======
-- Adds utPLSQL assertions to dynamically created package procedure

-- Parameters
-- ==========
-- p_assertions : the set of assertions specified for an expectation                   
-- p_results    : the result set against which the assertions are to be evaluated
--                the same assertions will be replicated for each row of a result set
--                result set format: 
--               [{ colname1: {data_type:n, value:666}, colname2: {data_type:m, value:"ABC"} }]
--
-- =============================================================================
PROCEDURE add_assertions_to_pkg( p_assertions IN JSON_OBJECT_T,
                                 p_results    IN JSON_ARRAY_T )
IS
  l_result_column_name VARCHAR2(200);
  l_exception_message  VARCHAR2(500);
  l_result             JSON_OBJECT_T;
  l_result_key_names   JSON_KEY_LIST;
  l_assertion_result   JSON_OBJECT_T;

BEGIN
  -- process each set of assertions.
  FOR i IN 0..p_results.get_size()-1 LOOP
    l_result := treat(p_results.get(i) AS JSON_OBJECT_T); -- { col1:{}, col2:{}, {} }

    -- initialise individual result for each data type
    --l_date_result := NULL; l_number_result := NULL; l_string_result := NULL; --todo

    -- process each assertion in turn
    l_result_key_names := l_result.get_keys;
    FOR j IN 1..l_result_key_names.COUNT() LOOP

      l_result_column_name := l_result_key_names(j); 
      l_assertion_result := l_result.get_Object(l_result_column_name);

      add_assertion_to_pkg( l_result_column_name,
                            p_assertions.get_Object(l_result_column_name),
                            l_assertion_result );

    END LOOP;
  END LOOP;

EXCEPTION
  WHEN invalid_data_type_excp THEN
    handle_exception( SQLCODE, l_exception_message );
END add_assertions_to_pkg;




-- =============================================================================
-- Name: validate_assertions
-- =========================
--
-- Summary
-- =======
-- Validates the user defined assertions for an expectation

-- Parameters
-- ==========
-- p_expectation: the user defined expectation
-- p_source     : database table or test_step output
--
-- =============================================================================
PROCEDURE validate_assertions(p_expectation IN JSON_OBJECT_T,
                              p_source      IN VARCHAR2) -- table or outputs
IS
  l_matcher           VARCHAR2(30);
  l_dummy             SMALLINT;
  l_exception_message VARCHAR2(500);
  l_assertion_key     VARCHAR2(200);
  l_assertion_columns JSON_KEY_LIST;
  l_assertion         JSON_OBJECT_T;

BEGIN

  IF NOT p_expectation.has('assertions') THEN
    l_exception_message := 'Missing assertions in expectation';
    RAISE_APPLICATION_ERROR(missing_e_assertions, l_exception_message);
  END IF;

  l_assertion_columns := p_expectation.get_Object('assertions').get_keys;
  FOR i IN 1..l_assertion_columns.COUNT() LOOP

    l_assertion_key := l_assertion_columns(i);
    l_assertion := p_expectation.get_Object('assertions').get_Object(l_assertion_key);

    IF NOT l_assertion.has('matcher') THEN
      l_exception_message := 'utPLSQL matcher not specified in assertion';
      RAISE_APPLICATION_ERROR(missing_matcher, l_exception_message);
    END IF;
    l_matcher := l_assertion.get_String('matcher');

    -- ensure the specified matcher is supported
    BEGIN
      SELECT 1 INTO l_dummy FROM dual 
       WHERE l_matcher IN ( '=', '!=', '>', '!>', '<', '!<',
                            '>=', '!>=', '<=', '!<=',
                            'like', '!like',
                            'be_false', 'be_true' , 
                            'be_null', 'be_not_null', 'exists', '!exists' );
    EXCEPTION
      WHEN NO_DATA_FOUND THEN
        l_exception_message := 'Invalid utPLSQL matcher specified in assertion';
        RAISE_APPLICATION_ERROR(invalid_matcher, l_exception_message);
    END;

    IF p_source = 'framework' AND l_matcher NOT IN ('exists', '!exists') THEN
      -- check entry exists in g_framework_values. Only applicable for assertions not testing for the existence of an element
      IF NOT g_framework_values.has(l_assertion_key) THEN
        l_exception_message := 'Value reference specified incorrectly for column (' || l_assertion_key || '). Check previous test steps have actually generated the required value';
        RAISE_APPLICATION_ERROR(invalid_a_ref, l_exception_message);
      END IF;
    END IF;

    -- ensure a value is specified where appropriate
    IF l_matcher IN ( '=', '!=', '>', '!>', '<', '!<',
                      '>=', '!>=', '<=', '!<=', 'like', '!like' )
    THEN
      IF NOT l_assertion.has('value') THEN
        l_exception_message := 'utPLSQL matcher has no expected value';
        RAISE_APPLICATION_ERROR(missing_matcher_value, l_exception_message);
      END IF;

      -- validate the value if it is a reference to a test step output
      IF l_assertion.get_Type('value') = 'OBJECT' THEN
        validate_reference_object('A', 'ref', l_assertion.get_Object('value'));
      END IF;
    END IF;

  END LOOP;

EXCEPTION
  WHEN missing_e_assertions_excp OR
       invalid_a_ref_excp OR
       missing_matcher_excp OR
       invalid_matcher_excp OR
       missing_matcher_value_excp OR
       invalid_assertion_column_excp
  THEN
    handle_exception( SQLCODE, l_exception_message );
END validate_assertions;




-- =============================================================================
--
--                          Expectation Processing
--
-- =============================================================================




-- =============================================================================
-- Name: process_expectation
-- =========================
--
-- Summary
-- =======
-- Validates the expectation
-- Validates the assertions
-- Retrieves a row/rows from the database if assertions are against a database table
-- Retrieves test step outputs if assertions are against these
-- Adds the assertions to the utPLSQL package that will evaluate them
--
-- Parameters
-- ==========
-- p_expectation: the user defined expectation
--
-- =============================================================================
PROCEDURE process_expectation( p_expectation IN JSON_OBJECT_T )
IS
  l_source            VARCHAR2(9);
  l_table_name        VARCHAR2(128);
  l_exception_message VARCHAR2(500);
  l_result            JSON_OBJECT_T;
  l_output            JSON_ELEMENT_T;
  l_null_output       JSON_OBJECT_T;
  l_where             JSON_OBJECT_T;
  l_results           JSON_ARRAY_T;   
  l_assertion_keys    JSON_KEY_LIST;
  l_column_names      JSON_ARRAY_T;
  l_expectation_keys  JSON_KEY_LIST;
  l_rows_selected     INTEGER;
  
BEGIN
  -- retrieve and validate source
  l_source := p_expectation.get_String('source');  
  IF l_source IS NULL THEN
    l_exception_message := 'Unspecified or misspelled source key for expectation';
    RAISE_APPLICATION_ERROR(missing_e_source, l_exception_message);
  END IF;

  IF l_source = 'table' THEN
    -- retrieve and validate table_name
    l_table_name := p_expectation.get_String('table_name');
    IF l_table_name IS NULL THEN
      l_exception_message := 'Unspecified or misspelled table_name key for expectation';
      RAISE_APPLICATION_ERROR(missing_e_table_name, l_exception_message);
    END IF;

    -- retrieve and validate where clause
    l_where := p_expectation.get_Object('where');

    -- replace referenced values with the actual value eg. "step1.appn_row_id" -> 123456
    process_sql_inputs('E', l_where);

  ELSIF l_source != 'framework' THEN

    l_exception_message := 'Expectation source must be table or framework';
    RAISE_APPLICATION_ERROR(invalid_e_source, l_exception_message);

  END IF;

  -- retrieve and validate assertions
  validate_assertions(p_expectation, l_source);

  -- construct array of required column names - do within source = table?
  l_column_names := new JSON_ARRAY_T;
  l_expectation_keys := p_expectation.get_Object('assertions').get_keys;
  FOR i IN 1..l_expectation_keys.COUNT() LOOP
    l_column_names.append(l_expectation_keys(i));
  END LOOP;

  l_results := new JSON_ARRAY_T;
  IF l_source = 'table' THEN
 
    BEGIN
      log('SELECTING from DB to evaluate assertions');
      log_select_row( l_table_name, l_column_names, l_where );

      pkg_dynamic_sql.select_row( l_table_name, 
                                  l_column_names,
                                  l_where,
                                  l_results,
                                  l_rows_selected );

      log_select_row_results( l_results, l_rows_selected );
    EXCEPTION
      WHEN OTHERS THEN

        IF SQLCODE = -20204 THEN
          -- handle exception with a context specific message
          handle_exception( SQLCODE, 'No row retrieved with which to evaluate assertions' );
        ELSE
          handle_exception( SQLCODE, 'Error selecting row: ' || SQLERRM );
        END IF;
    END;

  ELSE -- source = framework
    l_assertion_keys := p_expectation.get_Object('assertions').get_keys;
    l_result := new JSON_OBJECT_T;
    FOR i IN 1..l_assertion_keys.COUNT LOOP

      IF g_framework_values.has(l_assertion_keys(i)) THEN
        -- an assertion has been specified against an element that has been successfully retrieved
        l_output := g_framework_values.get(l_assertion_keys(i));  
        l_result.put(l_assertion_keys(i),l_output);
      ELSE
        -- an assertion has been specified against an element that the framework has not retrieved
        -- this is still needed to facilitate existence assertions 
        l_null_output := new JSON_OBJECT_T;
        l_null_output.put('data_type', DBMS_TYPES_NULL_JSON);  
        l_null_output.put_Null('data_value');  -- dummy value as not needed for existence assertions
        l_result.put(l_assertion_keys(i),l_null_output);
      END IF;

    END LOOP;
    l_results.append(l_result);

  END IF;

  add_assertions_to_pkg( p_expectation.get_Object('assertions'),
                         l_results );

EXCEPTION
  WHEN missing_e_source_excp OR
       invalid_e_source_excp OR
       missing_e_table_name_excp --OR  
       --missing_e_where_excp
  THEN
    handle_exception( SQLCODE, l_exception_message );
END process_expectation;


-- =============================================================================
-- Name: process_expectations
-- ==========================
--
-- Summary
-- =======
-- Examines the user defined expectations and processes each one in turn
--
-- =============================================================================
PROCEDURE process_expectations
IS
  l_expectations JSON_ARRAY_T;
  l_expectation  JSON_OBJECT_T;

BEGIN
  -- note the stage of processing for future reference
  g_test_stage := EXPECTATION_STAGE;

  IF g_current_test_step.expectations IS NOT NULL THEN

    g_current_assertion := 0;
    l_expectations := JSON_ARRAY_T.parse(g_current_test_step.expectations);

    -- process each expectation in turn
    FOR i IN 0..l_expectations.get_size()-1 LOOP

      -- note the expectation currently being processed
      -- needed by handle_exception to determine if an exception is expected or not
      g_expectation_index := i;

      -- process current expectation
      l_expectation := treat(l_expectations.get(i) AS JSON_OBJECT_T);
      BEGIN
        process_expectation( l_expectation );
      EXCEPTION
        WHEN expected_expectation_error_excp THEN
          -- the test must be testing for a specified and therefore expected exception within process_expectation
          -- as such, the processing of the current expectation has now raised the exception and been terminated
          -- move onto the next expectation, which will now process the expected exception and create the assertion
          NULL;
      END;
    END LOOP;
  END IF;

END process_expectations;




-- =============================================================================
--
--                          Operation Processing
--
-- =============================================================================




-- =============================================================================
-- Name: delete_row
-- ================
--
-- Summary
-- =======
-- Validates the JSON and then invokes a routine to delete one or more rows.
--
-- Parameters
-- ==========
-- p_operation: all details required to perform the delete
--
-- =============================================================================
PROCEDURE delete_row( p_operation IN JSON_OBJECT_T )
IS
  l_table_name        VARCHAR2(128);
  l_exception_message VARCHAR2(500);
  l_where             JSON_OBJECT_T;
  l_rows_deleted      INTEGER;

BEGIN
  -- retrieve and validate table_name
  l_table_name := p_operation.get_String('table_name');
  IF l_table_name IS NULL THEN
    l_exception_message := 'Unspecified or misspelled table_name key for DELETE operation';
    RAISE_APPLICATION_ERROR(missing_crud_table_name, l_exception_message);
  END IF;

  -- retrieve and validate where clause
  l_where := p_operation.get_Object('where');
 
  -- replace referenced values with the actual value eg. "step1.appn_row_id" -> 123456
  process_sql_inputs('D', l_where);

  -- delete the rows
  BEGIN
    log_delete_row( l_table_name, l_where );

    pkg_dynamic_sql.delete_row( l_table_name,
                                l_where,
                                l_rows_deleted );

    log_delete_row_results( l_rows_deleted );
  EXCEPTION
    WHEN OTHERS THEN
      handle_exception( SQLCODE, 'Error deleting row: ' || SQLERRM );
  END;

EXCEPTION
  WHEN missing_crud_table_name_excp 
  THEN
    handle_exception( SQLCODE, l_exception_message );
END delete_row;


-- =============================================================================
-- Name: update_row
-- ================
--
-- Summary
-- =======
-- Validates the JSON and then invokes a routine to update one or more rows.
--
-- Parameters
-- ==========
-- p_operation: all details required to perform the operation
--
-- =============================================================================
PROCEDURE update_row( p_operation IN JSON_OBJECT_T )
IS
  l_table_name        VARCHAR2(128);
  l_exception_message VARCHAR2(500);
  l_where             JSON_OBJECT_T;
  l_columns           JSON_OBJECT_T;
  l_rows_updated     INTEGER;

BEGIN
  -- retrieve and validate table_name
  l_table_name := p_operation.get_String('table_name');
  IF l_table_name IS NULL THEN
    l_exception_message := 'Unspecified or misspelled table_name key for UPDATE operation';
    RAISE_APPLICATION_ERROR(missing_crud_table_name, l_exception_message);
  END IF;

  -- retrieve and validate columns
  l_columns := p_operation.get_Object('columns');
  IF l_columns IS NULL THEN
    l_exception_message := 'Unspecified or misspelled columns key for UPDATE operation';
    RAISE_APPLICATION_ERROR(missing_u_columns, l_exception_message);
  END IF;

  -- replace referenced values with the actual value eg. "step1.appn_row_id" -> 123456
  process_sql_inputs('U', l_columns);

  -- retrieve and validate where clause
  l_where := p_operation.get_Object('where');

  -- replace referenced values with the actual value eg. "step1.appn_row_id" -> 123456 
  process_sql_inputs('U', l_where);

  -- update the rows
  BEGIN
    log_update_row( l_table_name, l_columns, l_where );

    pkg_dynamic_sql.update_row( l_table_name,
                                l_columns,
                                l_where,
                                g_site_id,
                                l_rows_updated );

    log_update_row_results( l_rows_updated );	
  EXCEPTION
    WHEN OTHERS THEN
      handle_exception( SQLCODE, 'Error updating row: ' || SQLERRM );
  END;

EXCEPTION
  WHEN missing_crud_table_name_excp OR
       missing_u_columns_excp --OR
       --missing_u_where_excp
  THEN
    handle_exception( SQLCODE, l_exception_message );
END update_row;


-- =============================================================================
-- Name: insert_row
-- ================
--
-- Summary
-- =======
-- Validates the JSON and then invokes a routine to insert a new row.
-- For relevant tables, stores the generated appn_row_id in g_framework_values for future 
-- reference by other test steps in this transaction
--
-- Parameters
-- ==========
-- p_operation: all details required to perform the operation
--
-- =============================================================================
PROCEDURE insert_row( p_operation IN JSON_OBJECT_T )
IS
  l_table_name        VARCHAR2(128);
  l_exception_message VARCHAR2(500);
  l_columns           JSON_OBJECT_T;
  l_new_ari           JSON_OBJECT_T;

BEGIN
  -- retrieve and validate table_name
  IF NOT p_operation.has('table_name') THEN
    l_exception_message := 'Unspecified or misspelled table_name key for INSERT operation';
    RAISE_APPLICATION_ERROR(missing_crud_table_name, l_exception_message);
  END IF;
  l_table_name := p_operation.get_String('table_name');

  -- retrieve and validate columns
  IF NOT p_operation.has('columns') THEN
    l_exception_message := 'Unspecified or misspelled columns key for INSERT operation';
    RAISE_APPLICATION_ERROR(missing_i_columns, l_exception_message);
  END IF;
  l_columns := p_operation.get_Object('columns');

  -- replace referenced values with the actual value eg. "step1.appn_row_id" -> 123456
  process_sql_inputs('I', l_columns);

  -- insert the new row
  BEGIN
    log_insert_row( l_table_name, l_columns );

    l_new_ari := NULL;
    pkg_dynamic_sql.insert_row( l_table_name,
                                l_columns,
                                g_site_id,
                                l_new_ari );  -- returned if insert generates new appn_row_id

    log_insert_row_results( l_table_name, l_new_ari );
  EXCEPTION
    WHEN OTHERS THEN
      handle_exception( SQLCODE, 'Error inserting row: ' || SQLERRM );
  END;

  -- store generated appn_row_id in g_framework_values for future reference by other test steps in this transaction
  IF l_new_ari IS NOT NULL THEN

    IF g_current_functional_area = 'SEED_DATA' THEN

      g_framework_values.put('seed_data.' || g_current_test_step.test_suite || '.' 
                                          || g_current_test_step.test_number || '.' 
                                          || g_current_test_step.test_step || '.' 
                                          ||'appn_row_id', l_new_ari );
    ELSE
      g_framework_values.put('step' || g_current_test_step.test_step || '.' || 'appn_row_id', l_new_ari );
    END IF;
  END IF;

EXCEPTION
  WHEN missing_crud_table_name_excp OR 
       missing_i_columns_excp 
  THEN
    handle_exception( SQLCODE, l_exception_message );

END insert_row;


-- =============================================================================
-- Name: call_routine
-- ==================
--
-- Summary
-- =======
-- Validates the JSON and then performs a specified function or procedure call
-- Any named parameters (input and output) are stored in g_framework_values for future reference eg. "step1.param1"
-- A function return value is stored in g_framework_values for future reference eg. "step1.function_name"
--
-- g_framework_values : { "step1.routine_name" : {"data_type":<2|9|12>, "value":<numval|stringval|dateval> } }
--
--
-- Parameters
-- ==========
-- p_operation : all details required to perform the operation
--
-- =============================================================================
PROCEDURE call_routine( p_operation IN JSON_OBJECT_T )
IS
  l_package_name      VARCHAR2(128);
  l_routine_name      VARCHAR2(128);
  l_param_name        VARCHAR2(128);
  l_exception_message VARCHAR2(500);
  l_parameters        JSON_OBJECT_T;
  l_results           JSON_OBJECT_T;
  l_param_names       JSON_KEY_LIST;
  l_result            JSON_OBJECT_T;

BEGIN
  -- retrieve package name if present
  l_package_name := p_operation.get_String('package_name');

  -- retrieve and validate routine name
  l_routine_name := p_operation.get_String('routine_name');  -- validated in pkg_dynamic_sql
  IF l_routine_name IS NULL THEN
    l_exception_message := 'Unspecified or misspelled routine_name key for routine call';
    RAISE_APPLICATION_ERROR(missing_routine_name, l_exception_message);
  END IF;

  -- retrieve and validate parameters if present
  l_parameters := p_operation.get_Object('parameters');

  -- replace referenced values with the actual value eg. "step1.appn_row_id" -> 123456
  process_sql_inputs('R', l_parameters);

  -- invoke the specified routine
  BEGIN
    log_call_routine( l_package_name, l_routine_name, l_parameters );

    pkg_dynamic_sql.call_routine( l_package_name,
                                  l_routine_name,
                                  l_parameters, 
                                  l_results );  
    log_call_routine_results( l_results );
  EXCEPTION
    WHEN OTHERS THEN
      handle_exception( SQLCODE, 'Error calling routine: ' || SQLERRM );
  END;  

  -- store retrieved values in g_framework_values for future reference by other test steps in this transaction
  IF l_results IS NOT NULL THEN

    l_param_names := l_results.get_keys;

    FOR i IN 1..l_param_names.COUNT LOOP
      l_param_name := l_param_names(i);
      l_result := l_results.get_Object(l_param_name);

      IF l_result.get_Number('data_type') = dbms_types.TYPECODE_CLOB
      THEN
        process_clob_as_json( l_param_name, l_result );
      ELSE
        g_framework_values.put('step' || g_current_test_step.test_step || '.' || l_param_name, l_results.get(l_param_name));
      END IF;

    END LOOP;
  END IF;

EXCEPTION
  WHEN missing_package_name_excp OR
       missing_routine_name_excp OR 
       missing_parameters_excp
  THEN
    handle_exception( SQLCODE, l_exception_message );
END call_routine;


-- =============================================================================
-- Name: select_row
-- ================
--
-- Summary
-- =======
-- Validates the JSON and then invokes a routine to select a row.
-- Stores the selected column values in g_framework_values for future 
-- reference by other test steps in this transaction
--
-- Parameters
-- ==========
-- p_operation: all details required to perform the operation
--
-- =============================================================================
PROCEDURE select_row( p_operation IN JSON_OBJECT_T )
IS
  l_table_name        VARCHAR2(128);
  l_column_name       VARCHAR2(128);
  l_exception_message VARCHAR2(500);
  l_where             JSON_OBJECT_T;
  l_columns           JSON_ARRAY_T;
  l_col_names         JSON_KEY_LIST;
  l_result            JSON_OBJECT_T;
  l_results           JSON_ARRAY_T;
  l_rows_selected     INTEGER;

BEGIN
  -- retrieve and validate table_name
  l_table_name := p_operation.get_String('table_name');
  IF l_table_name IS NULL THEN
    l_exception_message := 'Unspecified or misspelled table_name key for SELECT operation';
    RAISE_APPLICATION_ERROR(missing_crud_table_name, l_exception_message);
  END IF;

  -- retrieve and validate columns
  l_columns := p_operation.get_Array('columns');
  IF l_columns IS NULL THEN
    l_exception_message := 'Unspecified or misspelled columns key for SELECT operation';
    RAISE_APPLICATION_ERROR(missing_s_columns, l_exception_message); 
  END IF;

  -- retrieve and validate where clause
  l_where := p_operation.get_Object('where');

  -- replace referenced values with the actual value eg. "step1.appn_row_id" -> 123456 
  process_sql_inputs('S', l_where);

  -- select the row
  l_results := new JSON_ARRAY_T;
  BEGIN
    log_select_row( l_table_name, l_columns, l_where );

    pkg_dynamic_sql.select_row( l_table_name, 
                                l_columns,
                                l_where,
                                l_results,
                                l_rows_selected );

    log_select_row_results( l_results, l_rows_selected );
  EXCEPTION
    WHEN OTHERS THEN

      IF SQLCODE = -20204 THEN
        -- handle exception with a context specific message
        handle_exception( SQLCODE, 'No row retrieved by select statement' );
      ELSE
        handle_exception( SQLCODE, 'Error selecting row: ' || SQLERRM );
      END IF;
  END;

  -- store retrieved values in g_framework_values for future reference by other test steps in this transaction
  IF l_results IS NOT NULL THEN

    IF l_results.get_size() > 1 THEN
      l_exception_message := 'More than ONE row returned by SELECT operation';
      RAISE_APPLICATION_ERROR(too_many_s_rows, l_exception_message);
    END IF;

    l_result := treat(l_results.get(0) AS JSON_OBJECT_T);
    l_col_names := l_result.get_keys;
    FOR i IN 1..l_col_names.COUNT LOOP
      l_column_name := l_col_names(i);
      g_framework_values.put('step' || g_current_test_step.test_step || '.' || l_column_name, l_result.get(l_column_name));
    END LOOP;
  END IF;

EXCEPTION
  WHEN missing_crud_table_name_excp OR
       missing_s_columns_excp OR
       --missing_s_where_excp OR
       too_many_s_rows_excp
  THEN
    handle_exception( SQLCODE, l_exception_message );
END select_row;


-- =============================================================================
-- Name: process_operation
-- =======================
--
-- Summary
-- =======
-- Validates and performs a test step operation specified as a JSON object
-- An indication of the possible keys and values are shown below
--
-- { 
--   "operation"    : "<I,U,D,R>",
--   "table_name"   : "<table name>",
--   "columns"      : {"date_column":"2018-12-31T22:00", "char_column":"ABC", "num_column":123, "null_column":null},
--   "where"        : {"appn_row_id":{"ref":"step1.appn_row_id"}},
--   "where"        : {"date_column":"2018-12-31T22:00", "char_column":"ABC", "num_column":123, "null_column":null},
--   "package_name" : "name_of_package",
--   "routine_name" : "name_of_routine",
--   "parameters"   : {"PIN1":1, "PIN2":"A", "PIN3":"1967-06-13", "POUT1":0, "POUT2":"", "POUT3":""}
-- }
--
-- =============================================================================
PROCEDURE process_operation
IS
  l_operation         VARCHAR2(1);
  l_exception_message VARCHAR2(500);
  l_test_operation    JSON_OBJECT_T;

BEGIN
  -- note the stage of processing for future reference
  g_test_stage := OPERATION_STAGE;

  IF g_current_test_step.test_operation IS NOT NULL
  THEN
    -- ensure an operation has been specified
    l_test_operation := JSON_OBJECT_T.parse(g_current_test_step.test_operation);
    IF NOT l_test_operation.has('operation') THEN
      l_exception_message := 'Unspecified or misspelled operation key for test step';
      RAISE_APPLICATION_ERROR(missing_operation, l_exception_message);
    END IF;

    -- ensure the specified operation is supported
    l_operation := l_test_operation.get_String('operation');
    CASE l_operation
      WHEN 'I' THEN
        insert_row( l_test_operation );
      WHEN 'U' THEN
        update_row( l_test_operation );
      WHEN 'D' THEN
        delete_row( l_test_operation );
      WHEN 'S' THEN
        select_row( l_test_operation );
      WHEN 'R' THEN
        call_routine( l_test_operation );
      WHEN 'C' THEN
        COMMIT;
      ELSE
        l_exception_message := 'Invalid operation specified [I, U, D, R, S, C]';
        RAISE_APPLICATION_ERROR(invalid_operation, l_exception_message);
    END CASE;
  END IF;

EXCEPTION
  WHEN missing_operation_excp OR
       invalid_operation_excp
  THEN
    handle_exception( SQLCODE, l_exception_message );

END process_operation;




-- =============================================================================
--
--                      Test StepIdentification and Processing
--
-- =============================================================================




-- =============================================================================
-- Name: execute_test_step
-- =======================
--
-- Summary
-- =======
-- Perform an individual test step
-- An individual test step defines an operation (INSERT, UPDATE, Package call etc)
-- plus a set of expectations subsequent to that operation
-- These expectations are coded as utplsql assertions
--
-- =============================================================================
PROCEDURE execute_test_step
IS
BEGIN
  log('*** Executing ' || g_current_functional_area || ' Suite ' || g_current_test_suite || ' Test ' || g_current_test_step.test_number || ' Step ' || g_current_test_step.test_step);

  g_expectation_index := -1;

  -- carry out the operation defined in this test step (INSERT, UPDATE, Package call etc)
  BEGIN
    process_operation();
  EXCEPTION
    WHEN expected_operation_error_excp THEN
      -- the test must be testing for a specified and therefore expected exception within process_operation
      -- as such, process_operation has now raised the exception and been terminated
      -- move onto expectation processing, which will now process the expected exception and create the assertion
      null;
  END;

  -- process any defined expectations for the current test step
  process_expectations();

  -- test step has run to completion without exceptions
  update_test_status('COMPLETED',null,null);

  log('***Successfully executed ' || g_current_functional_area || ' Suite ' || g_current_test_suite || ' Test ' || g_current_test_step.test_number || ' Step ' || g_current_test_step.test_step);

EXCEPTION
  WHEN uninitialized_collection_excp THEN
    handle_exception( SQLCODE, 'JSON incorrectly specifies an empty object' );
  WHEN missing_object_excp THEN
    handle_exception( SQLCODE, 'JSON not specifying an object where one is expected' );
END execute_test_step;


-- =============================================================================
-- Name: load_seed_data
-- ====================
--
-- Summary
-- =======
-- Applies seed data to the database prior to any test case that requests it
--
-- Any generated appn_row_ids are made available by the framework to the test
-- number in question in a similar manner that usual test step generated appn_row_ids
-- are.
--
-- Usual test step appn_row_ids are referenced using step[n].appn_row_id
-- e.g. {"ref" : "step1.appn_row_id"}
--
-- However, seed data appn_row_ids can be generated by any SEED_DATA suite, test or
-- step e.g. suite1, test2, step3. These appn_row_ids can be referenced as follows:
-- seed_data.n1.n2.n3.appn_row_id where n1 = suite number, n2 = test_number and
-- n3 = step number
-- e.g. {"ref" : "seed_data.1.2.3.appn_row_id"}
-- =============================================================================
PROCEDURE load_seed_data( p_seed_data IN VARCHAR2 )
IS
  l_current_functional_area server_tests.functional_area%TYPE;
  l_current_test_suite      server_tests.test_suite%TYPE;
  l_current_test_number     server_tests.test_number%TYPE;
  l_current_test_step       server_tests%ROWTYPE;
  l_test_suite              server_tests.test_suite%TYPE;
  l_test_number             server_tests.test_number%TYPE;
  l_seed_data_key           VARCHAR2(10);
  l_backout_key             VARCHAR2(10);
  l_seed_data               JSON_ARRAY_T;
  l_seed_data_steps         TEST_STEPS;
  l_exception_message VARCHAR2(500);

  -- small internal routine to restore global values
  PROCEDURE restore_globals
  IS
  BEGIN
    g_current_functional_area := l_current_functional_area;
    g_current_test_suite      := l_current_test_suite;
    g_current_test_number     := l_current_test_number;
    g_current_test_step       := l_current_test_step;
  END restore_globals;

BEGIN
  g_test_stage := SEED_DATA_STAGE;

  -- note details of current (non seed data) test step so we can revert to this after seed data has been applied
  l_current_functional_area := g_current_functional_area;
  l_current_test_suite      := g_current_test_suite;
  l_current_test_number     := g_current_test_number;
  l_current_test_step       := g_current_test_step;

  -- note global values for future reference
  g_seed_data_backout := new JSON_ARRAY_T;
  g_current_functional_area := 'SEED_DATA';

  -- parse into JSON array
  l_seed_data := JSON_ARRAY_T.parse(p_seed_data);

  FOR i IN 0..l_seed_data.get_size()-1
  LOOP
    l_seed_data_key := l_seed_data.get_String(i);

    -- validate format of seed data reference
    IF NOT regexp_like(l_seed_data_key,'^([1-9]|[1-9][0-9])[.]([1-9]|[1-9][0-9]|[1-9][0-9][0-9])$') THEN
      l_exception_message := 'Seed data reference must be in format nn.mmm where n is suite number and m is test number';
      RAISE_APPLICATION_ERROR(invalid_seed_data_reference, l_exception_message);
    END IF;

    -- extract the test number
    l_test_number := TO_NUMBER( SUBSTR(l_seed_data_key,( INSTR(l_seed_data_key,'.')+1)));

    -- ensure the seed data exists
    IF ( NOT g_all_seed_data.exists(l_seed_data_key) ) THEN
      l_exception_message := 'Seed data does not exist';
      RAISE_APPLICATION_ERROR(invalid_seed_data_reference, l_exception_message);
    END IF;

    -- extract the suite number
    l_test_suite := TO_NUMBER( SUBSTR(l_seed_data_key, 1, ( INSTR(l_seed_data_key,'.')-1)) );

    -- load reference to backout if it exists. Data to be backed out after this main transaction completes
    l_backout_key := l_test_suite || '.' || (l_test_number);
    IF g_all_seed_data_backout.exists(l_backout_key) THEN
      g_seed_data_backout.append(l_backout_key);
    END IF;

    -- note global values for future reference
    g_current_test_suite  := l_test_suite;
    g_current_test_number := l_test_number;

    l_seed_data_steps := g_all_seed_data(l_seed_data_key);
    FOR j IN l_seed_data_steps.FIRST..l_seed_data_steps.LAST
    LOOP
      -- note global value for future reference
      g_current_test_step := l_seed_data_steps(j);

      BEGIN
        execute_test_step();
      EXCEPTION
        WHEN OTHERS THEN
          -- revert to the non seed data test step details
          restore_globals();
          RAISE;
      END;
    END LOOP;
  END LOOP;

  -- revert to the non seed data test step details
  restore_globals();

EXCEPTION

  WHEN invalid_seed_data_reference_excp THEN
    -- revert to the non seed data test step details
    restore_globals();

    handle_exception( SQLCODE, l_exception_message);

  WHEN missing_seed_data_backout_excp THEN
    -- revert to the non seed data test step details
    restore_globals();

    handle_exception( SQLCODE, l_exception_message);

END load_seed_data;


-- =============================================================================
-- Name: post_test_cleanup
-- =======================
--
-- Summary
-- =======
-- Creates a new transaction consisting of test steps provided by the user to
-- backout any data that has been committed. These test steps start at 901
--
-- Creates a new transaction for each of the seed data scripts that were loaded
-- in order to backout any data that has been committed. These test steps, as part
-- of the seed data scripts, also start at 901
--
-- =============================================================================
PROCEDURE post_test_cleanup
IS
  CURSOR backout_test_steps IS
  SELECT *
    FROM server_tests
   WHERE functional_area = g_current_functional_area
     AND test_suite = g_current_test_suite
     AND test_number = g_current_test_number
     AND test_step > LAST_TEST_STEP_BEFORE_BACKOUT
   ORDER BY test_step;

  l_current_functional_area server_tests.functional_area%TYPE;
  l_current_test_suite      server_tests.test_suite%TYPE;
  l_current_test_number     server_tests.test_number%TYPE;
  l_current_test_step       server_tests%ROWTYPE;
  l_backout_steps           TEST_STEPS;
  l_backout_key             VARCHAR2(10);
  l_test_steps              BOOLEAN := false;

  -- small internal routine to restore global values
  PROCEDURE restore_globals
  IS
  BEGIN
    g_current_functional_area := l_current_functional_area;
    g_current_test_suite      := l_current_test_suite;
    g_current_test_number     := l_current_test_number;
    g_current_test_step       := l_current_test_step;
  END restore_globals;

BEGIN
  -- note details of current (non seed data) test step so we can revert to this after seed data has been applied
  l_current_functional_area := g_current_functional_area;
  l_current_test_suite      := g_current_test_suite;
  l_current_test_number     := g_current_test_number;
  l_current_test_step       := g_current_test_step;

  ------------------------------------------------
  -- BEGIN TRANSACTION FOR BACKOUT OF TEST DATA --
  ------------------------------------------------
  FOR test_step IN backout_test_steps 
  LOOP
    BEGIN  
      -- We have at least 1 backout step indicating that the test number has issued a commit
      -- This triggers the backout of both test step data and seed data

      -- note the test number currently being processed for future reference
      g_current_test_step := test_step;
      IF l_test_steps = FALSE THEN
        l_test_steps := TRUE;
        add_procedure_to_pkg( BACKOUT_TEST_DATA_PROCEDURE );
      END IF;

      execute_test_step();

    EXCEPTION
      WHEN fatal_test_error_excp THEN
        -- ensure the procedure code is completed correctly
        finalise_proc_code;
        ROLLBACK;

    END;  
  END LOOP;

  -- ensure the procedure code is completed correctly if it exists
  IF l_test_steps = TRUE THEN
    finalise_proc_code;
  END IF;

  COMMIT;
  ----------------------------------------------
  -- END TRANSACTION FOR BACKOUT OF TEST DATA --
  ----------------------------------------------


  IF l_test_steps = TRUE  -- we have at least 1 backout step indicating that the test has issued a commit so backout the seed data
  THEN  
    g_current_functional_area := 'BACKOUT';  

    -- backout the seed data in reverse order
    FOR i IN REVERSE 0..g_seed_data_backout.get_size()-1
    LOOP
      ------------------------------------------------
      -- BEGIN TRANSACTION FOR BACKOUT OF SEED DATA --
      ------------------------------------------------
      BEGIN  
        l_backout_key := g_seed_data_backout.get_String(i);

        -- extract the suite number
        g_current_test_suite := TO_NUMBER( SUBSTR(l_backout_key, 1, ( INSTR(l_backout_key,'.')-1)) );

        -- extract the test number
        g_current_test_number := TO_NUMBER( SUBSTR(l_backout_key,( INSTR(l_backout_key,'.')+1)));

        -- add procedure that will execute all assertions for this test (multiple test steps) to package
        add_procedure_to_pkg( BACKOUT_SEED_DATA_PROCEDURE, l_current_test_number, l_backout_key);

        -- retrieve the backout steps
        l_backout_steps := g_all_seed_data_backout(l_backout_key);

        FOR j IN l_backout_steps.FIRST..l_backout_steps.LAST
        LOOP
          g_current_test_step := l_backout_steps(j);
          execute_test_step();
        END LOOP;

        -- ensure the procedure code is completed correctly
        finalise_proc_code;

        COMMIT;

      EXCEPTION
        WHEN fatal_test_error_excp THEN
          -- ensure the procedure code is completed correctly
          finalise_proc_code;
          ROLLBACK;

      END;

      ----------------------------------------------
      -- END TRANSACTION FOR BACKOUT OF SEED DATA --
      ----------------------------------------------
    END LOOP;

  END IF;

  -- revert to the non seed data test step details
  restore_globals();

EXCEPTION
  WHEN fatal_test_error_excp THEN

    -- revert to the non seed data test step details
    restore_globals();

    -- ensure the procedure code is completed correctly
    finalise_proc_code;

    -- fatal error so rollback transaction
    ROLLBACK;

END post_test_cleanup;


-- =============================================================================
-- Name: execute_test_number
-- =========================
--
-- Summary
-- =======
-- Perform an individual functional area test suite test number
-- A new package procedure is created dynamically for this test number
-- The assertions generated for this procedure execute within their own
-- transaction when the utplsql package is invoked.
-- Any unwanted commits are then backed out
--
-- Parameters
-- ==========
-- p_functional_area : the functional area to be executed
-- p_test_suite      : the functional area test suite to be executed
-- p_test_number     : the test number to be executed
--
-- =============================================================================
PROCEDURE execute_test_number( p_functional_area IN server_tests.functional_area%TYPE,
                               p_test_suite      IN server_tests.test_suite%TYPE,
                               p_test_number     IN server_tests.test_number%TYPE )
IS
  CURSOR test_steps IS
  SELECT *
    FROM server_tests
   WHERE functional_area = p_functional_area
     AND test_suite = p_test_suite
     AND test_number = p_test_number
     AND test_step <= LAST_TEST_STEP_BEFORE_BACKOUT
   ORDER BY test_step;

  l_first_step BOOLEAN := TRUE;

BEGIN

  -----------------------
  -- TRANSACTION START --
  -----------------------

  -- note the test number currently being processed for future reference
  g_current_test_number := p_test_number;

  -- initialise object used to store test step outputs for future reference
  g_framework_values := new JSON_OBJECT_T;

  g_seed_data_backout := new JSON_ARRAY_T;

  -- add procedure that will execute all assertions for this test (multiple test steps) to package
  add_procedure_to_pkg( NORMAL_TEST_PROCEDURE );  

  -- execute all test steps within this test
  FOR test_step IN test_steps LOOP

    g_bypass_operation := FALSE;
    g_expectation_index := -1;  -- todo - clarify implementation

    -- note the test number currently being processed for future reference
    g_current_test_step := test_step;

    -- only the first test step is considered in determining if seed data is to be loaded
    IF l_first_step 
    THEN
      l_first_step := FALSE;
      IF test_step.seed_data IS NOT NULL 
      THEN
        BEGIN
          load_seed_data( test_step.seed_data );
        EXCEPTION
          WHEN expected_seed_data_error_excp THEN
            g_bypass_operation := TRUE;  -- bypass operation and process expectations
        END;
      END IF;
    END IF;

    execute_test_step();
  END LOOP;

  -- ensure the procedure code is completed correctly
  finalise_proc_code;

  -- ensure database operations are not persisted
  rollback;

  ---------------------
  -- TRANSACTION END --
  ---------------------
 
  -- backout any unwanted commits
  post_test_cleanup();  

EXCEPTION

  WHEN fatal_test_error_excp THEN
    -- ensure the procedure code is completed correctly
    finalise_proc_code;

    -- fatal error so rollback transaction
    ROLLBACK;

    -- backout any unwanted commits
    post_test_cleanup();  

END execute_test_number;


-- =============================================================================
-- Name: test_functional_area_suite
-- ================================
--
-- Summary
-- =======
-- Perform all the tests defined in server_tests for the specified functional area suite
-- A new package is created dynamically to test all the defined expectations for this suite
-- The expectations are coded as utplsql assertions
--
-- Parameters
-- ==========
-- p_functional_area: the functional area to be executed
-- p_test_suite     : the functional area test suite to be executed
--
-- =============================================================================
PROCEDURE test_functional_area_suite( p_functional_area IN server_tests.functional_area%TYPE,
                                      p_test_suite      IN server_tests.test_suite%TYPE )
IS
  l_num_tests         SMALLINT;
  l_exception_message VARCHAR2(500);

  CURSOR test_numbers IS
  SELECT DISTINCT test_number tn
    FROM server_tests
   WHERE functional_area = p_functional_area
     AND test_suite      = p_test_suite
   ORDER BY test_number;

BEGIN
  -- note the functional area and test suite currently being processed for future reference
  g_current_functional_area := p_functional_area;
  g_current_test_suite := p_test_suite;

  -- execute all tests within this suite
  l_num_tests := 0;
  FOR test_number IN test_numbers LOOP

    IF l_num_tests = 0 THEN
      -- create the initial code for the package that will be created to execute this test suite
      create_pkg_code( p_functional_area, p_test_suite );
    END IF;

    l_num_tests := l_num_tests + 1;
    execute_test_number( p_functional_area, p_test_suite, test_number.tn);
  END LOOP;

  IF l_num_tests > 0 THEN
    -- finalise the code for the package that will be created to execute this test suite
    finalise_pkg_code;

    -- apply package to database
    create_pkg;

    -- invoke the package to execute the functional area test suite
    invoke_test_pkg;
  ELSE
    log('No tests defined in the database for ' || p_functional_area || ' Suite ' || p_test_suite);

    INSERT INTO server_test_run_statuses VALUES
    (server_test_run_statuses_seq.nextval, 'NONE', -1, -1, -1,
     'FAILED', -1, 'No tests defined in the database for ' || p_functional_area || ' Suite ' || p_test_suite);
    COMMIT;
  END IF;

EXCEPTION
  WHEN invalid_suite_excp THEN
    handle_exception( SQLCODE, l_exception_message );

  WHEN suite_failed_compilation_excp THEN

    l_exception_message := 'Package ' || p_functional_area || '_SUITE' || p_test_suite || ' failed compilation. ';
    l_exception_message := l_exception_message || 'Please examine the compilation error. Likely due to a malformed utPLSQL assertion.';
    handle_exception( SQLCODE, l_exception_message, TRUE, TRUE);

END test_functional_area_suite;


-- =============================================================================
-- Name: test_functional_area
-- ==========================
--
-- Summary
-- =======
-- Perform all the tests defined in server_tests for the specified functional area
-- as this execution has not been constrained by test suite
--
-- Parameters
-- ==========
-- p_functional_area: the specified functional area to be executed
--
-- =============================================================================
PROCEDURE test_functional_area( p_functional_area IN server_tests.functional_area%TYPE )
IS
  l_num_suites        SMALLINT;
  l_exception_message VARCHAR2(500);

  CURSOR functional_area_suites( p_functional_area IN server_tests.functional_area%TYPE ) IS
  SELECT DISTINCT test_suite ts
    FROM server_tests
   WHERE functional_area = p_functional_area
   ORDER BY test_suite;

BEGIN
  -- note the functional area currently being processed for future reference
  g_current_functional_area := p_functional_area;

  -- test all the suites of the specified functional area
  l_num_suites := 0;
  FOR functional_area_suite IN functional_area_suites( p_functional_area ) LOOP
    l_num_suites := l_num_suites + 1;
    test_functional_area_suite( p_functional_area, functional_area_suite.ts );
  END LOOP;

  IF l_num_suites = 0 THEN
    log('No test suites defined in the database for ' || p_functional_area);

    INSERT INTO server_test_run_statuses VALUES
    (server_test_run_statuses_seq.nextval, 'NONE', -1, -1, -1,
     'FAILED', -1, 'No test suites defined in the database for ' || p_functional_area);
    COMMIT;
  END IF;

EXCEPTION
  WHEN invalid_functional_area_excp THEN
    handle_exception( SQLCODE, l_exception_message );
END test_functional_area;


-- =============================================================================
-- Name: test_all_functional_areas
-- ===============================
--
-- Summary
-- =======
-- Perform all the tests defined in server_tests as this execution has not been
-- constrained by functional area or test suite
--
-- =============================================================================
PROCEDURE test_all_functional_areas
IS
  l_num_fas           SMALLINT;

  CURSOR functional_areas IS
  SELECT DISTINCT functional_area fa
    FROM server_tests
   WHERE functional_area != 'SEED_DATA';

BEGIN
  -- test all functional areas
  l_num_fas := 0;
  FOR functional_area IN functional_areas LOOP
    l_num_fas := l_num_fas + 1;
    test_functional_area( functional_area.fa );
  END LOOP;

  IF l_num_fas = 0 THEN
    log('No tests defined in the database');

    INSERT INTO server_test_run_statuses VALUES
    (server_test_run_statuses_seq.nextval, 'NONE', -1, -1, -1,
     'FAILED', -1, 'No tests defined in the database');
    COMMIT;
  END IF;

END test_all_functional_areas;




-- =============================================================================
--
--                          Initialisation
--
-- =============================================================================




-- =============================================================================
-- Name: retrieve_seed_data
-- ========================
--
-- Summary
-- =======
-- Retrieves all seed data from the database.
-- Stored in memory such that a sequence of test steps can be indexed by <suite#>.<test#>
-- e.g.
-- FUNCTIONAL_AREA = SEED_DATA
--
-- Suite:1, Test Number:1
-- 1.1 -> step1 -> step2 -> step3 ...
--
-- Suite:95, Test Number:3
-- 95.3 -> step1 -> step2 -> step3 ...
--
-- =============================================================================
PROCEDURE retrieve_seed_data
IS
  TYPE                       SEED_DATA_TABLE IS TABLE OF server_tests%ROWTYPE INDEX BY PLS_INTEGER;
  l_seed_data                SEED_DATA_TABLE;
  l_test_steps               TEST_STEPS;
  l_seed_data_index          VARCHAR2(10);
  l_selected_seed_data_index VARCHAR2(10);
  l_test_step                server_tests%ROWTYPE;
  i                          VARCHAR2(10);

BEGIN
  -- retrieve all seed data from database
  SELECT * BULK COLLECT INTO l_seed_data
    FROM server_tests
   WHERE functional_area = 'SEED_DATA'
     AND test_step <= LAST_TEST_STEP_BEFORE_BACKOUT
   ORDER BY test_suite, test_number, test_step;

  -- transform this so it can be easily indexed
  l_seed_data_index := '0.0';

  IF l_seed_data.FIRST IS NOT NULL
  THEN
    FOR i IN l_seed_data.FIRST..l_seed_data.LAST
    LOOP
      l_test_step := l_seed_data(i);

      -- create g_all_seed_data entry if suite or test number has changed
      l_selected_seed_data_index := l_test_step.test_suite || '.' || l_test_step.test_number;
      IF l_selected_seed_data_index != l_seed_data_index THEN
        l_seed_data_index := l_selected_seed_data_index;
        g_all_seed_data(l_seed_data_index) := l_test_steps;
      END IF;

      -- add new test step to g_all_seed_data
      g_all_seed_data (l_seed_data_index) (l_test_step.test_step) := l_test_step;
    END LOOP;
  END IF;

END retrieve_seed_data;


-- =============================================================================
-- Name: retrieve_seed_data_backout
-- ================================
--
-- Summary
-- =======
-- Retrieves all seed data backout from the database.
-- Stored in memory such that a sequence of test steps can be indexed by <suite#>.<test#>
-- e.g.
-- FUNCTIONAL_AREA = SEED_DATA
--
-- Suite:1, Test Number:1
-- 1.1 -> step901 -> step902 -> step903 ...
--
-- Suite:95, Test Number:3
-- 95.3 -> step901 -> step902 -> step903 ...
--
-- =============================================================================
PROCEDURE retrieve_seed_data_backout
IS
  TYPE SEED_DATA_TABLE IS TABLE OF server_tests%ROWTYPE INDEX BY PLS_INTEGER;
  l_backout    SEED_DATA_TABLE;
  l_test_steps TEST_STEPS;

  l_backout_index          VARCHAR2(10);
  l_selected_backout_index VARCHAR2(10);
  l_test_step              server_tests%ROWTYPE;
  i                        VARCHAR2(10);

BEGIN
  -- retrieve all seed data from database
  SELECT * BULK COLLECT INTO l_backout
    FROM server_tests
   WHERE functional_area = 'SEED_DATA'
     AND test_step > LAST_TEST_STEP_BEFORE_BACKOUT
   ORDER BY test_suite, test_number, test_step;

  -- transform this so it can be easily indexed
  l_backout_index := '0.0';

  IF l_backout.FIRST IS NOT NULL
  THEN
    FOR i IN l_backout.FIRST..l_backout.LAST
    LOOP
      l_test_step := l_backout(i);

      -- create g_all_seed_data entry if suite or test number has changed
      l_selected_backout_index := l_test_step.test_suite || '.' || l_test_step.test_number;
      IF l_selected_backout_index != l_backout_index THEN
        l_backout_index := l_selected_backout_index;
        g_all_seed_data_backout(l_backout_index) := l_test_steps;
      END IF;

      -- add new test step to g_all_seed_data
      g_all_seed_data_backout (l_backout_index) (l_test_step.test_step) := l_test_step;
 
    END LOOP;
  END IF;

END retrieve_seed_data_backout;


-- =============================================================================
-- Name: initialisation
-- ====================
--
-- Summary
-- =======
-- Ensure no test logs are present before performing tests
-- Initialise miscellaneous global variables
-- Retrieve all seed data information from the database
-- =============================================================================
PROCEDURE initialisation( p_site_id IN VARCHAR2 )
IS
BEGIN
  -- ensure no logs exist before performing testing
  DELETE FROM server_test_logs;
  DELETE FROM server_test_run_statuses;
  COMMIT;

  -- initialise globals
  g_log_number              := 0;
  g_log_detail              := HIGH_DETAIL;
  g_primary_keys            := new JSON_OBJECT_T;
  g_column_types            := new JSON_OBJECT_T;
  g_current_functional_area := NULL;
  g_current_test_suite      := NULL;
  g_current_test_number     := NULL;
  g_current_test_step       := NULL;
  g_site_id                 := p_site_id;
  g_all_seed_data.DELETE;

  -- retrieve seed data and backout information from DB
  retrieve_seed_data();
  retrieve_seed_data_backout();

END initialisation;




-- =============================================================================
--
--                          Top Level Processing
--
-- =============================================================================




-- =============================================================================
-- Name: perform_server_testing
-- ============================
--
-- Summary
-- =======
-- Performs a series of server tests which are defined in the database table server_tests
-- Tests are grouped by functional area, test suite, test number and test step.
--
-- An individual test step defines an operation (INSERT, UPDATE, Package call etc)
-- plus a set of expectations subsequent to that operation
--
-- A test number is a group of test steps that form a transaction.
-- 
-- A package is created dynamically for each test suite. This contains all the
-- individual test step expectations coded as utplsql assertions.
-- This package is then executed for the current test suite and then recreated for the next
--
-- Parameters
-- ==========
-- p_functional_area: execute the tests for a specified functional area
--                    if not specified then all functional areas are executed
-- p_test_suite     : execute the specified test suite for a specified functional area
--                    if not specified then execute all test suites for a specified
--                    functional area
--
-- =============================================================================
PROCEDURE perform_server_testing( p_functional_area IN server_tests.functional_area%TYPE DEFAULT NULL,
                                  p_test_suite      IN server_tests.test_suite%TYPE      DEFAULT NULL,
                                  p_site_id         IN VARCHAR2                          DEFAULT 'AOS' )
IS
BEGIN
  -- perform miscellaneous initialisation operations
  initialisation( p_site_id );

  -- perform the server tests as specified by the parameters
  IF p_functional_area IS NULL THEN
    test_all_functional_areas;
  ELSIF p_test_suite IS NULL THEN
    test_functional_area( p_functional_area );  
  ELSE
    test_functional_area_suite( p_functional_area, 
                                p_test_suite );
  END IF;

EXCEPTION
  WHEN OTHERS THEN
    handle_exception( SQLCODE, 'FATAL ERROR. Abandoning automated testing: ' || SQLERRM, FALSE );
    ROLLBACK;
END perform_server_testing;

BEGIN
null;
END pkg_server_testing;
/
