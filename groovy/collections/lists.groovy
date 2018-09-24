// basic list declaration
def myList = [1,2,3]
assert myList.size() == 3
assert myList[0] == 1
assert myList instanceof ArrayList
println("basic list assertions successful")

// list declaration using range
def longList = (0..1000).toList()
assert longList.size() == 1001
println("range declared list assertions successful")

// explicit declaration
def explicitList = new ArrayList()
explicitList.addAll(myList)
assert explicitList.size() == 3
println("explicit list assertions successful")

def myList2 = ['a','b','c','d','e','f']      
//retrieving elements
assert myList2[0..2] == ['a','b','c']   // getAt(Range)
assert myList2[0,2,4] == ['a','c','e']  // getAt(Collection of indexes)
      
// updating elements
myList2[0..2] = ['x','y','z']           // putAt(Range)
assert myList2 == ['x','y','z','d','e','f']
      
// deleting elements
myList2[3..5] = []
assert myList2 == ['x','y','z']
      
// adding elements
myList2[1..1] = ['y','1','2']
assert myList2 == ['x','y','1','2','z']
println("List access [by subscript] assertions successful")

def myList3 = []
myList3 += 'a'  // plus(Object)
assert myList3 == ['a']
      
myList3 += ['b','c']  // plus(Collection)
assert myList3 == ['a','b','c']
      
myList3 = []
myList3 << 'a' << 'b'  // << is like append
assert myList3 == ['a','b']
      
myList3 -= 'b' // minus(Object) I think
assert myList3 == ['a']
println("List access [by method] assertions successful")

// sorting lists
def myList4 = [5,4,3,2,1]
myList4.sort { a,b -> a.compareTo(b) }
assert myList4 == [1,2,3,4,5]
println("List sorting assertions succesful")

// finding element in list
def myList5 = [1,2,3,4,5]
def foundElement = myList5.find { it == 3 }
assert foundElement == 3
println("List finding assertions successful")