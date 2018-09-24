import java.util.*;

class Employee
{
  // instance fields

  private String Name;
  private double Salary;
  private Date   HireDay;

  // constructors

  public Employee( String pName,
                   double pSalary,
                   int    pYear,
                   int    pMonth,
                   int    pDay )
  {
    GregorianCalendar MyCalendar;

    Name = pName;
    Salary = pSalary; 

    MyCalendar = new GregorianCalendar( pYear, pMonth-1, pDay);
    HireDay = MyCalendar.getTime();   
  }

  // methods

  public String getName()
  {
    return Name;
  }


}