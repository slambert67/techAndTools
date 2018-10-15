set linesize 200
set pagesize 50
set pause 'More ...'
set pause on

ttitle 'Parameter Information'

column name heading 'Name'
column name format a20
column value heading 'Value'
column value format a50
column description heading 'Description'
column description format a50

SELECT substr(name,1,20) name,
       substr(value,1,50) value,
       substr(description,1,50) description
FROM   v$parameter
ORDER
BY     name ASC
/
