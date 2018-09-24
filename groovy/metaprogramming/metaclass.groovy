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

Book newBook = new Book("The Magus")

assert newBook.metaClass.respondsTo(newBook, "getTitle")
assert newBook.metaClass.hasProperty(newBook, "title" )
println("metaclass assertions successful")

println( "properties" )
println( "==========" )
newBook.metaClass.getProperties().each {
  println(it.name)
}