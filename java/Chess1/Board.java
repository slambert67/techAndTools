class Board
{
  // instance fields

  private Square [][] TheBoard;

  // constructors


  public Board ()
  {
    this.TheBoard = new Square[8][8];
  }

  // methods

  public void ClearBoard ()
  {
    for ( int y=0; y<=7; y++ )
    {
      for ( int x=0; x<=7; x++ )
      {
        //System.out.print( "-");
        this.TheBoard[y][x] = new Square();
      }
      
      //System.out.println();
    } 
  }

  public void PrintBoard ()
  {
    Square TheSquare;
    Piece  ThePiece;
    String ThePieceType;

    for ( int y=0; y<=7; y++ )
    {
      for ( int x=0; x<=7; x++ )
      {
        TheSquare = this.TheBoard[y][x];
        ThePiece = TheSquare.getContents();
        ThePieceType = ThePiece.getPieceType();

        System.out.print( ThePieceType );
      }
      
      System.out.println();
    } 
  }

  // main

  public static void main( String[] args )
  {
    Board TheBoard = new Board();

    TheBoard.ClearBoard();
    TheBoard.PrintBoard();

 
    System.out.println( "hello world" );
  }


}