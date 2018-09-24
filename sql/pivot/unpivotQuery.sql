/*
need
- name of new column to store values from old columns:              medal_count
- the list of columns that hold the values that are to become rows: gold, silver, bronze
- another new column showing the source of these values:            medal_colour


So
- colums
  - gold_medals, silver_medals, bronze_medals replaced with (collapsed into) medal_colour
and
- new column
  - medal_count

eg
country  gold_medals  silver_medals  bronze_medals
usa          1              2              3

becomes
country  medal_colour  medal_count
usa         gold            1
usa         silver          2
use         bronze          3
*/
select *
  from final_medal_table2
unpivot ( medal_count for medal_colour in (  -- the 2 new columns. 1 count(not agg function!) for each medal_colour
  -- define the data value for each of the old/replaced columns
  gold_medals as 'gold',     
  silver_medals as 'silver',
  bronze_medals as 'bronze'
));

/*
unpivot multiple groups
(gold_medals, silver_medals, bronze_medals) => medal_colour + medal_count columns
(gold_sports, silver_sports, bronze_sports) => sport_colour + sport_count columns
*/
select *
  from final_medal_table2
unpivot ( (medal_count, sport_count) for medal_colour in (
  (gold_medals, gold_sports) as 'gold',   -- old gold_medals, gold_sports columns have data value of 'gold'  
  (silver_medals, silver_sports) as 'silver',
  (bronze_medals, bronze_sports) as 'bronze'
));