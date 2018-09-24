create table sl_plan_table
(
  statement_id    varchar2(30),
  timestamp       date,
  remarks         varchar2(80),
  operation       varchar2(30),
  options         varchar2(30),
  object_node     varchar2(128),
  object_owner    varchar2(30),
  object_name     varchar2(30),
  object_instance number,
  object_type     varchar2(30),
  optimizer       varchar2(255),
  search_columns  number,
  id              number,
  parent_id       number,
  position        number,
  cost            number,
  cardinality     number,
  bytes           number,
  other_tag       varchar2(255),
  partition_start varchar2(255),
  partition_stop  varchar2(255),
  partition_id    number,
  other           long
);
