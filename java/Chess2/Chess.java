import javax.swing.*;

class Chess
{

  public static void main( String[] args )
  {
    Board    TheBoard = new Board();
    String   Response;
    Human    HumanPlayer;
    Computer ComputerPlayer;

    Rook br1 = new Rook( "r", 5 );
    Knight bn1 = new Knight( "n", 3 );
    Bishop bb1 = new Bishop( "b", 3 );
    Queen bq = new Queen( "q", 9 );
    King bk = new King( "k", 999 );
    Bishop bb2 = new Bishop( "b", 3 );
    Knight bn2 = new Knight( "n", 3 );
    Rook br2 = new Rook( "r", 5 );
    Pawn bp1 = new Pawn( "p", 1 );
    Pawn bp2 = new Pawn( "p", 1 );
    Pawn bp3 = new Pawn( "p", 1 );
    Pawn bp4 = new Pawn( "p", 1 );
    Pawn bp5 = new Pawn( "p", 1 );
    Pawn bp6 = new Pawn( "p", 1 );
    Pawn bp7 = new Pawn( "p", 1 );
    Pawn bp8 = new Pawn( "p", 1 );

    Rook wr1 = new Rook( "R", 5 );
    Knight wn1 = new Knight( "N", 3 );
    Bishop wb1 = new Bishop( "B", 3 );
    Queen wq = new Queen( "Q", 9 );
    King wk = new King( "K", 999 );
    Bishop wb2 = new Bishop( "B", 3 );
    Knight wn2 = new Knight( "N", 3 );
    Rook wr2 = new Rook( "R", 5 );
    Pawn wp1 = new Pawn( "P", 1 );
    Pawn wp2 = new Pawn( "P", 1 );
    Pawn wp3 = new Pawn( "P", 1 );
    Pawn wp4 = new Pawn( "P", 1 );
    Pawn wp5 = new Pawn( "P", 1 );
    Pawn wp6 = new Pawn( "P", 1 );
    Pawn wp7 = new Pawn( "P", 1 );
    Pawn wp8 = new Pawn( "P", 1 );

    TheBoard.ClearBoard();

    TheBoard.AddPiece( br1, 0, 0 );
    TheBoard.AddPiece( bn1, 1, 0 );
    TheBoard.AddPiece( bb1, 2, 0 );
    TheBoard.AddPiece( bq, 3, 0 );
    TheBoard.AddPiece( bk, 4, 0 );
    TheBoard.AddPiece( bb2, 5, 0 );
    TheBoard.AddPiece( bn2, 6, 0 );
    TheBoard.AddPiece( br2, 7, 0 );
    TheBoard.AddPiece( bp1, 0, 1 );
    TheBoard.AddPiece( bp2, 1, 1 );
    TheBoard.AddPiece( bp3, 2, 1 );
    TheBoard.AddPiece( bp4, 3, 1 );
    TheBoard.AddPiece( bp5, 4, 1 );
    TheBoard.AddPiece( bp6, 5, 1 );
    TheBoard.AddPiece( bp7, 6, 1 );
    TheBoard.AddPiece( bp8, 7, 1 );


    TheBoard.AddPiece( wr1, 0, 7 );
    TheBoard.AddPiece( wn1, 1, 7 );
    TheBoard.AddPiece( wb1, 2, 7 );
    TheBoard.AddPiece( wq, 3, 7 );
    TheBoard.AddPiece( wk, 4, 7 );
    TheBoard.AddPiece( wb2, 5, 7 );
    TheBoard.AddPiece( wn2, 6, 7 );
    TheBoard.AddPiece( wr2, 7, 7 );
    TheBoard.AddPiece( wp1, 0, 6 );
    TheBoard.AddPiece( wp2, 1, 6 );
    TheBoard.AddPiece( wp3, 2, 6 );
    TheBoard.AddPiece( wp4, 3, 6 );
    TheBoard.AddPiece( wp5, 4, 6 );
    TheBoard.AddPiece( wp6, 5, 6 );
    TheBoard.AddPiece( wp7, 6, 6 );
    TheBoard.AddPiece( wp8, 7, 6 );

    TheBoard.PrintBoard();

    Response = JOptionPane.showInputDialog("Human plays white? (Y/N)");

    if ( Response.equals("Y") )
    {
      HumanPlayer = new Human( "White" );
      ComputerPlayer = new Computer( "Black" );
    }
    else
    {
      HumanPlayer = new Human( "Black" );
      ComputerPlayer = new Computer( "White" );
    }

    while ( TheBoard.GameOver() == false )
    {
      HumanPlayer.MakeMove( TheBoard );
      TheBoard.PrintBoard();
      ComputerPlayer.MakeMove( TheBoard );
    }

    System.exit(0);
  }
  
}