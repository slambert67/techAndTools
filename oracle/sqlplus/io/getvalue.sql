-- prompts for each instance of &a1
select '&a1' from dual;
select '&a1' from dual;

-- prompts only once 
--   v1 is valid for whole sql session
--   v1 is visible to child scripts

select '&&v1' from dual;
select '&&v1' from dual;
select '&&v1' from dual;
