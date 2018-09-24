package BanPackage;

class Person
{
  String Forename;
  String Surname;
  
  void ShowAttributes()
  {
    System.out.println("Forename = " + Forename);
    System.out.println("Surname = " + Surname);
  }
  
  protected void finalize() throws Throwable
  {
    System.out.println("person garbage collected!");
  }
}

class Student extends Person
{
  int PIDM;
  
  /* constructor method */
  Student ( String pForename,
            String pSurname,
            int    pPIDM )
  {
    Forename = pForename;
    Surname = pSurname;
    PIDM = pPIDM;
  }
  
  /* finalize method */
  protected void finalize() throws Throwable
  {
    System.out.println("student garbage collected!");
  }
  
  void ShowAttributes()
  {
    super.ShowAttributes();
    System.out.println("PIDM = " + PIDM);
  }
}

public class BanClass 
{
  public static void main(String[] args)
  {
    Student Me;
    
    Me = new Student("Steve", "Lambert", 666);
    
    Me.ShowAttributes();
  }
}