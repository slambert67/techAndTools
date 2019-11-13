-- current session trace
alter session set sql_trace = true;
ALTER SESSION SET tracefile_identifier = 'STEVELXXXXXXXXXXXX'

On windows file goes to C:\Users\steve.lambert\Oracle19c\diag\rdbms\orcl\orcl\trace

-- specific session trace
--execute sys.dbms_system.set_sql_trace_in_session(&SID, &SerialNum, true);

