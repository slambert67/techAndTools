public class NumList
{
  int num1;
  int num2;
  int num3;
  
  public NumList( int pnum1, int pnum2, int pnum3 )
  {
    num1 = pnum1;
	num2 = pnum2;
	num3 = pnum3;
  }
  
  public int getnum1()
  {
    return num1;
  }

  public int getnum2()
  {
    return num2;
  }

  public int getnum3()
  {
    return num3;
  }
  
  public void PrintNumList( String name )
  {
    System.out.println(name + " = " + num1 + num2 + num3 + " : " + this.hashCode() );
  }
  
  public boolean equals( NumList pNumList )
  {
    if ( pNumList.getnum1() == num1 &&
	     pNumList.getnum2() == num2 &&
		 pNumList.getnum3() == num3 )
	{
	  return true;
	}
	else
	  return false;
  }
  
  public static void main( String[] args )
  {
    NumList numlist1 = new NumList(1,2,3);
	NumList numlist2 = new NumList(1,2,3);
	
    numlist1.PrintNumList("numlist1");
	numlist2.PrintNumList("numlist2");
	
	/* with equals not overridden
	if ( numlist1.equals(numlist2) )
	  System.out.println("The number lists are equal");
	else
	  System.out.println("The number lists are unequal");*/
	  
	//with equals overridden
	if ( numlist1.equals(numlist2) )
	  System.out.println("The number lists are equal");
	else
	  System.out.println("The number lists are unequal");
  }
}
