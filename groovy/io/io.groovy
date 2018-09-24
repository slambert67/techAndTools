// list files in a directory
File myDirectory = new File("io/mydir")  //new File object based on existing file

if ( myDirectory.exists() ) {
    println("directory exists")
} else {
    println("directory does not exist")
}

myDirectory.eachFile {
    println(it.canonicalFile)
    
    Properties myProperties = new Properties()
    
    it.withInputStream { stream ->
        myProperties.load(stream)    
    }
    
    println("a=" + myProperties["a"])
    println("b=" + myProperties["b"])
}

 