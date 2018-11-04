create or replace trigger sl_trigger_after
after insert on sltest
for each row
begin
  dbms_alert.signal('testalert','test alert message');
end;
/
