declare

  type my_first_collection_type is table of varchar2(10);

  my_varchars my_first_collection_type := my_first_collection_type('a','b','c');

begin

  dbms_output.put_line('hello world');
  dbms_output.put_line( my_varchars(1) );
  dbms_output.put_line( my_varchars(2) );
  dbms_output.put_line( my_varchars(3) );

  my_varchars(3) := 'z';
  dbms_output.put_line( my_varchars(3) );
end;