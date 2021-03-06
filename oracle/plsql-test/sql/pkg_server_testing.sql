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
-- -----------------------------------------------------------------------------

CREATE OR REPLACE PACKAGE BODY 
-- Identifier: AIMS-4285

pkg_server_testing
IS
  -- package globals
  g_log_detail           SMALLINT;  -- 0:none, 1:low, 2:medium, 3:high
  g_expectation_index    SMALLINT;
  g_package_spec         VARCHAR2(32767);
  g_package_body         VARCHAR2(32767);
  g_current_package_name VARCHAR2(30);

  g_primary_keys JSON_OBJECT_T;
  g_outputs      JSON_OBJECT_T;
  g_column_types JSON_OBJECT_T;

  g_log_number              server_test_logs.log_number%TYPE;
  g_current_functional_area server_tests.functional_area%TYPE;
  g_current_test_suite      server_tests.test_suite%TYPE;
  g_current_test_number     server_tests.test_number%TYPE;
  g_current_test_step       server_tests%ROWTYPE;
  g_current_assertion       INTEGER;
  g_site_id                 VARCHAR2(3);

  TYPE seed_data_table IS TABLE OF server_tests%ROWTYPE INDEX BY PLS_INTEGER;  
  g_seed_data seed_data_table;

  -- package constants
  DIAG                   CONSTANT SMALLINT     := 1;
  HIGH_DETAIL            CONSTANT SMALLINT     := 3;
  NO_DETAIL              CONSTANT SMALLINT     := 4;
  DATE_FORMAT            CONSTANT VARCHAR2(20) := 'YYYY-MM-DD"T"HH24:MI';
  DBMS_TYPES_BOOLEAN     CONSTANT PLS_INTEGER  := 0;
  DBMS_TYPES_NULL_JSON   CONSTANT PLS_INTEGER  := -1;
  DBMS_TYPES_JSON_OBJECT CONSTANT PLS_INTEGER  := -2;
  DBMS_TYPES_JSON_ARRAY  CONSTANT PLS_INTEGER  := -3;


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

  missing_u_where CONSTANT NUMBER := -20113;
  missing_u_where_excp EXCEPTION;
  PRAGMA EXCEPTION_INIT(missing_u_where_excp, missing_u_where);

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

  missing_s_where CONSTANT NUMBER := -20120;
  missing_s_where_excp EXCEPTION;
  PRAGMA EXCEPTION_INIT(missing_s_where_excp, missing_s_where);

  too_many_s_rows CONSTANT NUMBER := -20121;
  too_many_s_rows_excp EXCEPTION;
  PRAGMA EXCEPTION_INIT(too_many_s_rows_excp, too_many_s_rows);

  -- expectation exceptions
  missing_e_table_name CONSTANT NUMBER := -20151;
  missing_e_table_name_excp EXCEPTION;
  PRAGMA EXCEPTION_INIT(missing_e_table_name_excp,missing_e_table_name);

  missing_e_where CONSTANT NUMBER := -20152;
  missing_e_where_excp EXCEPTION;
  PRAGMA EXCEPTION_INIT(missing_e_where_excp, missing_e_where);

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

  expected_expectation_error CONSTANT NUMBER := -20197;
  expected_expectation_error_excp EXCEPTION;
  PRAGMA EXCEPTION_INIT(expected_expectation_error_excp, expected_expectation_error);

  expected_operation_error CONSTANT NUMBER := -20198;
  expected_operation_error_excp EXCEPTION;
  PRAGMA EXCEPTION_INIT(expected_operation_error_excp, expected_operation_error);

  fatal_test_error CONSTANT NUMBER := -20199;
  fatal_test_error_excp EXCEPTION;
  PRAGMA EXCEPTION_INIT(fatal_test_error_excp, fatal_test_error);  

  fatal_seed_data_error CONSTANT NUMBER := -20200;
  fatal_seed_data_error_excp EXCEPTION;
  PRAGMA EXCEPTION_INIT(fatal_seed_data_error_excp, fatal_seed_data_error);

  suite_failed_compilation      CONSTANT NUMBER := -20300;
  suite_failed_compilation_excp EXCEPTION;
  PRAGMA EXCEPTION_INIT(suite_failed_compilation_excp, suite_failed_compilation);

  -- forward declarations for mutually recursive routines
  PROCEDURE flatten_json_object(p_key IN VARCHAR2, p_object IN JSON_OBJECT_T);
  PROCEDURE flatten_json_array(p_key IN VARCHAR2, p_array IN JSON_ARRAY_T);

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

  g_outputs.put(p_fully_qualified_key, l_scalar_result);
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
  l_object_keys JSON_KEY_LIST;
  l_object_key        VARCHAR2(1000);
  l_element JSON_ELEMENT_T;
  l_fully_qualified_key     VARCHAR2(1000);
  l_result  JSON_OBJECT_T;

