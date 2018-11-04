declare

  type my_first_collection_type is table of varchar2(10);

  my_varchars my_first_collection_type := my_first_collection_type('a','b','c');

  i binary_integer := 1;

begin

  while my_varchars.exists(i)
  loop

    dbms_output.put_line(my_varchars(i));

    i := i+1;

  end loop;

  --dbms_output.put_line( my_varchars(-1) );  raises subscript_outside_limit
  dbms_output.put_line( my_varchars(4) );  -- raises subscript_beyond_count

exception

  when subscript_outside_limit then
    dbms_output.put_line( 'subscript_outside_limit exception raised');

  when subscript_beyond_count then
    dbms_output.put_line( 'subscript_beyond_count exception raised' );

  when others then
    dbms_output.put_line( 'in when others' );
    dbms_output.put_line(sqlerrm);

end;