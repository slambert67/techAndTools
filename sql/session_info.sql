set linesize 200

ttitle 'Session Information'

column username heading 'User'
column username format a10
column schemaname heading 'Schema'
column schemaname format a10
column program heading 'Program'
column program format a30
column event heading 'Event'
column event format a50

SELECT sid,
       serial#,
       substr(username,1,10) username,
       status,
       substr(schemaname,1,10) schemaname,
       process,
       substr(program,1,30) program,
       substr(event,1,50) event
FROM v$session
/