BEGIN
  -- get object keys
  l_object_keys := p_object.get_keys;

  IF l_object_keys IS NULL THEN
    l_result := new JSON_OBJECT_T;
    l_result.put('data_type', DBMS_TYPES_JSON_OBJECT);
    l_result.put_Null('data_value');
    g_outputs.put(p_key, l_result);

  ELSE

    l_result := new JSON_OBJECT_T;
    l_result.put('data_type', DBMS_TYPES_JSON_OBJECT);
    l_result.put('data_value', 'Not NULL');
    g_outputs.put(p_key, l_result);

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
  l_element JSON_ELEMENT_T;
  l_fully_qualified_key     VARCHAR2(1000);
  l_result  JSON_OBJECT_T;

BEGIN
  -- check if array is empty
  IF p_array.get_Size() = 0 THEN
    l_result := new JSON_OBJECT_T;
    l_result.put('data_type', DBMS_TYPES_JSON_ARRAY);
    l_result.put_Null('data_value');
    g_outputs.put(p_key, l_result);

  ELSE

    l_result := new JSON_OBJECT_T;
    l_result.put('data_type', DBMS_TYPES_JSON_ARRAY);
    l_result.put('data_value', 'Not NULL');
    g_outputs.put(p_key, l_result);

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


-- blurb
PROCEDURE log( p_type        IN SMALLINT,
               p_log_details IN server_test_logs.log_details%TYPE,
               p_log_detail  IN SMALLINT DEFAULT NO_DETAIL,
               p_pkg_body    IN LONG DEFAULT NULL )
IS
  PRAGMA AUTONOMOUS_TRANSACTION;
BEGIN

  CASE p_type
    WHEN DIAG THEN

      IF p_log_detail <= g_log_detail THEN
        --g_log_number := g_log_number + 1;

        IF p_pkg_body IS NULL THEN
          INSERT INTO server_test_logs VALUES
          ( testing_log_id_seq.nextval, p_log_details, null );
        ELSE
          INSERT INTO server_test_logs VALUES
          ( testing_log_id_seq.nextval, null, p_pkg_body );
        END IF;
      END IF; 

  END CASE;
  COMMIT;
END log;


-- =============================================================================
-- Name: update_test_status
-- ========================
--
-- Summary
-- =======
-- This routine updates the server_test_results entry for the currently executed 
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
PROCEDURE update_test_status(p_test_status       IN server_test_results.test_status%TYPE,
                             p_exception_code    IN server_test_results.exception_code%TYPE,
                             p_exception_message IN server_test_results.exception_message%TYPE,
                             p_compilation_excp  IN BOOLEAN DEFAULT FALSE)
IS
  PRAGMA AUTONOMOUS_TRANSACTION;
BEGIN

  IF p_compilation_excp
  THEN

    INSERT INTO server_test_results VALUES
    (g_current_functional_area, g_current_test_suite, -1, -1,
     'FAILED', p_exception_code, SUBSTR(p_exception_message,1,4000));

  ELSE

    INSERT INTO server_test_results VALUES
    (g_current_functional_area, g_current_test_suite, g_current_test_number, g_current_test_step.test_step,
     p_test_status, p_exception_code, SUBSTR(p_exception_message,1,4000));

  END IF;

  COMMIT;

END update_test_status;


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
PROCEDURE is_exception_expected(p_exception_code      IN  server_test_results.exception_code%TYPE,
                                p_exception_msg       IN  server_test_results.exception_message%TYPE,
                                p_exception_expected  OUT BOOLEAN)
IS
  l_source            VARCHAR2(7);
  l_exception_message VARCHAR2(200);
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

      IF l_source = 'outputs' THEN

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
--              - update server_test_results with a status of FAIL
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
PROCEDURE handle_exception(p_exception_code   IN server_test_results.exception_code%TYPE,
                           p_exception_msg    IN server_test_results.exception_message%TYPE,
                           p_raise_excp       IN BOOLEAN DEFAULT TRUE,
                           p_compilation_excp IN BOOLEAN DEFAULT FALSE) 
IS
  l_exception_expected BOOLEAN;
  l_output             JSON_OBJECT_T;
  l_exception_msg      VARCHAR2(1000);

