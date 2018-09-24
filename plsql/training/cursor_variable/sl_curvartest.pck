create or replace package sl_curvartest is

  -- Author  : U08998
  -- Created : 13/09/2004 15:25:41
  -- Purpose : cursor variable testing
  
  -- Public type declarations
  --type <TypeName> is <Datatype>;
  type daterec is record( today date);
  type cur_type is ref cursor return daterec;
  
  -- Public constant declarations
  --<ConstantName> constant <Datatype> := <Value>;

  -- Public variable declarations
  --<VariableName> <Datatype>;

  -- Public function and procedure declarations
  --function <FunctionName>(<Parameter> <Datatype>) return <Datatype>;
  procedure open_curvar( p_curvar in out cur_type );

end sl_curvartest;
/
create or replace package body sl_curvartest is

  -- Private type declarations
  --type <TypeName> is <Datatype>;
  
  -- Private constant declarations
  --<ConstantName> constant <Datatype> := <Value>;

  -- Private variable declarations
  --<VariableName> <Datatype>;

  -- Function and procedure implementations
  --function <FunctionName>(<Parameter> <Datatype>) return <Datatype> is
    --<LocalVariable> <Datatype>;
  --begin
    --<Statement>;
    --return(<Result>);
  --end;
  procedure open_curvar( p_curvar in out cur_type )
  is
  begin
  
    open p_curvar
    for  select sysdate + 1
           from dual;
  end;
  
begin
  -- Initialization
 null;
 end sl_curvartest;
/
