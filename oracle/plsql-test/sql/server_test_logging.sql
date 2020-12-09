-- -----------------------------------------------------------------------------
--
--              Copyright (c) ADB SAFEGATE Airport Systems UK Ltd 2020 
--                            All rights reserved
--
-- -----------------------------------------------------------------------------
--            
-- Subsystem Name  : Automated Server Testing Framework
-- Module          : testing_log    
-- Original Author : Steve Lambert                
--
-- -----------------------------------------------------------------------------
--
-- Description
-- -----------
-- Routine to support logging by framework
--
--
-- Modification History
-- --------------------
-- AIMS-3460 - Steve Lambert - 27/05/20 - Handle Booleans
-- -----------------------------------------------------------------------------
CREATE OR REPLACE PROCEDURE testing_log(p_log_details IN VARCHAR2)
AS
  PRAGMA AUTONOMOUS_TRANSACTION;
BEGIN

  INSERT INTO server_test_logs VALUES
  ( testing_log_id_seq.nextval, p_log_details, null );

  COMMIT;
END;
/
GRANT EXECUTE ON testing_log TO PUBLIC;
CREATE OR REPLACE PUBLIC SYNONYM testing_log FOR testing_log;