BEGIN

  IF p_compilation_excp THEN
    update_test_status('FAILED', p_exception_code, p_exception_msg, TRUE);
    -- move on to the next functional area test suite
    RETURN;
  END IF;

  -- populate g_outputs with exception code
  l_output := new JSON_OBJECT_T;
  l_output.put('data_type', dbms_types.TYPECODE_NUMBER);
  l_output.put('data_value',p_exception_code);
  g_outputs.put('step' || g_current_test_step.test_step || '.exception_code', l_output );

  -- populate g_outputs with exception message
  l_output := new JSON_OBJECT_T;
  l_output.put('data_type', dbms_types.TYPECODE_VARCHAR2);
  l_output.put('data_value',p_exception_msg);
  g_outputs.put('step' || g_current_test_step.test_step || '.exception_msg', l_output );

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
    -- if currently processing operation - exit and move onto expectations
    IF g_expectation_index = -1 THEN
      RAISE_APPLICATION_ERROR(expected_operation_error, 'FATAL OPERATION ERROR - but expected');
    ELSE
      -- if currently processing expectations - move on to the next expectation
      RAISE_APPLICATION_ERROR(expected_expectation_error, 'FATAL EXPECTATION ERROR - but expected');
    END IF;

  ELSE
    -- unanticipated exception
    update_test_status('FAILED', p_exception_code, l_exception_msg);

    -- create assertion to highlight test failure
    l_exception_msg := g_current_functional_area || ' : ' || 'Suite ' || g_current_test_suite || ' : ' ||
                       'Test ' || g_current_test_number || ' : ' || 'Step ' || g_current_test_step.test_step || ' : ' ||
                       p_exception_msg;
    g_package_body := g_package_body ||
                      'ut.expect(' || '''' || p_exception_code || ':' || p_exception_msg || '''' || ',' || '''' || l_exception_msg || '''' || ')' ||
                      '.to_equal(' || '''' || 'Success' || '''' || ');' || CHR(10);

    IF g_current_functional_area = 'SEED_DATA' THEN
      RAISE_APPLICATION_ERROR(fatal_seed_data_error, 'FATAL SEED DATA ERROR - Testing cannot continue without successful seed data setup');
    END IF;

    IF p_raise_excp = TRUE THEN
      RAISE_APPLICATION_ERROR(fatal_test_error, 'FATAL TEST ERROR - Test cannot be completed');
    END IF;

  END IF;
END handle_exception;


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
  package_description server_tests.test_suite_desc%TYPE;
BEGIN

  -- determine suite description for reporting purposes
  SELECT test_suite_desc
    INTO package_description
    FROM server_tests
   WHERE functional_area = g_current_functional_area
     AND test_suite = g_current_test_suite
     and rownum = 1;

  g_current_package_name := 'AST_' || p_functional_area || '_Suite' || p_test_suite;

  g_package_spec := 'CREATE OR REPLACE PACKAGE ' || g_current_package_name || ' IS' || chr(10) ||
                    '--%suite(' || p_functional_area || ' - suite:' || p_test_suite || ' - ' || package_description  || ')' || chr(10) || chr(10);

  g_package_body := 'CREATE OR REPLACE PACKAGE BODY ' || g_current_package_name || ' IS' || chr(10);
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
PROCEDURE add_procedure_to_pkg
IS
  procedure_description server_tests.test_number_desc%TYPE;
BEGIN

  -- determine test description for reporting purposes
  SELECT test_number_desc
    INTO procedure_description
    FROM server_tests
   WHERE functional_area = g_current_functional_area
     AND test_suite = g_current_test_suite
     AND test_number = g_current_test_number
     and rownum = 1;

  g_package_spec := g_package_spec ||
                    '--%test(Test number:' || g_current_test_number || ': ' || procedure_description || ')' || chr(10) ||
                    'PROCEDURE test' || g_current_test_number || ';' || chr(10);

  g_package_body := g_package_body ||
                    'PROCEDURE test' || g_current_test_number || ' IS BEGIN' || chr(10);

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
BEGIN
  g_package_spec := g_package_spec || chr(10) || 'END;';
  g_package_body := g_package_body || chr(10) || 'BEGIN NULL; END;';

  log(DIAG, null, HIGH_DETAIL, g_package_body);
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
BEGIN
  g_package_body := g_package_body || 'NULL; END;' || chr(10);
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
PROCEDURE add_assertion_to_pkg( p_assertion IN JSON_OBJECT_T,
                                p_result    IN JSON_OBJECT_T)
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
  l_exception_message             VARCHAR2(200);
  l_expected_key                  VARCHAR2(1000);
  l_expected_object               JSON_OBJECT_T;
  l_assertion_msg                 VARCHAR2(200);

BEGIN
  g_current_assertion := g_current_assertion + 1;

  l_assertion_msg := g_current_functional_area || ' : ' || 'Suite ' || g_current_test_suite || ' : ' ||
                     'Test ' || g_current_test_number || ' : ' || 'Step ' || g_current_test_step.test_step || ' : ' ||
                     'Assertion ' || g_current_assertion;

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
    -- retrieve value from referenced test step (g_outputs)
    l_expected_key := p_assertion.get_Object('value').get_String('ref');
    l_expected_object := g_outputs.get_Object(l_expected_key);
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

  -- add assertion to package
  g_package_body := g_package_body || l_assertion || chr(10);

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
  l_exception_message  VARCHAR2(200);
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

      add_assertion_to_pkg( p_assertions.get_Object(l_result_column_name),
                            l_assertion_result );

    END LOOP;
  END LOOP;

