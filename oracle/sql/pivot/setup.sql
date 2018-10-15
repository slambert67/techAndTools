create table olympic_medal_winners (   
  olympic_year int,  
  sport        varchar2( 30 ),  
  gender       varchar2( 1 ),  
  event        varchar2( 128 ),  
  medal        varchar2( 10 ),  
  country      varchar2( 3 ),  
  athlete      varchar2( 128 ) 
); 

insert into olympic_medal_winners values (
2016, 'archery', 'M', 'Male individual', 'gold', 'kor', 'KU Bonchan');
insert into olympic_medal_winners values (
2016, 'archery', 'M', 'Male individual', 'silver', 'fra', 'VALLADONT Jean-Charles');
insert into olympic_medal_winners values (
2016, 'archery', 'M', 'Male individual', 'bronze', 'usa', 'ELLISON Brady');
insert into olympic_medal_winners values (
2016, 'discus', 'M', 'Male individual', 'silver', 'usa', 'ELLISON Brady');
insert into olympic_medal_winners values (
2016, 'javelin', 'M', 'Male individual', 'gold', 'usa', 'ELLISON Brady');
insert into olympic_medal_winners values (
2016, 'javelin', 'M', 'Male individual', 'silver', 'usa', 'ELLISON Brody');
insert into olympic_medal_winners values (
2016, 'archery', 'W', 'Female individual', 'gold', 'kor', 'CHANG Hyejin');
insert into olympic_medal_winners values (
2016, 'archery', 'W', 'Female individual', 'silver', 'ger', 'UNRUH Lisa');
insert into olympic_medal_winners values (
2016, 'archery', 'W', 'Female individual', 'bronze', 'kor', 'KI Bobae');


create table final_medal_table (
  country varchar2(3),
  gold_medals   number,
  silver_medals number,
  bronze_medals number
);

insert into final_medal_table values (
'usa', 46, 37, 38);
insert into final_medal_table values (
'gbr', 27, 23, 17);
insert into final_medal_table values (
'chn', 26, 18, 26);
insert into final_medal_table values (
'rus', 19, 18, 19);
insert into final_medal_table values (
'ger', 17, 10, 15);


create table final_medal_table2 (
  country varchar2(3),
  gold_medals   number,
  gold_sports   number,
  silver_medals number,
  silver_sports number,
  bronze_medals number,
  bronze_sports number
);

insert into final_medal_table2 values (
'usa', 46, 14, 37, 13, 38, 17);
insert into final_medal_table2 values (
'gbr', 27, 16, 23, 15, 17, 11);
insert into final_medal_table2 values (
'chn', 26, 10, 18, 11, 26, 13);
insert into final_medal_table2 values (
'rus', 19, 10, 18, 11, 19, 11);
insert into final_medal_table2 values (
'ger', 17, 9, 10, 8, 15, 13);


commit;