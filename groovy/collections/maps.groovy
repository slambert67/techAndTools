def myMap = [a:1, b:2, c:3]  // keys of type string can omit quotes
assert myMap instanceof HashMap
assert myMap.size() == 3
assert myMap['a'] == 1
      
def emptyMap = [:]
assert emptyMap.size() == 0
      
def explicitMap = new TreeMap()
explicitMap.putAll(myMap)
assert explicitMap['a'] == 1
println("Map specification assertions successful")

def myMap2 = [a:1, b:2, c:3]
      // retrieve elements
assert myMap2['a'] == 1  // quotes required here
assert myMap2.a == 1
assert myMap2.get('a') == 1
assert myMap2.get('d',0) == 0  // supply default value if retrieval fails
println("Map retrieval assertions successful")

// assign values
myMap2['d'] = 4
assert myMap2.d == 4
myMap2['d'] = 5
assert myMap2.d == 5
println("Map assignment assertions successful")

def myMap3 = [a:1, b:2, c:3]
def other = [b:2, c:3, a:1]     
// normal jdk methods
assert myMap3 == other
assert myMap3.isEmpty() == false
assert myMap3.size() == 3
assert myMap3.containsKey('a')
assert myMap3.containsValue(1)
println("JDK method assertions successful")

// methods added by GDK
assert myMap3.any {entry -> entry.value > 2}
assert myMap3.every {entry -> entry.key < 'd'}
println("GDK method assertions successful")

// GDK iteration over maps
def myMap4 = [a:1, b:2, c:3]
def store = ''
      
// iterate over entries
myMap4.each {entry ->
  store += entry.key
  store += entry.value
}
assert store.contains('a1')
      
// iterate over key/values
store = ''
myMap4.each {key,value ->
  store += key
  store += value
}
assert store.contains('a1')
      
// iterate over the keys
store = ''
for ( key in myMap4.keySet() ) {
  store += key
}
assert store.contains('a')
      
// iterate over the values
store = ''
for ( value in myMap4.values() ) {
  store += value
}
assert store.contains('1')
println("Iteration assertions successful")