EXCEPTION
  WHEN invalid_data_type_excp THEN
    handle_exception( SQLCODE, l_exception_message );
END add_assertions_to_pkg;


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
  l_exception_message VARCHAR2(200);
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
  IF NOT g_outputs.has(p_ref_object.get_String('ref')) THEN
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
  l_exception_message VARCHAR2(200);
  l_assertion_key     VARCHAR2(200);
  l_assertion_columns JSON_KEY_LIST;
  l_assertion         JSON_OBJECT_T;

BEGIN
log(DIAG, '------validating assertions', HIGH_DETAIL);

  IF NOT p_expectation.has('assertions') THEN
    l_exception_message := 'Missing assertions in expectation';
    RAISE_APPLICATION_ERROR(missing_e_assertions, l_exception_message);
  END IF;

  l_assertion_columns := p_expectation.get_Object('assertions').get_keys;
  FOR i IN 1..l_assertion_columns.COUNT() LOOP

    l_assertion_key := l_assertion_columns(i);
    IF p_source = 'outputs' THEN
      -- check entry exists in g_outputs
      IF NOT g_outputs.has(l_assertion_key) THEN
        l_exception_message := 'Value reference specified incorrectly for column (' || l_assertion_key || '). Check previous test steps have actually generated the required value';
        RAISE_APPLICATION_ERROR(invalid_a_ref, l_exception_message);
      END IF;
    END IF;

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
                            'be_null', 'be_not_null' );
    EXCEPTION
      WHEN NO_DATA_FOUND THEN
        l_exception_message := 'Invalid utPLSQL matcher specified in assertion';
        RAISE_APPLICATION_ERROR(invalid_matcher, l_exception_message);
    END;

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
log(DIAG, '------validated assertions', HIGH_DETAIL);
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
  l_key_name        VARCHAR2(50);
  l_var             VARCHAR2(1000);
  l_data_type       PLS_INTEGER;
  l_sql_inputs_keys JSON_KEY_LIST;

BEGIN
  log(DIAG,'Processing column values',HIGH_DETAIL);

  IF p_sql_inputs IS NOT NULL THEN

    l_sql_inputs_keys := p_sql_inputs.get_keys;
    FOR i IN 1..l_sql_inputs_keys.COUNT() 
    LOOP

      l_key_name := l_sql_inputs_keys(i);

      -- object denotes a value from a previous test step
      IF p_sql_inputs.get_Type(l_key_name) = 'OBJECT' THEN

        validate_reference_object(p_operation, l_key_name, p_sql_inputs.get_Object(l_key_name));
        l_var:= p_sql_inputs.get_Object(l_key_name).get_String('ref');

        l_data_type := g_outputs.get_Object(l_var).get_Number('data_type');

        CASE l_data_type
          WHEN dbms_types.TYPECODE_VARCHAR2 THEN
            p_sql_inputs.put(l_key_name, g_outputs.get_Object(l_var).get_String('data_value'));

          WHEN dbms_types.TYPECODE_NUMBER THEN
            p_sql_inputs.put(l_key_name, g_outputs.get_Object(l_var).get_Number('data_value'));

          WHEN dbms_types.TYPECODE_DATE THEN
            p_sql_inputs.put(l_key_name, to_char(g_outputs.get_Object(l_var).get_Date('data_value'), DATE_FORMAT) );

          WHEN DBMS_TYPES_BOOLEAN THEN
            p_sql_inputs.put(l_key_name, g_outputs.get_Object(l_var).get_Boolean('data_value'));

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
  log(DIAG,'Processed column values',HIGH_DETAIL);

END process_sql_inputs;


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
  l_source            VARCHAR2(7);
  l_table_name        VARCHAR2(30);
  l_exception_message VARCHAR2(200);
  l_result            JSON_OBJECT_T;
  l_output            JSON_ELEMENT_T;
  l_where             JSON_OBJECT_T;
  l_results           JSON_ARRAY_T;   
  l_assertion_keys    JSON_KEY_LIST;

  l_column_names      JSON_ARRAY_T;
  l_expectation_keys  JSON_KEY_LIST;
  
