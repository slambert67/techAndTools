set echo on
set feedback on
set serveroutput on

insert into sltest values (1,'a');
rollback;

