select * from trace_logs t
where t.trace_text like '%slambert%'
order by sequence_no;

delete from trace_logs t
where t.trace_text like '%slambert%';
