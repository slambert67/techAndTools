-- -----------------------------------------------------------------------------
--
--              Copyright (c) ADB SAFEGATE Airport Systems UK Ltd 2020 
--                            All rights reserved
--
-- -----------------------------------------------------------------------------
--            
-- Subsystem Name  : Automated Server Testing Framework
-- Module          : auto_test_pkg specification    
-- Original Author : Steve Lambert                
--
-- -----------------------------------------------------------------------------
--
-- Description
-- -----------
-- Packaged routines used for framework self testing
--
--
-- Modification History
-- --------------------
-- AIMS-3270 - Steve Lambert - 17/04/20 - Miscellaneous cosmetic changes
-- AIMS-3460 - Steve Lambert - 27/05/20 - Handle Booleans
-- AIMS-4076 - Steve Lambert - 03/11/20 - Handle CLOBs representing JSON for routine parameters
-- -----------------------------------------------------------------------------

CREATE OR REPLACE PACKAGE auto_test_pkg IS

PROCEDURE pkgProc(pIn1  IN NUMBER,  pIn2 IN VARCHAR2,   pIn3 IN DATE, pIn4 IN BOOLEAN,
                  pOut1 OUT NUMBER, pOut2 OUT VARCHAR2, pOut3 OUT DATE, pOut4 OUT BOOLEAN);

FUNCTION pkgStringFunc(pIn1  IN NUMBER,  pIn2 IN VARCHAR2,   pIn3 IN DATE,
                       pOut1 OUT NUMBER, pOut2 OUT VARCHAR2, pOut3 OUT DATE) RETURN VARCHAR2;

FUNCTION pkgNumberFunc(pIn1  IN NUMBER,  pIn2 IN VARCHAR2,   pIn3 IN DATE,
                       pOut1 OUT NUMBER, pOut2 OUT VARCHAR2, pOut3 OUT DATE) RETURN NUMBER;

FUNCTION pkgDateFunc(pIn1  IN NUMBER,  pIn2 IN VARCHAR2,   pIn3 IN DATE,
                     pOut1 OUT NUMBER, pOut2 OUT VARCHAR2, pOut3 OUT DATE) RETURN DATE;

FUNCTION pkgBooleanFunc(pIn1 IN BOOLEAN, pOut1 OUT BOOLEAN) RETURN BOOLEAN;

FUNCTION pkgClobFunc(pOut1 OUT CLOB) RETURN CLOB;

FUNCTION pkgNoParamsFunc RETURN VARCHAR2;

END;
/


