/*
want number of medals of each type by country
need:
1. column that has values defining new columns
   eg. medal column allows 3 new columns based on it's row data (gold, silver, bronze)
2. what these defining values are: gold, silver, bronze
3. what to show in the new columns (must be aggregate values)
NB. Only rows which match values in the 'in' list appear in the results
*/
select *
  from olympic_medal_winners
  pivot ( count(*) -- aggregate value in new columns.
                   -- count of old rows with medal in (gold,silver,bronze) group by unique rows
          for medal in ('gold' gold, 'silver' silver, 'bronze' bronze)
  );

/*
Notes on above query:
Wanted - medal totals for each country
Got - medal totals per athlete
Reason - Oracle adds implicit 'group by' for all columns not in pivot
Solution - use inline view to select only required columns
*/

select *
  from ( select country, medal  -- inline view
                                -- 1 row per country (group by country). 
                                -- summations in new gold, silver, bronze columns derived from old medal column
           from olympic_medal_winners )
  pivot (
    -- implicit 'group by' now added only to country
    count(*)
    for medal in ('gold' gold, 'silver' silver, 'bronze' bronze)
  );


-- can add more aggregate functions to pivot
select *
  from ( select country, medal
           from olympic_medal_winners )
  pivot (
    count(*) cnt1,
    count(*) cnt2  -- new aggregate function
    for medal in ('gold' gold, 'silver' silver, 'bronze' bronze)
  );


-- group by more than 1 column
select *
  from ( select country, sport, medal  -- 1 row per country, sport (group by country, sport). 
                                       -- summations in new gold, silver, bronze columns derived from old medal column
           from olympic_medal_winners )
  pivot (
    -- implicit 'group by' now added to country and sport
    count(*)
    for medal in ('gold' gold, 'silver' silver, 'bronze' bronze)
  );