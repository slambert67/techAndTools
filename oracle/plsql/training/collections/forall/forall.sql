--CREATE TABLE parts (pnum NUMBER(5), pname CHAR(15));

  DECLARE
     TYPE NumTab IS TABLE OF NUMBER(5) INDEX BY BINARY_INTEGER;
     TYPE NameTab IS TABLE OF CHAR(15) INDEX BY BINARY_INTEGER;
     pnums  NumTab;
     pnames NameTab;
     t1 NUMBER(5);
     t2 NUMBER(5);
     t3 NUMBER(5);
     PROCEDURE get_time (t OUT NUMBER) IS
     BEGIN SELECT TO_CHAR(SYSDATE,'SSSSS') INTO t FROM dual; END;
  BEGIN

     FOR j IN 1..10000 LOOP  -- load index-by tables
        pnums(j) := j;
        pnames(j) := 'Part No. ' || TO_CHAR(j); 
     END LOOP;

     get_time(t1);
     FOR i IN 1..10000 LOOP  -- use FOR loop
        INSERT INTO parts VALUES (pnums(i), pnames(i));
     END LOOP;

     get_time(t2);
     FORALL i IN 1..10000  -- use FORALL statement
        INSERT INTO parts VALUES (pnums(i), pnames(i));
     dbms_output.put_line( 'BULK_ROWCOUNT' );
     dbms_output.put_line( '1 : ' || sql%bulk_rowcount(1) );
     dbms_output.put_line( '2 : ' || sql%bulk_rowcount(2) );
     get_time(t3);

     DBMS_OUTPUT.PUT_LINE('Execution Time (secs)');
     DBMS_OUTPUT.PUT_LINE('---------------------');
     DBMS_OUTPUT.PUT_LINE('FOR loop: ' || TO_CHAR(t2 - t1));
     DBMS_OUTPUT.PUT_LINE('FORALL:   ' || TO_CHAR(t3 - t2));
 END;
