create table conctest
(
  myrowid number(18) not null,
  total   integer );
alter table conctest
  add constraint conctest_pk primary key( myrowid );

insert into conctest values (1,0);

