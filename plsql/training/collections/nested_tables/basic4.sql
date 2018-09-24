set echo on
set prompt off
set feedback off
set serveroutput on

DROP TABLE animals
/

DROP TYPE SPECIES_LIST
/

CREATE TYPE SPECIES_LIST AS TABLE OF VARCHAR2(20)
/

CREATE TABLE animals
(
  genus VARCHAR2(20),
  species SPECIES_LIST
) NESTED TABLE species STORE AS species_tab
/

BEGIN

  INSERT INTO animals VALUES
  (
    'mammal',
    SPECIES_LIST('lion', 'tiger', 'leopard', 'cheetah', 'jaguar')
  );

END;
/
echo table populated

DECLARE

  species SPECIES_LIST;
  i       NUMBER(1);

BEGIN

  dbms_output.enable(1000000);

  SELECT species
  INTO   species
  FROM   animals
  WHERE  genus = 'mammal';

  i := species.FIRST;
  WHILE i IS NOT NULL
  LOOP
    dbms_output.put_line('species = ' || species(i));
    i := species.NEXT(i);
  END LOOP;


END;
/



  

