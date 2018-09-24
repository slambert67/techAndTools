/*log = ''
(1..10).each{ counter -> log += counter }  // counter is named parameter
println log

log = ''
(1..10).each{ log += it }  // it is implicit parameter
println log

def printer = { line -> println line }  // closure can be assigned to a variable*/

class MethodClosureSample
{
  int limit
  
  MethodClosureSample (int limit)
  {
    this.limit = limit
  }
  
  boolean validate (String value)
  {
    return value.length() <= limit
  }
}

MethodClosureSample first = new MethodClosureSample(6)
MethodClosureSample second = new MethodClosureSample(5)

Closure firstClosure = first.&validate  // method closure assignment

def words = ['long string', 'medium', 'short', 'tiny']

println words.findAll(firstClosure)
println words.findAll(second.&validate)