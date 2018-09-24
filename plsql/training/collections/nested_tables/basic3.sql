declare

  type my_first_collection_type is table of varchar2(10);

  my_varchars my_first_collection_type := my_first_collection_type('a','b','c');

  i binary_integer := 1;

begin

  -- EXISTS
  if my_varchars.exists(1) then
    dbms_output.put_line('entry 1 exists');
  end if;

  if my_varchars.exists(4) then
    dbms_output.put_line('entry 4 exists');
  else
    dbms_output.put_line('entry 4 does not exist');
  end if;

  -- COUNT
  dbms_output.put_line('my_varchars has ' || my_varchars.count || ' entries');

  -- FIRST
  dbms_output.put_line('lowest index is ' || my_varchars.first);

  -- LAST
  dbms_output.put_line('highest index is ' || my_varchars.last);

  --NEXT
  i := my_varchars.first;
  while i is not null
  loop
    dbms_output.put_line('in loop : ' || my_varchars(i));
    i := my_varchars.next(i);
  end loop;

  -- EXTEND
  my_varchars.extend;
  my_varchars(4) := 'd';
  dbms_output.put_line('4th element = ' || my_varchars(4));

  -- TRIM removes elemets from end of collection



exception

  when subscript_outside_limit then
    dbms_output.put_line( 'subscript_outside_limit exception raised');

  when subscript_beyond_count then
    dbms_output.put_line( 'subscript_beyond_count exception raised' );

  when collection_is_null then
    null;

  when others then
    dbms_output.put_line( 'in when others' );
    dbms_output.put_line(sqlerrm);

end;