BEGIN
  log(DIAG, '------Processing expectation', HIGH_DETAIL);

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
    IF l_where IS NULL THEN
      l_exception_message := 'Missing WHERE clause in expectation';
      RAISE_APPLICATION_ERROR(missing_e_where, l_exception_message);
    END IF;

    process_sql_inputs('E', l_where);

  ELSIF l_source != 'outputs' THEN

    l_exception_message := 'Expectation source must be table or outputs';
    RAISE_APPLICATION_ERROR(invalid_e_source, l_exception_message);

  END IF;

  -- retrieve and validate assertions
  validate_assertions(p_expectation, l_source);

  -- construct array of required column names
  l_column_names := new JSON_ARRAY_T;
  l_expectation_keys := p_expectation.get_Object('assertions').get_keys;
  FOR i IN 1..l_expectation_keys.COUNT() LOOP
    l_column_names.append(l_expectation_keys(i));
  END LOOP;

  l_results := new JSON_ARRAY_T;
  IF l_source = 'table' THEN
 
    BEGIN
      pkg_dynamic_sql.select_row( l_table_name, 
                                  l_column_names,
                                  l_where,
                                  l_results);
    EXCEPTION
      WHEN OTHERS THEN

        IF SQLCODE = -20204 THEN
          -- handle exception with a context specific message
          handle_exception( SQLCODE, 'No row retrieved with which to evaluate assertions' );
        ELSE
          handle_exception( SQLCODE, 'Error selecting row: ' || SQLERRM );
        END IF;
    END;

  ELSE -- source = outputs
    l_assertion_keys := p_expectation.get_Object('assertions').get_keys;
    l_result := new JSON_OBJECT_T;
    FOR i IN 1..l_assertion_keys.COUNT LOOP
      l_output := g_outputs.get(l_assertion_keys(i));
      l_result.put(l_assertion_keys(i),l_output);
    END LOOP;
    l_results.append(l_result);

  END IF;

  add_assertions_to_pkg( p_expectation.get_Object('assertions'),
                         l_results );

  log(DIAG, '------Processed expectation', HIGH_DETAIL);

EXCEPTION
  WHEN missing_e_source_excp OR
       invalid_e_source_excp OR
       missing_e_table_name_excp OR  
       missing_e_where_excp
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
  log(DIAG, '------Processing expectations', HIGH_DETAIL);

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

  log(DIAG, '------Processed expectations', HIGH_DETAIL);
END process_expectations;


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
  l_table_name        VARCHAR2(30);
  l_exception_message VARCHAR2(200);
  l_where             JSON_OBJECT_T;

BEGIN
  log(DIAG,'Deleting row',HIGH_DETAIL);

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
    pkg_dynamic_sql.delete_row( l_table_name,
                                l_where );
  EXCEPTION
    WHEN OTHERS THEN
      handle_exception( SQLCODE, 'Error deleting row: ' || SQLERRM );
  END;

  log(DIAG,'Deleted row',HIGH_DETAIL);

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
  l_table_name        VARCHAR2(30);
  l_exception_message VARCHAR2(200);
  l_where             JSON_OBJECT_T;
  l_columns           JSON_OBJECT_T;

BEGIN
  log(DIAG,'Updating row',HIGH_DETAIL);

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
  IF l_where IS NULL THEN
    l_exception_message := 'WHERE clause not specified for UPDATE operation';
    RAISE_APPLICATION_ERROR(missing_u_where, l_exception_message);
  END IF;

  -- replace referenced values with the actual value eg. "step1.appn_row_id" -> 123456 
  process_sql_inputs('U', l_where);

  -- update the rows
  BEGIN
    pkg_dynamic_sql.update_row( l_table_name,
                                l_columns,
                                l_where,
                                g_site_id );
  EXCEPTION
    WHEN OTHERS THEN
      handle_exception( SQLCODE, 'Error updating row: ' || SQLERRM );
  END;

  log(DIAG,'Updated row',HIGH_DETAIL);

EXCEPTION
  WHEN missing_crud_table_name_excp OR
       missing_u_columns_excp OR
       missing_u_where_excp
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
-- For relevant tables, stores the generated appn_row_id in g_outputs for future 
-- reference by other test steps in this transaction
--
-- Parameters
-- ==========
-- p_operation: all details required to perform the operation
--
-- =============================================================================
PROCEDURE insert_row( p_operation IN JSON_OBJECT_T )
IS
  l_table_name        VARCHAR2(30);
  l_exception_message VARCHAR2(200);
  l_columns           JSON_OBJECT_T;
  l_new_ari           JSON_OBJECT_T;

