// single quoted strings. Not GString aware. Equivalent to java string literals
def singleQuotedString = 'single quoted string : hello steve'
println singleQuotedString

// double quoted strings. Treated as GString if contains unescaped dollar signs
def name = 'Steve'
def doubleQuotedString = "double quoted string $name"  // prints the value of $name
println doubleQuotedString

// misc string operations
def greeting = 'Hello Groovy!'
println "greeting = " + greeting

println "First letter = " + greeting.getAt(0)  // alert("First letter = " + greeting[0]) equivalent
println "second word is " + greeting[6..11]
println 'There are ' + greeting.count('o') + ' instances of the letter o'