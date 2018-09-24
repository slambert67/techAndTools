public class EmployeeTest
{
  public static void main( String[] args )
  {
    Employee[] Staff = new Employee[3];
    // why is new needed when used below for each element?

    Staff[0] = new Employee( "Steve Lambert", 10000, 1967, 6, 13 );
    Staff[1] = new Employee( "Simon Abercrombie", 10000, 1967, 6, 14 );
    Staff[2] = new Employee( "Angela McGinness", 10000, 1967, 6, 15 );

    // print staff names
    for (int i=0; i<Staff.length; i++)
    {
      System.out.println("Name = " + Staff[i].getName() );
    }
  }
}