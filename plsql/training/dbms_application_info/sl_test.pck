CREATE OR REPLACE PACKAGE sl_test is

/**************************************************************************
  Name		  : sl_test
  Purpose	  : testing dbms_application_info
  Developer	: U08998
  Date		  : 24/05/2004
---------------------------------------------------------------------------
   Update Log:

For readability, insert the most recent entry to the top of the list

  	Version		By	Date	Details with CCR No

  	
  	1.0		U08998	24/05/2004	Original Version
---------------------------------------------------------------------------
  
**************************************************************************/
  
  -- Public type declarations
  
  -- Public constant declarations

  -- Public variable declarations

  -- Public function and procedure declarations
  procedure set_module;

  procedure read_module;

end sl_test;
/


CREATE OR REPLACE PACKAGE BODY sl_test is

/**************************************************************************
  Name		  : sl_test
  Purpose	  : testing dbms_application_info
  Developer	: U08998
  Date		  : 24/05/2004
---------------------------------------------------------------------------
  Update Log:

For readability, insert the most recent entry to the top of the list

  	Version		By	Date	Details with CCR No

  	
  	1.0		U08998	24/05/2004	Original Version
---------------------------------------------------------------------------
  
**************************************************************************/

  -- Private type declarations

  
  -- Private constant declarations


  -- Private variable declarations


  -- Function and procedure implementations
  procedure set_module
  is
  begin

    dbms_output.put_line('In set module');

    dbms_application_info.set_module('sl_test', 'action:testing');

  end;

  procedure read_module
  is
    module_name varchar2(48);
    action_name varchar2(32);

  begin

    dbms_output.put_line('In read module');

    dbms_application_info.read_module(module_name, action_name);

    dbms_output.put_line('module name = ' || module_name);
    dbms_output.put_line('action name = ' || action_name);

  end;

begin
  -- Initialization
  null;
end sl_test;
/