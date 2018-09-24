import org.apache.commons.lang.StringUtils

String myString = "abcdefghijklmnopqrstuvwxyz"

// check for contained character
if ( StringUtils.contains(myString,"j") ) {
  println("contains j")
}

// check for contained string
if ( StringUtils.contains(myString,"jklm") ) {
  println("contains jklm")
}

// contains any character
if ( StringUtils.containsAny(myString,"123a") ) {
  println("contains 123a")
}


