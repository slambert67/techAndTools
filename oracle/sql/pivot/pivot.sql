CREATE TABLE orders_to_pivot
( order_id integer NOT NULL,
  customer_ref varchar2(50) NOT NULL,
  order_date date,
  product_id integer,
  quantity integer,
  CONSTRAINT orders_to_pivot_pk PRIMARY KEY (order_id)
);

insert into orders_to_pivot values(50001,'SMITH',NULL,10,0);
insert into orders_to_pivot values(50002,'SMITH',NULL,20,0);
insert into orders_to_pivot values(50003,'ANDERSON',NULL,30,0);
insert into orders_to_pivot values(50004,'ANDERSON',NULL,40,0);
insert into orders_to_pivot values(50005,'JONES',NULL,10,0);
insert into orders_to_pivot values(50006,'JONES',NULL,20,0);
insert into orders_to_pivot values(50007,'SMITH',NULL,20,0);
insert into orders_to_pivot values(50008,'SMITH',NULL,10,0);
insert into orders_to_pivot values(50009,'SMITH',NULL,20,0);

select * from orders_to_pivot;

SELECT * FROM
(
  SELECT customer_ref, product_id
  FROM orders_to_pivot
)
PIVOT
(
  COUNT(product_id)
  FOR product_id IN (10 as ten, 20 as twenty, 30 as thirty ,40 as forty)  -- entries become columns (pivot into headings)
  -- implicit group by on customer_ref
)
ORDER BY customer_ref;

create table orders_to_unpivot
(customer_ref varchar2(50),
ten integer,
twenty integer,
thirty integer,
forty integer,
CONSTRAINT orders_to_unpivot_pk PRIMARY KEY (customer_ref));

insert into orders_to_unpivot values ('ANDERSON',0,0,1,1);
insert into orders_to_unpivot values ('JONES',1,1,0,0);
insert into orders_to_unpivot values ('SMITH',2,3,0,0);

select * from orders_to_unpivot;

-- columns to become data (ten,twenty,thirty,forty) => product_id
select * from orders_to_unpivot
unpivot include nulls (
 product_count for prod_id in (ten as '10', twenty as '20', thirty as '30', forty as '40')
)
