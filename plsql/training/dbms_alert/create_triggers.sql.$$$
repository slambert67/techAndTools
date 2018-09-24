create or replace trigger sl_trigger_before
before insert on sltest
for each row
begin
  dbms_output.put_line('hello');
end;
/
create or replace trigger sl_trigger_after
after insert on sltest
for each row
begin
  dbms_output.put_line('world');
end;
/