BEGIN
  log(DIAG,'Inserting row',HIGH_DETAIL);

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
    l_new_ari := NULL;
    pkg_dynamic_sql.insert_row( l_table_name,
                                l_columns,
                                g_site_id,
                                l_new_ari );  -- returned if insert generates new appn_row_id
  EXCEPTION
    WHEN OTHERS THEN
      handle_exception( SQLCODE, 'Error inserting row: ' || SQLERRM );
  END;

  -- store generated appn_row_id in g_outputs for future reference by other test steps in this transaction
  IF l_new_ari IS NOT NULL THEN

    IF g_current_functional_area = 'SEED_DATA' THEN

      g_outputs.put('seed_data.' || g_current_test_step.test_suite || '.' 
                                 || g_current_test_step.test_number || '.' 
                                 || g_current_test_step.test_step || '.' 
                                 ||'appn_row_id', l_new_ari );
    ELSE
      g_outputs.put('step' || g_current_test_step.test_step || '.' || 'appn_row_id', l_new_ari );
    END IF;
  END IF;

  log(DIAG,'Inserted row',HIGH_DETAIL);

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
-- Any named parameters (input and output) are stored in g_outputs for future reference eg. "step1.param1"
-- A function return value is stored in g_outputs for future reference eg. "step1.function_name"
--
-- g_outputs : { "step1.routine_name" : {"data_type":<2|9|12>, "value":<numval|stringval|dateval> } }
--
--
-- Parameters
-- ==========
-- p_operation : all details required to perform the operation
--
-- =============================================================================
PROCEDURE call_routine( p_operation IN JSON_OBJECT_T )
IS
  l_package_name      VARCHAR2(30);
  l_routine_name      VARCHAR2(30);
  l_param_name        VARCHAR2(30);
  l_exception_message VARCHAR2(200);
  l_parameters        JSON_OBJECT_T;
  l_results           JSON_OBJECT_T;
  l_param_names       JSON_KEY_LIST;
  l_result            JSON_OBJECT_T;

BEGIN
  log(DIAG,'Calling routine',HIGH_DETAIL);

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
    pkg_dynamic_sql.call_routine( l_package_name,
                                  l_routine_name,
                                  l_parameters, 
                                  l_results );  
  EXCEPTION
    WHEN OTHERS THEN
      handle_exception( SQLCODE, 'Error calling routine: ' || SQLERRM );
  END;  

  -- store retrieved values in g_outputs for future reference by other test steps in this transaction
  IF l_results IS NOT NULL THEN

    l_param_names := l_results.get_keys;

    FOR i IN 1..l_param_names.COUNT LOOP
      l_param_name := l_param_names(i);
      l_result := l_results.get_Object(l_param_name);

      IF l_result.get_Number('data_type') = dbms_types.TYPECODE_CLOB
      THEN
        process_clob_as_json( l_param_name, l_result );
      ELSE
        g_outputs.put('step' || g_current_test_step.test_step || '.' || l_param_name, l_results.get(l_param_name));
      END IF;

    END LOOP;
  END IF;

  log(DIAG,'Called routine',HIGH_DETAIL);
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
-- Stores the selected column values in g_outputs for future 
-- reference by other test steps in this transaction
--
-- Parameters
-- ==========
-- p_operation: all details required to perform the operation
--
-- =============================================================================
PROCEDURE select_row( p_operation IN JSON_OBJECT_T )
IS
  l_table_name        VARCHAR2(30);
  l_column_name       VARCHAR2(30);
  l_exception_message VARCHAR2(200);
  l_where             JSON_OBJECT_T;
  l_columns           JSON_ARRAY_T;
  l_col_names         JSON_KEY_LIST;
  l_result            JSON_OBJECT_T;
  l_results           JSON_ARRAY_T;

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
  IF l_where IS NULL THEN
    l_exception_message := 'WHERE clause not specified for SELECT operation';
    RAISE_APPLICATION_ERROR(missing_s_where, l_exception_message);
  END IF;

  -- replace referenced values with the actual value eg. "step1.appn_row_id" -> 123456 
  process_sql_inputs('S', l_where);

  -- select the row
  l_results := new JSON_ARRAY_T;
  BEGIN
    pkg_dynamic_sql.select_row( l_table_name, 
                                l_columns,
                                l_where,
                                l_results);
  EXCEPTION
    WHEN OTHERS THEN

      IF SQLCODE = -20204 THEN
        -- handle exception with a context specific message
        handle_exception( SQLCODE, 'No row retrieved by select statement' );
      ELSE
        handle_exception( SQLCODE, 'Error selecting row: ' || SQLERRM );
      END IF;
  END;

  -- store retrieved values in g_outputs for future reference by other test steps in this transaction
  IF l_results IS NOT NULL THEN

    IF l_results.get_size() > 1 THEN
      l_exception_message := 'More than ONE row returned by SELECT operation';
      RAISE_APPLICATION_ERROR(too_many_s_rows, l_exception_message);
    END IF;

    l_result := treat(l_results.get(0) AS JSON_OBJECT_T);
    l_col_names := l_result.get_keys;
    FOR i IN 1..l_col_names.COUNT LOOP
      l_column_name := l_col_names(i);
      g_outputs.put('step' || g_current_test_step.test_step || '.' || l_column_name, l_result.get(l_column_name));
    END LOOP;
  END IF;

