-- current session trace
--alter session set sql_trace = false;

-- specific session trace
execute sys.dbms_system.set_sql_trace_in_session(&SID, &SerialNum, false);

