SELECT /*+ ORDERED */
       /*+ USE_NL (tab1 tab2) */    -- Nested Loop
       /*+ USE_MERGE (tab1 tab2) */ -- Sort Merge
       /*+ USE_HASH (tab1 tab2) */  -- Hash
       1
FROM   /* tables listed in order of decreasing restriction conditions ie. most restrictive first */
       dual
WHERE  -- inner joins are the default

       -- tab1.col1 = tab2.col1 (+)  -- outer join. (+) on optional table
       
       -- tab1.col1 = tab2.col1 -- equi join
       
       -- tab1.col1 > tab2.col1 -- theta join
       
       -- Nested Loop Join
       -------------------
       -- tab1.col1 = tab2.col1 -- index required on tab2 join (driven table)
       -- very efficient only for queries with highly restrictive conditions
       -- result returned a little at a time therefore first row returned very quickly
       -- no sorting performed
       
       -- Sort Merge Join
       ------------------
       -- tables considered equal - no driving table
       -- both tables sorted by join criteria and then merged
       -- uses full table scans
       -- reasonable choice when result set is large
       -- init.ora : SORT_AREA_SIZE may need to be large
       
       -- Hash Join
       ------------
       -- uses full table scans
       -- smaller table is driving table. Excellent performance if can fit into hash area
       -- init.ora : HASH_AREA_SIZE
       -- Partially rendered Sort Merge Join obsolete
       -- Performs badly with skewed data

inline views
============
select my_table.x, inline_view.y
  from my_table,
       (select y
          from another_table) inline_view


with clause
===========
alternative to inline view
This can be used to make a very complicated FROM clause look much simpler.


pipelined table functions
=========================


