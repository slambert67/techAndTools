import java.util.*;

public class MyList {
  
  public static void main( String[] args ) {

    List<String> list1 = new ArrayList<String>();  // List interface extends Collection interface  
	List<String> list2 = new ArrayList<String>();  
	
	// this also works
    //ArrayList<String> list1 = new ArrayList<String>(); 	
	//ArrayList<String> list2 = new ArrayList<String>();
	
	// add
    System.out.print("Adding 3 elements to list\n");
	list1.add("First element");
	list1.add("Second element");
	list1.add("Third element");
	System.out.println("List = " + list1);
	System.out.println("");

	// contains
	if ( list1.contains("First element") == true )
	  System.out.println("List contains first element");
	else
	  System.out.println("List does not contain first element");

	if ( list1.contains("Fourth element") == true )
	  System.out.println("List contains fourth element");
	else
	  System.out.println("List does not contain fourth element");
	
	System.out.println("");
	
	// set
	System.out.println("Changing element values");
	list1.set(0, "Element1");
	list1.set(1, "Element2");
	System.out.println("List = " + list1);
	System.out.println("");
	
	// remove element specified by index
	System.out.println("Removing an element by index");
	list1.remove(2);
	System.out.println("List = " + list1);
	System.out.println("");
	
	// remove specified element
	System.out.println("Removing a specified element");
	list1.remove("Element2");
	System.out.println("List = " + list1);
	System.out.println("");
	
	// size
	System.out.println("List size = " + list1.size() );
	System.out.println("");;
	  
	// clear
	System.out.print("Clearing elements from list\n");
	list1.clear();
	System.out.println("List = " + list1);
	System.out.println("");
	
	// addAll
	list1.add("Element4");
	list1.add("Element3");
	list2.add("Element2");
	list2.add("Element1");
	list1.addAll( list2 );
	System.out.println("List = " + list1);
	System.out.println("");	
	
	// sort 
	Collections.sort( list1 );
	System.out.println("List = " + list1);
	System.out.println("");	
	
  }
}