class Test
{
  def sum( Map args )
  {
    ['a','b','c'].each{args.get(it,0)}
    
    return args.a + args.b + args.c
  }
}

def test = new Test()

println test.sum(a:1, b:2, c:7)