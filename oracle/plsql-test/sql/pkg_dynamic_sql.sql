-- -----------------------------------------------------------------------------
--
--              Copyright (c) ADB SAFEGATE Airport Systems UK Ltd 2020 
--                            All rights reserved
--
-- -----------------------------------------------------------------------------
--            
-- Subsystem Name:   Automated Server Testing Framework
-- Module Name:      Dynamic sql processing       
-- Original Author:  Steve Lambert                
--
-- -----------------------------------------------------------------------------
--
-- Description
-- -----------
-- Provides a set of routines that take various JSON objects as input and dynamically
-- executes the SQL statements that this JSON represents.
-- See individual routines for further details
--
--
-- Design Notes
-- ------------
-- Initially created to support the Automated Testing Framework (pkg_server_testing)
--
-- But designed to be loosely coupled to this so is more generally usable
--
-- Accepts only standard JSON elements as input (for the moment) as opposed to
-- programatically constructed JSON including non standard data types e.g. date objects
--
-- All individual results (i.e. column and parameter values are returned as a JSON object
-- Output values include non standard JSON elements (e.g. dates) along with an indication of
-- data type so caller doesn't need to programatically determine the type.
-- These objects take the following form: {"column_or_function_or_parameter_name": {"data_value":*1, data_type:*2}}
-- where *1 is a JSON element and *2 is a PLS_INTEGER representing the data type
-- *2 values are based on dbms_types.TYPECODE_* values: TYPECODE_VARCHAR2  : 9;
--                                                      TYPECODE_NUMBER    : 2;
--                                                      TYPECODE_DATE      : 12;
-- No equivalent for Booleans so global constant used   DBMS_TYPES_BOOLEAN : 0;
--
--
-- Modification History
-- --------------------
-- AIMS-3460 - Steve Lambert - 03/06/20 - Initial revision.
-- AIMS-3676 - Steve Lambert - 09/07/20 - Implement SELECT functionality to enable
--                                        framework to make available any database data
--                                        to subsequent test steps
-- AIMS-3805 - Steve Lambert - 29/09/20 - Implement today and now date functionality
-- AIMS-3957 - Steve Lambert - 01/10/29 - Prefix all generated packages with AST_
-- AIMS-4076 - Steve Lambert - 06/11/20 - Handle CLOBs representing JSON for routine parameters
-- AIMS-4039 - Steve Lambert - 22/10/20 - Implement seed data functionality
-- -----------------------------------------------------------------------------

CREATE OR REPLACE PACKAGE BODY 
-- Identifier: AIMS-4039

pkg_dynamic_sql
IS
  -- global constants
  DATE_FORMAT        CONSTANT VARCHAR2(20) := 'YYYY-MM-DD"T"HH24:MI';
  DAY_FORMAT         CONSTANT VARCHAR2(10) := 'YYYY-MM-DD';
  DBMS_TYPES_BOOLEAN CONSTANT PLS_INTEGER := 0;

  -- global variables
  g_column_types     JSON_OBJECT_T;

  -- application exceptions
  unknown_column_type      CONSTANT NUMBER := -20201;
  unknown_column_type_excp EXCEPTION;
  PRAGMA EXCEPTION_INIT(unknown_column_type_excp, unknown_column_type);

  unsupported_data_type      CONSTANT NUMBER := -20202;
  unsupported_data_type_excp EXCEPTION;
  PRAGMA EXCEPTION_INIT(unsupported_data_type_excp, unsupported_data_type);

  unsupported_bind_type      CONSTANT NUMBER := -20203;
  unsupported_bind_type_excp EXCEPTION;
  PRAGMA EXCEPTION_INIT(unsupported_bind_type_excp, unsupported_bind_type);

  no_rows_selected CONSTANT NUMBER := -20204;
  no_rows_selected_excp EXCEPTION;
  PRAGMA EXCEPTION_INIT(no_rows_selected_excp, no_rows_selected);

  expected_parameter CONSTANT NUMBER := -20205;
  expected_parameter_excp EXCEPTION;
  PRAGMA EXCEPTION_INIT(expected_parameter_excp, expected_parameter);

  table_not_specified CONSTANT NUMBER := -20206;
  table_not_specified_excp EXCEPTION;
  PRAGMA EXCEPTION_INIT(table_not_specified_excp, table_not_specified);

  columns_not_specified CONSTANT NUMBER := -20207;
  columns_not_specified_excp EXCEPTION;
  PRAGMA EXCEPTION_INIT(columns_not_specified_excp, columns_not_specified);

  where_not_specified CONSTANT NUMBER := -20208;
  where_not_specified_excp EXCEPTION;
  PRAGMA EXCEPTION_INIT(where_not_specified_excp, where_not_specified);

  routine_not_specified CONSTANT NUMBER := -20209;
  routine_not_specified_excp EXCEPTION;
  PRAGMA EXCEPTION_INIT(routine_not_specified_excp, routine_not_specified);

  invalid_date_format CONSTANT NUMBER := -20210;
  invalid_date_format_excp EXCEPTION;
  PRAGMA EXCEPTION_INIT(invalid_date_format_excp, invalid_date_format);

-- =============================================================================
-- Name: table_has_column
-- ======================
--
-- Summary
-- =======
-- Determines if a table has a specified column
--
-- Parameters
-- ==========
-- p_table_name : Name of a table in question
--
-- =============================================================================
FUNCTION table_has_column( p_table_name  IN  user_tab_cols.table_name%TYPE,
                           p_column_name IN user_tab_cols.column_name%TYPE )
RETURN BOOLEAN
IS
  l_dummy   SMALLINT;
  l_has_col BOOLEAN := TRUE;
BEGIN

  BEGIN
    SELECT 1 INTO l_DUMMY
      FROM user_tab_cols
     WHERE table_name  = UPPER(p_table_name)
       AND column_name = UPPER(p_column_name)
       AND ROWNUM = 1;
  EXCEPTION
    WHEN NO_DATA_FOUND THEN
      l_has_col := FALSE;
  END;

  RETURN l_has_col;
END table_has_column;


-- =============================================================================
-- Name: get_param_value
-- =====================
--
-- Summary
-- =======
-- Determines the value of a parameter of a dynamically called function
-- or procedure
--
-- Parameters
-- ==========
-- p_cursor       : Currently open cursor
-- p_parameters   : JSON array detailing routine parameters
-- p_param_name   : Name of parameter for which value is being determined
-- p_param_in_out : Type of parameter
-- p_data_type    : Data type of parameter
-- p_position     : Position of parameter in parameter list
-- p_results      : Value and type of requested parameter
-- =============================================================================
PROCEDURE get_param_value(p_cursor       IN     SMALLINT,
                          p_parameters   IN     JSON_OBJECT_T,
                          p_param_name   IN     VARCHAR2,
                          p_param_in_out IN     VARCHAR2,
                          p_data_type    IN     PLS_INTEGER,
                          p_position     IN     SMALLINT,
                          p_results      IN OUT JSON_OBJECT_T)
IS
  l_number_value  NUMBER;
  l_string_value  VARCHAR2(32767);
  l_date_value    DATE;
  l_boolean_value BOOLEAN;
  l_clob_value    CLOB;
  l_result        JSON_OBJECT_T;

BEGIN
  l_result := new JSON_OBJECT_T;

  CASE p_data_type

    WHEN dbms_types.TYPECODE_VARCHAR2
    THEN
      l_result.put('data_type',dbms_types.TYPECODE_VARCHAR2);
      IF p_param_in_out = 'IN' THEN
        -- value is what was passed to routine
        l_string_value := p_parameters.get_String(p_param_name);
      ELSE
        -- value is a result of statement execution
        dbms_sql.variable_value(p_cursor, ':bv' || p_position, l_string_value);
      END IF;
      l_result.put('data_value', l_string_value);
      p_results.put(p_param_name, l_result);

    WHEN dbms_types.TYPECODE_NUMBER
    THEN
      l_result.put('data_type',dbms_types.TYPECODE_NUMBER);
      IF p_param_in_out = 'IN' THEN
        -- value is what was passed to routine
        l_number_value := p_parameters.get_Number(p_param_name);
      ELSE
        -- value is a result of statement execution
        dbms_sql.variable_value(p_cursor, ':bv' || p_position, l_number_value);
      END IF;
      l_result.put('data_value', l_number_value);
      p_results.put(p_param_name, l_result);


    WHEN dbms_types.TYPECODE_DATE
    THEN
      l_result.put('data_type',dbms_types.TYPECODE_DATE);
      IF p_param_in_out = 'IN' THEN
        -- value is what was passed to routine
        l_date_value := determine_date_from_json( p_parameters.get_String(p_param_name) );
      ELSE
        -- value is a result of statement execution
        dbms_sql.variable_value(p_cursor, ':bv' || p_position, l_date_value);
      END IF;
      l_result.put('data_value', l_date_value);
      p_results.put(p_param_name, l_result);


    WHEN DBMS_TYPES_BOOLEAN 
    THEN
      l_result.put('data_type', DBMS_TYPES_BOOLEAN);
      IF p_param_in_out = 'IN' THEN
        -- value is what was passed to routine
        l_boolean_value := p_parameters.get_Boolean(p_param_name);
      ELSE
        -- value is a result of statement execution
        dbms_sql.variable_value(p_cursor, ':bv' || p_position, l_boolean_value);
      END IF;
      l_result.put('data_value', l_boolean_value);
      p_results.put(p_param_name, l_result);


    WHEN dbms_types.TYPECODE_CLOB 
    THEN
      l_result.put('data_type', dbms_types.TYPECODE_CLOB);
      IF p_param_in_out = 'IN' THEN
        -- value is what was passed to routine
        l_clob_value := p_parameters.get_String(p_param_name);
      ELSE
        -- value is a result of statement execution
        dbms_sql.variable_value(p_cursor, ':bv' || p_position, l_clob_value);
      END IF;
      l_result.put('data_value', l_clob_value);
      p_results.put(p_param_name, l_result);

    ELSE
      RAISE_APPLICATION_ERROR(unsupported_data_type, 'Parameter ' || p_param_name || ' has an unsupported data type: ' || p_data_type);

  END CASE;
END;


-- =============================================================================
-- Name: get_output_param_values
-- =============================
--
-- Summary
-- =======
-- Determines the values of the parameters of a dynamically called function
-- or procedure
-- Note that the parameter types are determined from user_arguments table and not
-- describe_columns2 for a select statement. For now, VARCHAR2, VARCHAR and CHAR
-- will be treated as VARCHAR2
--
-- Parameters
-- ==========
-- p_cursor       : Currently open cursor
-- p_package_name : The name of the package being dynamically called
-- p_routine_name : The name of the routine being dynamically called 
-- p_parameters   : JSON object representing the parameter details e.g.
--                  {"PIN1":1,     "PIN2":"A", "PIN3":"1967-06-13", "PIN4":true, "PIN5":null,
--                   "POUT1":null, "POUT2":"", "POUT3":null,        "POUT4":"",  "POUT5":null}      
-- p_results      : JSON object detailing the parameter and return values of a 
--                  dynamically invoked function or procedure
--
-- =============================================================================
PROCEDURE get_output_param_values(p_cursor       IN  SMALLINT,
                                  p_package_name IN  VARCHAR2,
                                  p_routine_name IN  VARCHAR2,
                                  p_parameters   IN  JSON_OBJECT_T,
                                  p_results      OUT JSON_OBJECT_T)
IS
  
  CURSOR routine_parameters IS
  SELECT NVL(argument_name, p_routine_name) param_name,
         position,
         data_type,
         in_out
    FROM user_arguments
   WHERE NVL(package_name,'-1') = NVL(UPPER(p_package_name),'-1')
     AND object_name = UPPER(p_routine_name)
   ORDER BY position ASC;

  l_param_name   VARCHAR2(30);
  l_param_names  JSON_KEY_LIST;

BEGIN

  IF p_parameters IS NOT NULL THEN
    l_param_names := p_parameters.get_keys;
  END IF;

  -- initialise output results
  p_results := new JSON_OBJECT_T;

  FOR param IN routine_parameters
  LOOP
    IF param.position = 0 THEN
      l_param_name := p_routine_name;
    ELSE
      l_param_name := l_param_names(param.position);
    END IF;

    CASE 
      WHEN param.data_type = 'VARCHAR2' OR
           param.data_type = 'VARCHAR' OR
           param.data_type = 'CHAR'
      THEN
        get_param_value( p_cursor, p_parameters, l_param_name, param.in_out, dbms_types.TYPECODE_VARCHAR2, param.position, p_results );

      WHEN param.data_type = 'NUMBER' OR
           param.data_type = 'FLOAT'
      THEN
        get_param_value( p_cursor, p_parameters, l_param_name, param.in_out, dbms_types.TYPECODE_NUMBER, param.position, p_results );

      WHEN param.data_type = 'DATE'
      THEN
        get_param_value( p_cursor, p_parameters, l_param_name, param.in_out, dbms_types.TYPECODE_DATE, param.position, p_results );

      WHEN param.data_type = 'PL/SQL BOOLEAN'
      THEN
        get_param_value( p_cursor, p_parameters, l_param_name, param.in_out, DBMS_TYPES_BOOLEAN, param.position, p_results );

      WHEN param.data_type = 'CLOB'
      THEN
        get_param_value( p_cursor, p_parameters, l_param_name, param.in_out, dbms_types.TYPECODE_CLOB, param.position, p_results );

      ELSE
        RAISE_APPLICATION_ERROR(unsupported_data_type, 'Parameter ' || param.param_name || ' has an unsupported data type: ' || param.data_type); 
    END CASE;
  END LOOP;
END get_output_param_values;


-- =============================================================================
-- Name: construct_call_string
-- ===========================
--
-- Summary
-- =======
-- Constructs the SQL string, including bind variables that will be parsed
-- for dynamic invokation of a package
--
-- Parameters
-- ==========
-- p_package_name : Name of package to be invoked
-- p_routine_name : Name of routine to be invoked
--
-- =============================================================================
FUNCTION construct_call_string( p_package_name IN VARCHAR2,
                                p_routine_name IN VARCHAR2)
RETURN VARCHAR2
IS
  l_sql         VARCHAR2(4000);
  l_is_function VARCHAR2(1);
  l_object_type user_procedures.object_type%TYPE;

  CURSOR routine_parameters IS
  SELECT position
    FROM user_arguments
   WHERE NVL(package_name,'-1') = NVL(UPPER(p_package_name),'-1')
     AND object_name = UPPER(p_routine_name)
     AND position != 0  -- reserved for function return value
   ORDER BY position ASC;

BEGIN

  -- use DATA DICTIONARY as driver
  l_sql := 'BEGIN ';

  IF p_package_name IS NOT NULL THEN  -- routine is part of a package
    
    -- packaged routines not in all_objects
    -- packaged routines show as object_type = PACKAGE in user_procedures
    -- So, need to look at user_arguments to distinguish between function and procedure
    BEGIN
      SELECT 'Y'
        INTO l_is_function
        FROM user_arguments
       WHERE NVL(package_name,'-1') = NVL(UPPER(p_package_name),'-1')
         AND object_name = UPPER(p_routine_name)
         AND position = 0;  -- return value of function
    EXCEPTION
      WHEN NO_DATA_FOUND THEN
        l_is_function := 'N';
    END;

    IF l_is_function = 'Y' THEN
      l_sql := l_sql || ':bv0 := ' || p_package_name || '.' || p_routine_name || '(';
    ELSE
      l_sql := l_sql || p_package_name || '.' || p_routine_name || '(';
    END IF;

  ELSE  -- routine is standalone
      
    -- determine if procedure or function
    SELECT object_type
      INTO l_object_type
      FROM user_procedures
     WHERE object_name = UPPER(p_routine_name);
    
    CASE l_object_type
      WHEN 'FUNCTION' THEN
        l_sql := l_sql || ':bv0 := ' || p_routine_name || '(';
      WHEN 'PROCEDURE' THEN
        l_sql := l_sql || p_routine_name || '(';
      ELSE
        NULL;
    END CASE;

  END IF;

  -- add parameters
  FOR routine_parameter IN routine_parameters
  LOOP
    l_sql := l_sql || ':bv' || routine_parameter.position || ','; 
  END LOOP;

  IF substr( l_sql, length(l_sql),1 ) = ',' THEN
    l_sql := substr(l_sql,1,length(l_sql)-1) || ');end;';
  ELSE
    l_sql := l_sql || ');end;';
  END IF;

  RETURN l_sql;
END construct_call_string;


-- =============================================================================
-- Name: get_column_data_type
-- ==========================
--
-- Summary
-- =======
-- Determines the data type of a database column
-- For efficiency reasons, each column will only be selected from the database once
-- and stored in g_column_types
--
-- Parameters
-- ==========
-- p_table_name  : Database table name
-- p_column_name : Database column name
--
-- Return value
-- ============
-- VARCHAR2 | VARCHAR | CHAR | NUMBER | FLOAT | DATE
-- =============================================================================
FUNCTION get_column_data_type( p_table_name  IN user_tab_cols.table_name%TYPE,
                               p_column_name IN user_tab_cols.column_name%TYPE)
RETURN VARCHAR2
IS
  l_key       VARCHAR2(50);
  l_data_type user_tab_cols.data_type%TYPE;

BEGIN

  l_key := p_table_name || '.' || p_column_name;
  IF g_column_types.has(l_key) THEN
    l_data_type := g_column_types.get_String(l_key);
  ELSE

    BEGIN
      SELECT data_type INTO l_data_type  
        FROM user_tab_cols
       WHERE table_name = UPPER(p_table_name)
         AND column_name = UPPER(p_column_name)
         AND ROWNUM = 1;
    EXCEPTION
      WHEN NO_DATA_FOUND THEN
        RAISE_APPLICATION_ERROR(unknown_column_type, 'Unable to determine data type of ' || p_table_name || '.' || p_column_name);
    END;

    g_column_types.put(l_key,l_data_type);
  END IF;

  RETURN l_data_type;
END get_column_data_type;


-- =============================================================================
-- Name: describe_columns
-- ======================
--
-- Summary
-- =======
-- Determines the details of the columns in a SQL statement
--
-- Parameters
-- ==========
-- p_cursor      : Currently open cursor
-- p_col_details : JSON object detailing column details of a SQL statement
-- p_col_count   : The number of columns featured in a SQL statement
--
-- =============================================================================
PROCEDURE describe_columns( p_cursor      IN  SMALLINT,
                            p_col_details OUT dbms_sql.desc_tab2,
                            p_col_count   OUT INTEGER )
IS
  l_col_type  PLS_INTEGER;
  l_date      DATE;
  l_number    NUMBER;
  l_varchar2  VARCHAR2(4000);

BEGIN
  dbms_sql.describe_columns2(p_cursor, p_col_count, p_col_details);
  FOR i IN 1..p_col_count LOOP
    l_col_type := p_col_details(i).col_type;

    CASE
      WHEN l_col_type = dbms_types.TYPECODE_VARCHAR2 OR
           l_col_type = dbms_types.TYPECODE_VARCHAR OR
           l_col_type = dbms_types.TYPECODE_CHAR
      THEN
        -- define output value as a VARCHAR2
        dbms_sql.define_column(p_cursor, i, l_varchar2, 4000);

      WHEN l_col_type = dbms_types.TYPECODE_NUMBER
      THEN
        -- define output value as a NUMBER
        dbms_sql.define_column(p_cursor, i, l_number);

      WHEN l_col_type = dbms_types.TYPECODE_DATE
      THEN
        -- define output value as a DATE
        dbms_sql.define_column(p_cursor, i, l_date);

      ELSE
        RAISE_APPLICATION_ERROR(unsupported_data_type, 'Selected column ' || p_col_details(i).col_name || ' has an unsupported data type: ' || l_col_type);
    END CASE;

  END LOOP;
END describe_columns;


-- =============================================================================
-- Name: determine_date_from_json
-- ==============================
--
-- Summary
-- =======
-- Determines an actual date from the user specified date string
-- The supported json formats are:
--
-- - YYYY-MM-DD"T"HH24:MI : specify a date in ISO8601 format             e.g. 2020-09-29T02:30
-- - YYYY-MM-DD           : specify a truncated date in ISO8601 format   e.g. 2020-09-29
-- - today                : specify truncated dbtime i.e today's date    e.g. today
-- - todayTHH24:MI        : specify a time today                         e.g. todayT02:30
-- - today[+|-]n          : specify an offset in days [n=1-99]           e.g. today+31
-- - today[+|-]DD:HH24:MI : specify an offset in days, hours and mins    e.g. today-31:23:59
-- - now                  : specify non truncated dbtime                 e.g. now
-- - now[+|-]n            : specify an offset in days [n=1-99]           e.g. now+31
-- - now[+|-]DD:HH24:MI   : specify an offset in days, hours and mins    e.g. now-31:23:59

-- Parameters
-- ==========
-- p_json_date_string : date as a string in one of supported json formats

--
-- =============================================================================
FUNCTION determine_date_from_json( p_json_date_string IN VARCHAR2 ) RETURN DATE
IS
  l_today_string   VARCHAR2(10);
  l_now_string     VARCHAR2(20);
  l_date_string    VARCHAR2(20);
  l_modifier       VARCHAR2(1);
  l_today          DATE;
  l_now            DATE;
  l_date           DATE;
  l_days           INTEGER;
  l_hours          INTEGER;
  l_minutes        INTEGER;
  l_offset_in_days NUMBER;
BEGIN

  l_today := TRUNC(pkg73_get_timedate.f73_get_db_time);
  l_now := pkg73_get_timedate.f73_get_db_time;
  l_today_string := TO_CHAR(l_today, DAY_FORMAT);
  l_now_string   := TO_CHAR(l_now, DATE_FORMAT);

  IF regexp_like(p_json_date_string, '^today$') THEN  -- truncated dbtime i.e today's date

    l_date := l_today;

  ELSIF regexp_like(p_json_date_string, '^todayT(([01][0-9])|(2[0-3]))[:][0-5][0-9]$') THEN  -- a time today e.g. todayT02:30

    l_date_string := l_today_string || substr(p_json_date_string,6,6);
    l_date := TO_DATE(l_date_string, DATE_FORMAT);

  ELSIF regexp_like(p_json_date_string, '^today[\+-]([1-9]|([1-9][0-9]))$') THEN  -- an offset in days e.g. today+31

    l_modifier := SUBSTR(p_json_date_string,6,1);

    CASE l_modifier
      WHEN '+' THEN
        l_date := l_today + substr(p_json_date_string,7, length(p_json_date_string)-6);
      WHEN '-' THEN
        l_date := l_today - substr(p_json_date_string,7, length(p_json_date_string)-6);
      ELSE
        NULL; 
    END CASE;
    
  ELSIF regexp_like(p_json_date_string, '^today[\+-][0-9][0-9][:](([01][0-9])|(2[0-3]))[:][0-5][0-9]$') THEN  -- an offset in days, hours and mins e.g. today-31:23:59 

    l_modifier       := SUBSTR(p_json_date_string,6,1);
    l_days           := TO_NUMBER( SUBSTR(p_json_date_string,7,2) );
    l_hours          := TO_NUMBER( SUBSTR(p_json_date_string,10,2) );
    l_minutes        := TO_NUMBER( SUBSTR(p_json_date_string,13,2) );
    l_offset_in_days := l_days + (l_hours/24) + (l_minutes/1440);

    CASE l_modifier
      WHEN '+' THEN
        l_date := l_today + l_offset_in_days;
      WHEN '-' THEN
        l_date := l_today - l_offset_in_days;
      ELSE
        NULL; 
    END CASE;

  ELSIF regexp_like(p_json_date_string, '^now$') THEN  -- non truncated dbtime

    l_date := l_now;

  ELSIF regexp_like(p_json_date_string, '^now[\+-]([1-9]|([1-9][0-9]))$') THEN  -- an offset in days e.g. now+31

    l_modifier := SUBSTR(p_json_date_string,4,1);

    CASE l_modifier
      WHEN '+' THEN
        l_date := l_now + substr(p_json_date_string,5, length(p_json_date_string)-4);
      WHEN '-' THEN
        l_date := l_now - substr(p_json_date_string,5, length(p_json_date_string)-4);
      ELSE
        NULL; 
    END CASE;

  ELSIF regexp_like(p_json_date_string, '^now[\+-][0-9][0-9][:](([01][0-9])|(2[0-3]))[:][0-5][0-9]$') THEN  -- an offset in days, hours and mins e.g. now-31:23:59 

    l_modifier       := SUBSTR(p_json_date_string,4,1);
    l_days           := TO_NUMBER( SUBSTR(p_json_date_string,5,2) );
    l_hours          := TO_NUMBER( SUBSTR(p_json_date_string,8,2) );
    l_minutes        := TO_NUMBER( SUBSTR(p_json_date_string,11,2) );
    l_offset_in_days := l_days + (l_hours/24) + (l_minutes/1440);

    CASE l_modifier
      WHEN '+' THEN
        l_date := l_now + l_offset_in_days;
      WHEN '-' THEN
        l_date := l_now - l_offset_in_days;
      ELSE
        NULL; 
    END CASE;

  ELSE  -- user specified date string in ISO8601 format

    -- validate the format of the date string
    BEGIN
      SELECT TO_DATE(p_json_date_string, DATE_FORMAT)
        INTO l_date
        FROM dual;
    EXCEPTION
      WHEN OTHERS THEN
        RAISE_APPLICATION_ERROR(invalid_date_format, p_json_date_string  || ' is an invalid date format');
    END;

  END IF;

  RETURN l_date;
END;


-- =============================================================================
-- Name: bind_param_variables
-- ==========================
--
-- Summary
-- =======
-- Binds values to all bind variables in a SQL string representing a dynamic call
-- to a package
--
-- Parameters
-- ==========
-- p_cursor       : Currently open cursor
-- p_package_name : The name of the package to be invoked
-- p_routine_name : The name of the routine to be invoked
-- p_parameters   : JSON object detailing the routine parameters
--                 {"PIN1":1, "PIN2":"A", "PIN3":"1967-06-13", "POUT1":0, "POUT2":"", "POUT3":""}
-- =============================================================================
PROCEDURE bind_param_variables(p_cursor       IN OUT SMALLINT,
                               p_package_name IN VARCHAR2,
                               p_routine_name IN VARCHAR2,
                               p_parameters   IN OUT JSON_OBJECT_T)
IS

  l_number_value  NUMBER;
  l_string_value  VARCHAR2(32767);
  l_date_value    DATE;
  l_boolean_value BOOLEAN;
  l_clob_value    CLOB;
  l_param_names   JSON_KEY_LIST;

  CURSOR routine_parameters IS
  SELECT argument_name,
         position,
         data_type,
         in_out
    FROM user_arguments
   WHERE NVL(package_name,'-1') = NVL(UPPER(p_package_name),'-1')
     AND object_name = UPPER(p_routine_name)
   ORDER BY position ASC;

BEGIN
  -- routine may have no parameters but a function will still have entry in user_arguments for return value
  IF p_parameters IS NOT NULL THEN
    l_param_names := p_parameters.get_keys;
  END IF;

  FOR param IN routine_parameters LOOP

    CASE 
      WHEN param.data_type = 'VARCHAR2' OR
           param.data_type = 'VARCHAR' OR
           param.data_type = 'CHAR' THEN

        IF param.position = 0 THEN  -- output return value
          dbms_sql.bind_variable(p_cursor, ':bv0', l_string_value, 32767);
        ELSE 
          l_string_value := p_parameters.get_String(l_param_names(param.position));
          dbms_sql.bind_variable(p_cursor, ':bv' || param.position, l_string_value, 32767);
        END IF;

      WHEN param.data_type = 'NUMBER' OR
           param.data_type = 'FLOAT'
      THEN

        IF param.position = 0 THEN  -- output return value
          dbms_sql.bind_variable(p_cursor, ':bv0', l_number_value);
        ELSE 
          l_number_value := p_parameters.get_Number(l_param_names(param.position));
          dbms_sql.bind_variable(p_cursor, ':bv' || param.position, l_number_value);
        END IF;

      WHEN param.data_type = 'DATE' THEN

        IF param.position = 0 THEN  -- output return value
          dbms_sql.bind_variable(p_cursor, ':bv0', l_date_value);
        ELSE  
          l_string_value := p_parameters.get_String(l_param_names(param.position));
          l_date_value := determine_date_from_json(l_string_value);
          dbms_sql.bind_variable(p_cursor, ':bv' || param.position, l_date_value);
        END IF;

      WHEN param.data_type = 'PL/SQL BOOLEAN'
      THEN

        IF param.position = 0 THEN  -- output return value
          dbms_sql.bind_variable(p_cursor, ':bv0', l_boolean_value);
        ELSE 
          l_boolean_value := p_parameters.get_Boolean(l_param_names(param.position));
          dbms_sql.bind_variable(p_cursor, ':bv' || param.position, l_boolean_value);
        END IF;

      WHEN param.data_type = 'CLOB'
      THEN
        IF param.position = 0 THEN  -- output return value
          dbms_sql.bind_variable(p_cursor, ':bv0', l_clob_value);
        ELSE 
          l_clob_value := p_parameters.get_String(l_param_names(param.position));
          dbms_sql.bind_variable(p_cursor, ':bv' || param.position, l_clob_value);
        END IF;

      ELSE
        RAISE_APPLICATION_ERROR(unsupported_bind_type, 'Parameter ' || l_param_names(param.position) || ' has an unsupported data type: ' || param.data_type);
    END CASE; 
  END LOOP;
EXCEPTION
  WHEN OTHERS THEN
    IF dbms_sql.is_open(p_cursor) THEN
      dbms_sql.close_cursor(p_cursor);
    END IF;
    RAISE_APPLICATION_ERROR(expected_parameter, 'Missing or incorrectly specified parameters for routine call'); 

END bind_param_variables;


-- =============================================================================
-- Name: bind_column_variables
-- ===========================
--
-- Summary
-- =======
-- Binds values to all bind variables in a SQL string representing a dynamic SQL command
-- Needs to first determine the data type of each column from the data dictionary
--
-- Parameters
-- ==========
-- p_cursor          : Currently open cursor
-- p_table_name      : Database table name
-- p_columns         : JSON object detailing the columns in a SQL statement
--                     { "name_of_col1" : <numval|stringval|null>,
--                       "name_of_col2" : <numval|stringval|null> }
-- p_bind_var_offset : Used so this routine can be invoked multiple times for one
--                     SQL statement. e.g. SET and WHERE clauses of an Update statement
-- p_new_ari         : Newly generated APPN_ROW_ID for appropriate tables
--
-- =============================================================================
PROCEDURE bind_column_variables( p_cursor          IN SMALLINT,
                                 p_table_name      IN VARCHAR2,
                                 p_columns         IN JSON_OBJECT_T,
                                 p_bind_var_offset IN SMALLINT,
                                 p_new_ari         IN BOOLEAN DEFAULT FALSE )
IS
  l_date_string    VARCHAR2(19);
  l_date           DATE;
  l_new_ari        NUMBER(18);
  l_data_type      user_tab_cols.data_type%TYPE;
  l_column_names   JSON_KEY_LIST;

  l_dummy smallint;

BEGIN

  IF p_columns IS NOT NULL
  THEN
    l_column_names   := p_columns.get_keys;      -- eg ["appn_row_id", "flt", "pax"]

    FOR i IN 1..l_column_names.COUNT LOOP

      l_data_type := get_column_data_type(p_table_name, l_column_names(i));

      CASE 
        WHEN l_data_type = 'VARCHAR2' OR
             l_data_type = 'VARCHAR' OR
             l_data_type = 'CHAR'
        THEN 
          dbms_sql.bind_variable(p_cursor, ':bv' || (i+p_bind_var_offset), p_columns.get_String(l_column_names(i)));
          testing_log(':bv' || (i+p_bind_var_offset) || ' bound to string : ' || p_columns.get_String(l_column_names(i)) );
        WHEN l_data_type = 'NUMBER' OR
             l_data_type = 'FLOAT'
        THEN
          dbms_sql.bind_variable(p_cursor, ':bv' || (i+p_bind_var_offset), p_columns.get_Number(l_column_names(i)));
          testing_log(':bv' || (i+p_bind_var_offset) || ' bound to number : ' || to_char(p_columns.get_Number(l_column_names(i))) );
        WHEN l_data_type = 'DATE' THEN

          -- determine the actual date from the specified json
          l_date := determine_date_from_json( p_columns.get_String(l_column_names(i)) );

          dbms_sql.bind_variable(p_cursor, ':bv' || (i+p_bind_var_offset), l_date);
          testing_log(':bv' || (i+p_bind_var_offset) || ' bound to date : ' || l_date_string );
        ELSE 
          RAISE_APPLICATION_ERROR(unsupported_bind_type, 'Column ' || l_column_names(i) || ' has an unsupported data type: ' || l_data_type);
      END CASE;
    END LOOP;
  END IF;

  IF p_new_ari THEN
    dbms_sql.bind_variable(p_cursor, ':new_ari', l_new_ari);
  END IF;

END bind_column_variables;


-- =============================================================================
-- Name: call_routine
-- ==================
--
-- Summary
-- =======
-- Processes the specified JSON to dynamically call a function or procedure 
--
-- Parameters
-- ==========
-- p_package_name : The package name
-- p_routine_name : The routine name
-- p_parameters   : JSON object representing the parameter details e.g.
--                  {"PIN1":1,     "PIN2":"A", "PIN3":"1967-06-13", "PIN4":true, "PIN5":null,
--                   "POUT1":null, "POUT2":"", "POUT3":null,        "POUT4":"",  "POUT5":null} 
-- p_results       : JSON object detailing parameter and function return values and data types
--
-- =============================================================================
PROCEDURE call_routine( p_package_name IN  VARCHAR2,
                        p_routine_name IN  VARCHAR2,
                        p_parameters   IN OUT  JSON_OBJECT_T,
                        p_results      OUT JSON_OBJECT_T )
IS
  l_cursor SMALLINT;
  l_sql    VARCHAR2(4000);
  l_status SMALLINT;

BEGIN
  -- preconditions
  IF p_routine_name IS NULL THEN
    RAISE_APPLICATION_ERROR(routine_not_specified, 'Routine not specified for invokation');
  END IF;

  -- construct the sql string 
  l_sql := construct_call_string(p_package_name, p_routine_name);

  -- open cursor
  l_cursor := dbms_sql.open_cursor;

  -- parse the SQL statement statement
  dbms_sql.parse(l_cursor, l_sql, dbms_sql.native);

  -- bind variables
  bind_param_variables(l_cursor, p_package_name, p_routine_name, p_parameters);

  -- execute the SQL statement
  l_status := dbms_sql.execute(l_cursor);

  -- retrieve output parameter value
  get_output_param_values(l_cursor, p_package_name, p_routine_name, p_parameters, p_results);

  -- close cursor
  dbms_sql.close_cursor(l_cursor);

END call_routine;


-- =============================================================================
-- Name: select_row
-- ================
--
-- Summary
-- =======
-- Processes the specified JSON to dynamically select from the database
--
-- Parameters
-- ==========
-- p_table_name           : Database table name
-- p_select_column_names  : The names of the columns being selected
-- p_where_column_details : JSON object representing the where clause
--                          { "name_of_col1" : <number|string|date_as_string|null>,
--                            "name_of_col2" : <number|string|date_as_string|null> }
-- p_results              : JSON array detailing the results of the select statement
--                          One entry for each row of the result set
--
-- =============================================================================
PROCEDURE select_row( p_table_name           IN VARCHAR2,
                      p_select_column_names  IN JSON_ARRAY_T,
                      p_where_column_details IN JSON_OBJECT_T,
                      p_results              IN OUT JSON_ARRAY_T )
IS
  l_select_string      VARCHAR2(32767) := NULL;
  l_where_string       VARCHAR2(32767) := NULL;
  l_sql                VARCHAR2(32767);
  l_cursor             SMALLINT;
  l_col_count          INTEGER;
  l_col_type           PLS_INTEGER;
  l_col_name           VARCHAR2(30);
  l_date               DATE;
  l_number             NUMBER;
  l_varchar2           VARCHAR2(4000);
  l_rows_fetched       INTEGER;
  l_status             SMALLINT;
  l_col_details        dbms_sql.desc_tab2;
  l_where_column_names JSON_KEY_LIST;
  l_row                JSON_OBJECT_T;
  l_column             JSON_OBJECT_T;
BEGIN
  -- preconditions
  IF p_table_name IS NULL THEN
    RAISE_APPLICATION_ERROR(table_not_specified, 'Table not specified for SELECT statement');
  END IF;
  IF p_select_column_names IS NULL THEN
    RAISE_APPLICATION_ERROR(columns_not_specified, 'Columns to be selected not specified for SELECT statement');
  END IF;
  IF p_where_column_details IS NULL THEN
    RAISE_APPLICATION_ERROR(where_not_specified, 'Where clause not specified for SELECT statement');
  END IF;

  -- construct SELECT string 
  FOR i IN 0..p_select_column_names.get_size()-1 LOOP
    l_select_string := l_select_string || ',' || p_select_column_names.get_String(i);
  END LOOP;

  -- construct WHERE string 
  l_where_column_names := p_where_column_details.get_keys;
  FOR i IN 1..l_where_column_names.COUNT LOOP
    l_where_string := l_where_string || ' AND ' || l_where_column_names(i) || ' = :bv' || i;
  END LOOP;

  -- construct the full dynamic sql statement
  l_sql := 'SELECT ' || substr(l_select_string,2) ||
           ' FROM ' || p_table_name ||
           ' WHERE ' || substr(l_where_string,6) || ' and rownum < 10';
  testing_log(l_sql);

  -- open cursor
  l_cursor := dbms_sql.open_cursor;

  -- parse the SELECT statement
  dbms_sql.parse(l_cursor, l_sql, dbms_sql.native);

  -- bind the unique key variables
  bind_column_variables(l_cursor, 
                        p_table_name,
                        p_where_column_details,
                        0, 
                        FALSE); -- select so no new pk

  -- define columns being selected
  describe_columns(l_cursor, l_col_details, l_col_count);

  -- execute the cursor
  l_status := dbms_sql.execute(l_cursor);

  -- fetch the rows in turn
  l_rows_fetched := 0;
  WHILE ( dbms_sql.fetch_rows(l_cursor) > 0 ) LOOP

    l_rows_fetched := l_rows_fetched + 1;
    l_row := new JSON_OBJECT_T;

    -- process the retrieved columns in turn
    FOR i IN 1..l_col_count LOOP

      l_col_name := p_select_column_names.get_String(i-1);
      l_col_type := l_col_details(i).col_type;

      l_column := new JSON_OBJECT_T;
      CASE
        WHEN l_col_type IN (dbms_types.TYPECODE_VARCHAR, dbms_types.TYPECODE_VARCHAR2, dbms_types.TYPECODE_CHAR) 
        THEN
          l_column.put('data_type', dbms_types.TYPECODE_VARCHAR2);
          dbms_sql.column_value(l_cursor,i, l_varchar2);  
          l_column.put('data_value', l_varchar2);
          l_row.put(l_col_name, l_column);
       
        WHEN l_col_type = dbms_types.TYPECODE_NUMBER
        THEN
          l_column.put('data_type', dbms_types.TYPECODE_NUMBER);
          dbms_sql.column_value(l_cursor,i, l_number);
          l_column.put('data_value', l_number);
          l_row.put(l_col_name, l_column);

        WHEN l_col_type = dbms_types.TYPECODE_DATE
        THEN
          l_column.put('data_type', dbms_types.TYPECODE_DATE);
          dbms_sql.column_value(l_cursor,i, l_date); 
          l_column.put('data_value', l_date);
          l_row.put(l_col_name, l_column);

        ELSE
          RAISE_APPLICATION_ERROR(unsupported_data_type, 'Selected column ' || l_col_name || ' has an unsupported data type: ' || l_col_type);
      END CASE;
    END LOOP;

    p_results.append(l_row);

  END LOOP;

  IF l_rows_fetched = 0 THEN
    RAISE_APPLICATION_ERROR(no_rows_selected, 'No rows selected');
  END IF;

EXCEPTION
  WHEN OTHERS THEN
    IF dbms_sql.is_open(l_cursor) THEN
      dbms_sql.close_cursor(l_cursor);
    END IF;
    RAISE; 
END select_row;


-- =============================================================================
-- Name: delete_row
-- ================
--
-- Summary
-- =======
-- Processes the specified JSON to dynamically delete from the database
--
-- Parameters
-- ==========
-- p_table_name   : Database table name
-- p_where_clause : JSON object representing the where clause
--                  { "name_of_col1" : <number|string|date_as_string|null>,
--                    "name_of_col2" : <number|string|date_as_string|null> }
--
-- =============================================================================
PROCEDURE delete_row( p_table_name     IN VARCHAR2,
                      p_where_clause   IN JSON_OBJECT_T )
IS
  l_sql                VARCHAR2(32767);
  l_where_column_count SMALLINT;
  l_where_string       VARCHAR2(32767) := NULL;
  l_cursor             SMALLINT;
  l_status             SMALLINT;
  l_where_column_names JSON_KEY_LIST;
BEGIN
  -- preconditions
  IF p_table_name IS NULL THEN
    RAISE_APPLICATION_ERROR(table_not_specified, 'Table not specified for DELETE statement');
  END IF;

  IF p_where_clause IS NOT NULL THEN
    l_where_column_names := p_where_clause.get_keys;
    l_where_column_count   := l_where_column_names.COUNT;

    -- construct WHERE clause string
    FOR i IN 1..l_where_column_count LOOP
      l_where_string := l_where_string || ' AND ' || l_where_column_names(i) || ' = ' || ':bv' || i;
    END LOOP;
    l_where_string := ' WHERE ' || substr(l_where_string,6);
  END IF;

  -- construct SQL string
  l_sql := 'DELETE FROM ' || p_table_name || l_where_string; 
  testing_log(l_sql);

  -- open cursor
  l_cursor := dbms_sql.open_cursor;

  -- parse the DELETE statement
  dbms_sql.parse(l_cursor, l_sql, dbms_sql.native);

  -- bind the variables
  bind_column_variables(l_cursor, 
                        p_table_name,
                        p_where_clause, -- {"a":1, "b":2}
                        0,
                        FALSE); -- delete so no new pk

  -- execute the SQL statement
  l_status := dbms_sql.execute(l_cursor);

  -- close the cursor
  dbms_sql.close_cursor(l_cursor);

EXCEPTION
  WHEN OTHERS THEN
    IF dbms_sql.is_open(l_cursor) THEN
      dbms_sql.close_cursor(l_cursor);
    END IF;
    RAISE; 
END delete_row;


-- =============================================================================
-- Name: update_row
-- ================
--
-- Summary
-- =======
-- Processes the specified JSON to dynamically update rows in the database
--
-- Parameters
-- ==========
-- p_table_name     : Database table name
-- p_column_details : JSON object representing the columns to be updated
--                          { "name_of_col1" : <number|string|date_as_string|null>,
--                            "name_of_col2" : <number|string|date_as_string|null> }
-- p_where_clause   : JSON object representing the where clause
--                    { "name_of_col1" : <number|string|date_as_string|null>,
--                      "name_of_col2" : <number|string|date_as_string|null> }
--
-- =============================================================================
PROCEDURE update_row( p_table_name     IN VARCHAR2,
                      p_column_details IN OUT JSON_OBJECT_T,
                      p_where_clause   IN OUT JSON_OBJECT_T,
                      p_site_id        IN     VARCHAR2 )
IS
  l_sql                VARCHAR2(32767);
  l_update_string      VARCHAR2(32767) := NULL;
  l_where_string       VARCHAR2(32767) := NULL;
  l_column_count       SMALLINT;
  l_where_column_count SMALLINT;
  l_cursor             SMALLINT;
  l_status             SMALLINT;
  l_column_names       JSON_KEY_LIST;
  l_where_column_names JSON_KEY_LIST;

BEGIN
  -- preconditions
  IF p_table_name IS NULL THEN
    RAISE_APPLICATION_ERROR(table_not_specified, 'Table not specified for UPDATE statement');
  END IF;
  IF p_column_details IS NULL THEN
    RAISE_APPLICATION_ERROR(columns_not_specified, 'Columns not specified for UPDATE statement');
  END IF;
  IF p_where_clause IS NULL THEN
    RAISE_APPLICATION_ERROR(where_not_specified, 'Where clause not specified for UPDATE statement');
  END IF;

  -- initialisation
  l_column_names := p_column_details.get_keys;
  l_column_count   := l_column_names.COUNT; 
  l_where_column_names := p_where_clause.get_keys;
  l_where_column_count   := l_where_column_names.COUNT; 

  -- construct UPDATE string
  FOR i IN 1..l_column_count LOOP
    l_update_string := l_update_string || ',' || l_column_names(i) || ' = ' || ':bv' || i;
  END LOOP;

  -- construct WHERE clause string
  FOR i IN 1..l_where_column_count LOOP
    l_where_string := l_where_string || ' AND ' || l_where_column_names(i) || ' = ' || ':bv' || (l_column_count+i);
  END LOOP;

  -- construct SQL string
  l_sql := 'UPDATE ' || p_table_name || ' SET ' ||
           substr(l_update_string,2) || ' WHERE ' ||
           substr(l_where_string,6);
  testing_log(l_sql);

  -- open cursor
  l_cursor := dbms_sql.open_cursor;

  -- parse the UPDATE statement
  dbms_sql.parse(l_cursor, l_sql, dbms_sql.native);

  -- bind the variables
  bind_column_variables(l_cursor, 
                        p_table_name,
                        p_column_details, -- {"a":1, "b":2}
                        0,
                        FALSE); -- update so no new pk
  bind_column_variables(l_cursor, 
                        p_table_name,
                        p_where_clause, -- {"a":1, "b":2}
                        l_column_count,
                        FALSE); -- update so no new pk

  -- execute the SQL statement
  l_status := dbms_sql.execute(l_cursor);

  -- close the cursor
  dbms_sql.close_cursor(l_cursor);

EXCEPTION
  WHEN OTHERS THEN
    IF dbms_sql.is_open(l_cursor) THEN
      dbms_sql.close_cursor(l_cursor);
    END IF;
    RAISE; 
END update_row;


-- =============================================================================
-- Name: insert_row
-- ================
--
-- Summary
-- =======
-- Processes the specified JSON to dynamically insert a row into the database
--
-- Parameters
-- ==========
-- p_table_name     : Database table name
-- p_column_details : JSON object representing the columns to be inserted
--                          { "name_of_col1" : <number|string|date_as_string|null>,
--                            "name_of_col2" : <number|string|date_as_string|null> }
-- p_new_ari        : The generated APPN_ROW_ID for appropriate tables
--
-- =============================================================================
PROCEDURE insert_row( p_table_name     IN     VARCHAR2,
                      p_column_details IN OUT JSON_OBJECT_T,
                      p_site_id        IN     VARCHAR2,
                      p_new_ari        OUT    JSON_OBJECT_T )
IS
  l_column_count     SMALLINT;
  l_sql              VARCHAR2(32767) := NULL;
  l_columns_string   VARCHAR2(32767) := NULL;
  l_bind_vars_string VARCHAR2(32767) := NULL;
  l_cursor           SMALLINT;
  l_table_has_ari    BOOLEAN;
  l_status           SMALLINT;
  l_new_ari          NUMBER(18);
  l_column_names     JSON_KEY_LIST;
BEGIN

  -- preconditions
  IF p_table_name IS NULL THEN
    RAISE_APPLICATION_ERROR(table_not_specified, 'Table not specified for INSERT statement');
  END IF;
  IF p_column_details IS NULL THEN
    RAISE_APPLICATION_ERROR(columns_not_specified, 'Columns not specified for INSERT statement');
  END IF;

  -- add site_id if applicable
  IF NOT p_column_details.has('site_id') AND table_has_column( p_table_name, 'SITE_ID' ) THEN
    p_column_details.put('site_id', p_site_id);
  END IF;

  -- initialisation
  l_column_names   := p_column_details.get_keys;  -- eg ["appn_row_id", "flt", "pax"]
  l_column_count   := l_column_names.COUNT;

  -- construct strings representing the list of columns and the list of bind variables
  FOR i IN 1..l_column_count LOOP
    l_columns_string   := l_columns_string || ',' || l_column_names(i);
    l_bind_vars_string := l_bind_vars_string || ',:bv' || i; 
  END LOOP;

  -- construct the INSERT statement
  l_columns_string   := ' (' || substr(l_columns_string,2) || ') ';
  l_bind_vars_string := ' (' || substr(l_bind_vars_string,2) || ')';
  l_sql := 'INSERT INTO ' || p_table_name || 
           l_columns_string || 'VALUES' || l_bind_vars_string;
  testing_log(l_sql);

  -- does table have a generated appn_row_id?
  l_table_has_ari := table_has_column(p_table_name, 'APPN_ROW_ID');
  IF l_table_has_ari = TRUE THEN
    l_sql := l_sql || ' RETURNING appn_row_id INTO :new_ari';
  END IF;

  -- open cursor
  l_cursor := dbms_sql.open_cursor;

  -- parse the INSERT statement
  dbms_sql.parse(l_cursor, l_sql, dbms_sql.native);

  -- bind variables
  bind_column_variables(l_cursor, p_table_name, p_column_details, 0, l_table_has_ari);

  -- execute the SQL statement
  l_status := dbms_sql.execute(l_cursor);

  -- retrieve the newly generated ari if applicable
  IF l_table_has_ari = TRUE THEN
    dbms_sql.variable_value(l_cursor, ':new_ari', l_new_ari);
    p_new_ari := new JSON_OBJECT_T;
    p_new_ari.put('data_type', dbms_types.TYPECODE_NUMBER);
    p_new_ari.put('data_value', l_new_ari);    
  END IF;

  -- close the cursor
  dbms_sql.close_cursor(l_cursor);

EXCEPTION
  WHEN OTHERS THEN
    IF dbms_sql.is_open(l_cursor) THEN
      dbms_sql.close_cursor(l_cursor);
    END IF;
    RAISE;  
END insert_row;


BEGIN
  -- initialise globals
  g_column_types := new JSON_OBJECT_T;

END pkg_dynamic_sql;
/
