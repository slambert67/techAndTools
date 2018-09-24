DECLARE

  mystring VARCHAR2(20);
  
BEGIN

  select helloworld() into mystring
  from   dual;
  
  dbms_output.put_line(mystring);
  
end;
