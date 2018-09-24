select lpad(' ', 5*(level-1)) || id || ' : ' || parent_id || ' ' ||
       operation || ' ' || 
       options || ' ' || 
       object_name || ' ' ||
       decode( id,
               0, 'Cost = ' || position) "Query Plan"
from   sl_plan_table
start with id = 0 and statement_id = 'sl1'
connect by prior id = parent_id and statement_id = 'sl1'
