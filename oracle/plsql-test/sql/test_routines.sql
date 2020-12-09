-- -----------------------------------------------------------------------------
--
--              Copyright (c) ADB SAFEGATE Airport Systems UK Ltd 2020 
--                            All rights reserved
--
-- -----------------------------------------------------------------------------
--            
-- Subsystem Name  : Automated Server Testing Framework
-- Module          : test_routines     
-- Original Author : Steve Lambert                
--
-- -----------------------------------------------------------------------------
--
-- Description
-- -----------
-- Standalone routines used for framework self testing
--
--
-- Modification History
-- --------------------
-- AIMS-3270 - Steve Lambert - 17/04/20 - Miscellaneous cosmetic changes
-- -----------------------------------------------------------------------------

CREATE OR REPLACE PROCEDURE standaloneProc(pIn1  IN NUMBER,  pIn2 IN VARCHAR2,   pIn3 IN DATE,
                                           pOut1 OUT NUMBER, pOut2 OUT VARCHAR2, pOut3 OUT DATE)
IS
BEGIN
  pOut1 := pIn1;
  pOut2 := pIn2;
  pOut3 := pIn3;
END;
/

CREATE OR REPLACE FUNCTION standaloneFunc(pIn1  IN NUMBER,  pIn2 IN VARCHAR2,   pIn3 IN DATE,
                                          pOut1 OUT NUMBER, pOut2 OUT VARCHAR2, pOut3 OUT DATE) RETURN VARCHAR2
IS
BEGIN
  pOut1 := pIn1;
  pOut2 := pIn2;
  pOut3 := pIn3;

  RETURN 'String value';
END;
/


