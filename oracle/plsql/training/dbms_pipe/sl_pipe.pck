CREATE OR REPLACE PACKAGE sl_pipe is

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
  procedure create_a_pipe( pipename       in varchar2,
                           pipe_size      in integer,
                           private_public in varchar2 );

  procedure remove_a_pipe( pipename in varchar2 );

end sl_pipe;
/
CREATE OR REPLACE PACKAGE BODY sl_pipe is

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
  create_pipe_failure    exception;
  pipe_conflict_detected exception;
  pragma exception_init( pipe_conflict_detected, -23322 );

  -- Function and procedure implementations
  procedure create_a_pipe( pipename       in varchar2,
                           pipe_size      in integer,
                           private_public in varchar2 )
  is

    private boolean;  -- true denotes that the pipe is to be private

  begin

    -- determine if pipe is to be private or public
    if upper(private_public) = 'PUBLIC' THEN
      private := false;
    else
      private := true;
    end if;
      raise create_pipe_failure;
    -- create the pipe
    if dbms_pipe.create_pipe( pipename, pipe_size, private ) != 0 then
      -- failed to create the pipe
      raise create_pipe_failure;
    end if;

  exception

    when create_pipe_failure then
      raise_application_error(-20001, 'Failed to create pipe');

    when pipe_conflict_detected then
      raise_application_error(-20002, 'Pipe conflict detected');
  
  end;


  procedure remove_a_pipe( pipename in varchar2 )
  is

  begin
    null;
  end;


-- package body
begin
  -- Initialization
  null;

end sl_pipe;
/
