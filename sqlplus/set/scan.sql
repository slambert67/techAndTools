--set scan off
-- turns off variable substitution in sql. Output = &my_name

set scan on
-- turns on variable substitution in sql. Output = steve

define my_name = "steve"

select '&my_name' from dual;

