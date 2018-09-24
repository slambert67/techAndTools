// basic exception handling
try {

  def i = 1/0
  
} catch (Exception e) {

  println( e.toString() )
}