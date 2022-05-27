create table conctest
(
  myrowid number(18) not null,
  col1    varchar2(30),
  col2    varchar2(30)
);
alter table conctest
  add constraint conctest_pk primary key( myrowid );

