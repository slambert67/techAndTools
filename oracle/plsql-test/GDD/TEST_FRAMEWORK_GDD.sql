-- -----------------------------------------------------------------------------
--
--              Copyright (c) ADB SAFEGATE Airport Systems UK Ltd 2020 
--                            All rights reserved
--
-- -----------------------------------------------------------------------------
--            
-- Subsystem Name  : Automated Server Testing Framework
-- Module          : GDD      
-- Original Author : Steve Lambert                
--
-- -----------------------------------------------------------------------------
--
-- Description
-- -----------
-- Defines the database structures used to supported the Automated Testing Framework
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
-- AIMS-3270 - Steve Lambert - 17/04/20 - Miscellaneous cosmetic changes
-- AIMS-3417 - Steve Lambert - 15/05/20 - Miscellaneous changes
-- AIMS-3460 - Steve Lambert - 27/05/20 - Handle Booleans
-- AIMS-3957 - Steve Lambert - 01/10/20 - Assign AST_ prefix to all dynamically created packages
-- AIMS-4039 - Steve Lambert - 16/10/20 - Implement SEED DATA functionality
-- AIMS-4143 - Steve Lambert - 04/11/20 - Allow digits in Functional Area name
-- -----------------------------------------------------------------------------

DROP TABLE server_tests;
DROP TABLE server_test_logs;
DROP TABLE server_test_results;
DROP TABLE server_test_table;

CREATE TABLE server_tests
(
  functional_area      VARCHAR2(18)   CONSTRAINT ensure_valid_fa CHECK( functional_area IS NOT NULL AND
                                                                        regexp_like(functional_area,'^[A-Z][A-Z_0-9]{1,17}$')),
  functional_area_desc VARCHAR2(2000),
  test_suite           NUMBER(2)      NOT NULL,
  test_suite_desc      VARCHAR2(2000),
  test_number          NUMBER(3)      NOT NULL,
  test_number_desc     VARCHAR2(2000), 
  test_step            NUMBER(3)      NOT NULL,
  test_step_desc       VARCHAR2(2000) NOT NULL,
  load_seed_data       VARCHAR2(1),
  test_operation       CLOB           CONSTRAINT ensure_json_operation CHECK (test_operation IS JSON),
  expectations         CLOB           CONSTRAINT ensure_json_expectations CHECK (expectations IS JSON)
)
TABLESPACE users;

ALTER TABLE server_tests
ADD CONSTRAINT server_tests_pk PRIMARY KEY (functional_area, test_suite, test_number, test_step)
USING INDEX TABLESPACE users;


DROP SEQUENCE testing_log_id_seq;
CREATE SEQUENCE testing_log_id_seq
    INCREMENT BY 1
    START WITH 1
    MINVALUE 1;
CREATE TABLE server_test_logs
(
  log_number      NUMBER(18)     NOT NULL,
  log_details     VARCHAR2(4000),
  pkg_body        LONG
)
TABLESPACE users;


CREATE TABLE server_test_results
(
  functional_area      VARCHAR2(18)   CONSTRAINT ensure_valid_fa2 CHECK( functional_area IS NOT NULL AND
                                                                         regexp_like(functional_area,'^[A-Z][A-Z_0-9]{1,17}$')),
  test_suite           NUMBER(2),
  test_number          NUMBER(3),  
  test_step            NUMBER(3) ,  
  test_status          VARCHAR2(10),
  exception_code       NUMBER,
  exception_message    VARCHAR2(4000)
)
TABLESPACE users;

CREATE TABLE server_test_table
(
  appn_row_idx NUMBER(18),
  num1        NUMBER(18),
  num2        NUMBER(18),
  num3        NUMBER(18),
  string1     VARCHAR2(20),
  string2     VARCHAR2(20),
  string3     VARCHAR2(20),
  date1       DATE,
  date2       DATE,
  date3       DATE,
  ari1        NUMBER(18),
  ari2        NUMBER(18),
  ari3        NUMBER(18),
  blob1       BLOB
)
TABLESPACE users;
