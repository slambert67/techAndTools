declare

  type mycurtype is ref cursor;
  mycurvar mycurtype;
  type mydaterec is record( today date );
  mydate mydaterec;
  
begin

 sl_curvartest.open_curvar( mycurvar );
 
 fetch mycurvar
 into  mydate;
 
 dbms_output.put_line('mydate = ' || mydate.today);
 
 
 
end;
