class Piece
{
  // instance fields

  private String Colour;
  private String PieceType;

  // constructors

  public Piece ()
  {
    this.PieceType = "-";
  }

  public Piece ( String pColour,
                 String pPieceType )
  {
    this.Colour = pColour;
    this.PieceType = pPieceType;
  }

  // methods

  public String getPieceType ()
  {
    return PieceType;
  }

  // main

  public static void main( String[] args )
  {
    System.out.println( "hello world" );
  }


}