PROMPT Creating Package Body 'SL_PACKAGE'
CREATE OR REPLACE PACKAGE BODY SL_PACKAGE IS

  PROCEDURE PROC1
  IS
  BEGIN

    RAISE_APPLICATION_ERROR(-20001, 'it works');

  END;

BEGIN

  NULL;

END SL_PACKAGE;
/