import javax.swing.*;

class Board
{
  // instance fields

  private Piece [][] TheBoard;

  // constructors


  public Board ()
  {
    this.TheBoard = new Piece[8][8];
  }


  // methods

  public void ClearBoard ()
  {
    for ( int y=0; y<=7; y++ )
    {
      for ( int x=0; x<=7; x++ )
      {
        this.TheBoard[x][y] = null;
      }   
    } 
  }

  public void AddPiece ( Piece pPiece,
                         int   pX,
                         int   pY )
  {
    this.TheBoard[pX][pY] = pPiece;
  }

  public void UpdateBoard( int pFromX,
                           int pFromY,
                           int pToX,
                           int pToY )
  {
    TheBoard[pToX][pToY] = TheBoard[pFromX][pFromY];
    TheBoard[pFromX][pFromY] = null;
  }


  public void PrintBoard ()
  {
    Piece  ThePiece;
    String TheIcon;

    System.out.println();

    for ( int y=0; y<=7; y++ )
    {
      for ( int x=0; x<=7; x++ )
      {
        ThePiece = TheBoard[x][y];

        if ( ThePiece  == null )
        {
          System.out.print( " - " );
        }
        else
        {
          TheIcon = ThePiece.getIcon();

          System.out.print( " " + TheIcon + " " );
        }
      }
      
      System.out.println();
      System.out.println();
    } 
  }

  public boolean GameOver()
  {
    String  Response;
    boolean Result;

    Response = JOptionPane.showInputDialog("Game Over? (Y/N)");

    if ( Response.equals("Y") || Response.equals("y") )
    {
      Result = true;
    }
    else
    {
      Result = false;
    }

    return Result;
  }

  // main

  public static void main( String[] args )
  {
    Board TheBoard = new Board();

    TheBoard.ClearBoard();

    /*TheBoard.AddPieces( );*/

    TheBoard.PrintBoard();

 

  }


}