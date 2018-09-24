import java.util.HashMap

class Book
{
  private String title
  
  Book (String theTitle)
  {
    title = theTitle
  }
  
  String getTitle()
  {
    return title
  }
}

HashMap<Book,Integer> myHashMap = new HashMap<Book,Integer>()
Integer bookIndex
Set     myKeySet
Collection myValues

Book book1 = new Book("Mr Bump")
Book book2 = new Book("Mr Tickle")
Book retrievedBook

myHashMap.put(book1,1)
myHashMap.put(book2,2)

bookIndex = myHashMap.get(book1)
println ("book index = " + bookIndex)

bookIndex = myHashMap.get(book2)
println ("book index = " + bookIndex)

println ( "book1 is key : " + myHashMap.containsKey(book1))

println("1 is a value : " + myHashMap.containsValue(1))

myKeySet = myHashMap.keySet()
myKeySet.each {
  println it.getTitle()
}

myValues = myHashMap.values()
myValues.each {
  println it
}

println("ok")





