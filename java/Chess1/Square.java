class Square
{
  // instance fields

  private String XCoord;
  private String YCoord;
  private Piece  Contains;

  // constructors
  public Square()
  {
    this.Contains = new Piece();
  }

  // methods

  public Piece getContents()
  {
    return Contains;
  }

  // main

  public static void main( String[] args )
  {
    System.out.println( "hello world" );
  }


}