CREATE OR REPLACE PACKAGE sl_test is

/**************************************************************************
  Name		  : sl_pipe
  Purpose	  : my pipes
  Developer	: U08998
  Date		  : 02/04/2004
---------------------------------------------------------------------------
   Update Log:

For readability, insert the most recent entry to the top of the list

  	Version		By	Date	Details with CCR No

  	
  	1.0		U08998	02/04/2004	Original Version
---------------------------------------------------------------------------
  
**************************************************************************/
  
  -- Public type declarations
  
  -- Public constant declarations

  -- Public variable declarations

  -- Public function and procedure declarations
  procedure test;

end sl_test;
/
CREATE OR REPLACE PACKAGE BODY sl_test is

/**************************************************************************
  Name		  : sl_pipe
  Purpose	  : my pipes
  Developer	: U08998
  Date		  : 02/04/2004
---------------------------------------------------------------------------
  Update Log:

For readability, insert the most recent entry to the top of the list

  	Version		By	Date	Details with CCR No

  	
  	1.0		U08998	02/04/2004	Original Version
---------------------------------------------------------------------------
  
**************************************************************************/

  -- Private type declarations
  
  -- Private constant declarations

  -- Private variable declarations

  -- Function and procedure implementations
  procedure test
  is

    create_pipe_failure    exception;
    pragma exception_init(create_pipe_failure, -20001);
    pipe_conflict_detected exception;
    pragma exception_init(pipe_conflict_detected, -20002);

  begin

    sl_pipe.create_a_pipe('slpipe',100,'private');
    
  exception

    when create_pipe_failure then
      dbms_output.put_line('create pipe failure');

    when pipe_conflict_detected then
      dbms_output.put_line('pipe conflict detected');

    when others then
      dbms_output.put_line('others');

  end;

-- package body
begin
  -- Initialization
  null;

end sl_test;
/
