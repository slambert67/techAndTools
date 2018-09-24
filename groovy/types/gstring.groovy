// GStrings. Strings with additional capabilities
// declared in double quotes
// what makes a double quoted string a GString is the appearance of placeholders
      
// dollar dereferencing
def me = 'Tarzan'
def you = 'Jane'
def line = "me $me - you $you"  
println line

// dollar dereferencing extended to use property accessors
def date = new Date()
def out = "Year $date.year Month $date.month Day $date.date"  // dollar dereferencing extended to use property accessors
println date
println out

// dereferencing using a closure
out = "Date is ${date.toGMTString()}"
println out

// literal dollar sign
out = "my 0.02\$"
println out

// can capture fixed and dynamic parts
println "line = " + line
println "String 1 = " + line.strings[0]
println "Value 1 = " + line.values[0]
println "String 2 = " + line.strings[1]
println "Values 2 = " + line.values[1]