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
-- Modification History
-- --------------------
-- AIMS-3460 - Steve Lambert - 03/06/20 - Initial revision.
-- AIMS-3676 - Steve Lambert - 09/07/20 - Implement SELECT functionality to enable
--                                        framework to make available any database data
--                                        to subsequent test steps
-- AIMS-3805 - Steve Lambert - 29/09/20 - Implement today and now date functionality
-- AIMS-4039 - Steve Lambert - 22/10/20 - Implement seed data functionality
-- AIMS-6201 - Steve Lambert - 17/05/22 - Improve Logging
-- -----------------------------------------------------------------------------

CREATE OR REPLACE PACKAGE 
-- Identifier: AIMS-6201
pkg_dynamic_sql
IS

PROCEDURE insert_row( p_table_name     IN     VARCHAR2,
                      p_column_details IN OUT JSON_OBJECT_T,
                      p_site_id        IN     VARCHAR2,
                      p_new_ari        OUT    JSON_OBJECT_T );

PROCEDURE update_row( p_table_name     IN VARCHAR2,
                      p_column_details IN OUT JSON_OBJECT_T,
                      p_where_clause   IN OUT JSON_OBJECT_T,
                      p_site_id        IN     VARCHAR2,
                      p_rows_updated      OUT INTEGER );

PROCEDURE delete_row( p_table_name     IN VARCHAR2,
                      p_where_clause   IN JSON_OBJECT_T,
                      p_rows_deleted      OUT INTEGER );

PROCEDURE select_row( p_table_name           IN     VARCHAR2,
                      p_select_column_names  IN     JSON_ARRAY_T,
                      p_where_clause         IN     JSON_OBJECT_T,
                      p_results              IN OUT JSON_ARRAY_T,
                      p_rows_selected           OUT INTEGER );

PROCEDURE call_routine( p_package_name IN  VARCHAR2,
                        p_routine_name IN  VARCHAR2,
                        p_parameters   IN  out JSON_OBJECT_T,
                        p_results      OUT JSON_OBJECT_T );

FUNCTION determine_date_from_json( p_json_date_string IN VARCHAR2 ) RETURN DATE;

END pkg_dynamic_sql;
/
PROMPT Granting public execute access to pkg_dynamic_sql
GRANT EXECUTE ON pkg_dynamic_sql TO PUBLIC;

PROMPT Creating public synonym pkg_dynamic_sql
CREATE OR REPLACE PUBLIC SYNONYM pkg_dynamic_sql FOR pkg_dynamic_sql;