EXCEPTION
  WHEN missing_crud_table_name_excp OR
       missing_s_columns_excp OR
       missing_s_where_excp OR
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
  l_exception_message VARCHAR2(200);
  l_test_operation    JSON_OBJECT_T;

BEGIN
  log(DIAG, '------Performing operation', HIGH_DETAIL);

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
      ELSE 
        l_exception_message := 'Invalid operation specified [I, U, D, R, S]';
        RAISE_APPLICATION_ERROR(invalid_operation, l_exception_message);
    END CASE;
  END IF;

  log(DIAG, '------Performed operation', HIGH_DETAIL);

EXCEPTION
  WHEN missing_operation_excp OR 
       invalid_operation_excp 
  THEN
    handle_exception( SQLCODE, l_exception_message );

END process_operation;


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
  log(DIAG, '-----Executing test ' || g_current_test_step.test_number || ' step ' || g_current_test_step.test_step, HIGH_DETAIL);

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

  log(DIAG, '-----Executed test ' || g_current_test_step.test_number || ' step ' || g_current_test_step.test_step, HIGH_DETAIL);

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
-- i.e. server_tests.load_seed_data = Y
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
PROCEDURE load_seed_data
IS
  l_current_functional_area server_tests.functional_area%TYPE;
  l_current_test_suite      server_tests.test_suite%TYPE;
  l_current_test_number     server_tests.test_number%TYPE;
  l_current_test_step       server_tests%ROWTYPE;

BEGIN

  IF g_current_functional_area != 'SEED_DATA'
  THEN

    IF g_seed_data.FIRST IS NOT NULL
    THEN
      l_current_functional_area := g_current_functional_area;
      l_current_test_suite      := g_current_test_suite;
      l_current_test_number     := g_current_test_number;
      l_current_test_step       := g_current_test_step;

      g_current_functional_area := 'SEED_DATA';

      FOR i IN g_seed_data.FIRST..g_seed_data.LAST 
      LOOP
        g_current_test_step   := g_seed_data(i);
        g_current_test_suite  := g_current_test_step.test_suite;
        g_current_test_number := g_current_test_step.test_number;
        execute_test_step();
      END LOOP;

      g_current_functional_area := l_current_functional_area;
      g_current_test_suite      := l_current_test_suite;
      g_current_test_number     := l_current_test_number;
      g_current_test_step       := l_current_test_step;
    END IF;

  END IF;

EXCEPTION
  WHEN fatal_seed_data_error_excp THEN

    -- ensure the package code is finalised
    finalise_proc_code;
    finalise_pkg_code;
    create_pkg;

    RAISE;
END load_seed_data;


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
   ORDER BY test_step;

  l_first_step BOOLEAN := TRUE;
BEGIN

  -----------------------
  -- TRANSACTION START --
  -----------------------

  log(DIAG, '-----Executing test number ' || p_test_number, HIGH_DETAIL);

  -- note the test number currently being processed for future reference
  g_current_test_number := p_test_number;

  -- initialise object used to store test step outputs for future reference
  g_outputs := new JSON_OBJECT_T;

  -- add procedure that will execute all assertions for this test (multiple test steps) to package
  add_procedure_to_pkg();

  -- execute all test steps within this test
  FOR test_step IN test_steps LOOP

    -- note the test number currently being processed for future reference
    g_current_test_step := test_step;

    -- first entry defines if seed data is to be loaded
    IF l_first_step THEN
      l_first_step := FALSE;
      IF NVL(test_step.load_seed_data,'Y') = 'Y' THEN
        log(DIAG, '-----loading seed data ' || p_test_number, HIGH_DETAIL);
        load_seed_data();
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

  log(DIAG, '-----Executed test number ' || p_test_number, HIGH_DETAIL);
EXCEPTION

  WHEN fatal_test_error_excp THEN
    -- ensure the procedure code is completed correctly
    finalise_proc_code;

    -- fatal error so rollback transaction
    ROLLBACK; 

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
  l_exception_message VARCHAR2(200);

  CURSOR test_numbers IS
  SELECT DISTINCT test_number tn
    FROM server_tests
   WHERE functional_area = p_functional_area
     AND test_suite      = p_test_suite
   ORDER BY test_number;

