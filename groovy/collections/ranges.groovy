// inclusive ranges
assert (0..10).contains(0)
assert (0..10).contains(10)
assert (0..10).contains(11) == false
println("Inclusive range assertions successful")

// half exclusive ranges
assert (0..<10).contains(10) == false
println("Half exclusive range assertions successful")

// references to defined ranges
def a = 0..10  // reference to object of type groovy.lang.Range
assert a instanceof Range
println("Range reference assertions successful")

// explicit construction
def b = new IntRange(0,10)
assert b.contains(5)
println("Explicitly constructed range assertions successful")

// date ranges
def today = new Date()
def yesterday = today-1
assert (yesterday..today).size() == 2
println("Date range assertions successful")

// string ranges
assert ('a'..'c').contains('b')
println("String range assertions successful")

// for-in-range loop
def log = ''
for (element in 5..9) {
  log += element
}
println("log = " + log)
      
// with closure
log = ''
(9..<5).each { element ->
  log += element
}
println("log built with closure = " + log)            