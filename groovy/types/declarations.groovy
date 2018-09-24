// def keyword indicates that no particular type is demanded. Instance of type Object I think
// def : dynamic typing
// no def : static typing
def a = 1     // implicit typing. java.lang.Integer
def b = 1.0f  // implicit typing. java.lang.float
      
int c = 1     // explicit typing using java primitives. java.lang.Integer
float d = 1   // explicit typing using java primitives. java.lang.Float
      
Integer e = 1  // explicit typing using reference type names. java.lang.Integer
String f = '1' // explicit typing using reference type names. java.lang.String
      
def g = 1
g = g.plus(1)  // cg g = g + 1. Operator overriding
println "g = " + g