BEGIN
  log(DIAG,'---Testing functional area suite' || p_test_suite, HIGH_DETAIL);

  -- note the functional area and test suite currently being processed for future reference
  g_current_functional_area := p_functional_area;
  g_current_test_suite := p_test_suite;

  -- create the initial code for the package that will be created to execute this test suite
  create_pkg_code( p_functional_area, p_test_suite );

  -- execute all tests within this suite
  l_num_tests := 0;
  FOR test_number IN test_numbers LOOP
    l_num_tests := l_num_tests + 1;
    execute_test_number( p_functional_area, p_test_suite, test_number.tn);
  END LOOP;

  -- handle possibility of no tests being defined for specified functional area and suite
  IF l_num_tests = 0 THEN
    l_exception_message := 'No tests defined for specified functional area and suite: ' || p_functional_area || ':' || p_test_suite;
    RAISE_APPLICATION_ERROR(invalid_suite, l_exception_message);
  END IF;

  -- finalise the code for the package that will be created to execute this test suite
  finalise_pkg_code;

  -- apply package to database
  create_pkg;

  -- invoke the package to execute the functional area test suite
  invoke_test_pkg;

  log(DIAG,'---Tested functional area suite ' || p_test_suite, HIGH_DETAIL);

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
  l_exception_message VARCHAR2(200);

  CURSOR functional_area_suites( p_functional_area IN server_tests.functional_area%TYPE ) IS
  SELECT DISTINCT test_suite ts
    FROM server_tests
   WHERE functional_area = p_functional_area
   ORDER BY test_suite;

BEGIN
  log(DIAG,'--Testing functional area ' || p_functional_area, HIGH_DETAIL);

  -- note the functional area currently being processed for future reference
  g_current_functional_area := p_functional_area;

  -- test all the suites of the specified functional area
  l_num_suites := 0;
  FOR functional_area_suite IN functional_area_suites( p_functional_area ) LOOP
    l_num_suites := l_num_suites + 1;
    test_functional_area_suite( p_functional_area, functional_area_suite.ts );
  END LOOP;

  -- handle possibility of no tests suites being defined for specified functional area
  IF l_num_suites = 0 THEN
    l_exception_message := 'No tests suites defined for specified functional area : ' || p_functional_area;
    RAISE_APPLICATION_ERROR(invalid_functional_area, l_exception_message);
  END IF;

  log(DIAG,'--Tested functional area ' || p_functional_area, HIGH_DETAIL);

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
  l_exception_message VARCHAR2(200);

  CURSOR functional_areas IS
  SELECT DISTINCT functional_area fa
    FROM server_tests
   WHERE functional_area != 'SEED_DATA';

BEGIN
  log(DIAG, '-Testing all functional areas', HIGH_DETAIL);

  -- test all functional areas
  l_num_fas := 0;
  FOR functional_area IN functional_areas LOOP
    l_num_fas := l_num_fas + 1;
    test_functional_area( functional_area.fa );
  END LOOP;

  -- handle possibility of no tests being defined
  IF l_num_fas = 0 THEN
    l_exception_message := 'No tests defined!';
    RAISE_APPLICATION_ERROR(invalid_test_run, l_exception_message);
  END IF;

  log(DIAG, '-Tested all functional areas', HIGH_DETAIL);

EXCEPTION
  WHEN invalid_test_run_excp THEN
    handle_exception( SQLCODE, l_exception_message );
END test_all_functional_areas;


-- =============================================================================
-- Name: retrieve_seed_data
-- ========================
--
-- Summary
-- =======
-- Retrieves any seed data setup steps i.e. functional_area = SEED_DATA.
-- These steps are stored in memory and executed prior to all test cases
-- to ensure prerequisite data is present in the database
--
-- =============================================================================
PROCEDURE retrieve_and_validate_seed_data
IS
BEGIN

  test_functional_area('SEED_DATA');

  SELECT * BULK COLLECT INTO g_seed_data
    FROM server_tests
   WHERE functional_area = 'SEED_DATA'
   ORDER BY test_suite, test_number, test_step;

END retrieve_and_validate_seed_data;


-- =============================================================================
-- Name: initialisation
-- ====================
--
-- Summary
-- =======
-- Ensure no test logs are present before performing tests
-- Initialise miscellaneous global variables
--
-- =============================================================================
PROCEDURE initialisation( p_site_id IN VARCHAR2 )
IS
BEGIN

  -- ensure no logs exist before performing testing
  DELETE FROM server_test_logs;
  DELETE FROM server_test_results;
  COMMIT;

  g_log_number              := 0;
  g_log_detail              := HIGH_DETAIL;
  g_primary_keys            := new JSON_OBJECT_T;
  g_column_types            := new JSON_OBJECT_T;
  g_current_functional_area := NULL;
  g_current_test_suite      := NULL;
  g_current_test_number     := NULL;
  g_current_test_step       := NULL;
  g_site_id                 := p_site_id;
  g_seed_data.DELETE;

  retrieve_and_validate_seed_data();

END initialisation;


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
