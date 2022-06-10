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
-- Modification History
-- --------------------
-- AIMS-3460 - Steve Lambert - 03/06/20 - Initial revision.
-- AIMS-4039 - Steve Lambert - 22/10/20 - Implement seed data functionality
-- AIMS-6201 - Steve Lambert - 17/05/22 - Improve Logging
-- -----------------------------------------------------------------------------

CREATE OR REPLACE PACKAGE 
-- Identifier: AIMS-6201
pkg_server_testing
IS
  v_debug_log VARCHAR2(5);

  PROCEDURE perform_server_testing( p_functional_area IN server_tests.functional_area%TYPE DEFAULT NULL,
                                    p_test_suite      IN server_tests.test_suite%TYPE      DEFAULT NULL,
                                    p_site_id         IN VARCHAR2                          DEFAULT 'AOS' );


END pkg_server_testing;
/
PROMPT Granting public execute access to pkg_server_testing
GRANT EXECUTE ON pkg_server_testing TO PUBLIC;

PROMPT Creating public synonym pkg_server_testing
CREATE OR REPLACE PUBLIC SYNONYM pkg_server_testing FOR pkg_server_testing;
