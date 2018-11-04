-- whenever sqlerror exit     - 2nd statement not executed
-- whenever sqlerror continue - 2nd statement is executed

select 1/0 from dual;
select 1 from dual;
