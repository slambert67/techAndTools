import javax.swing.*;

class Human extends Player
{
  // instance fields


  // constructors

  public Human ( String pColour )
  {
    super( pColour );
  }

  // methods

  public void MakeMove( Board pBoard )
  {
    String Response;
    int    FromX;
    int    FromY;
    int    ToX;
    int    ToY;

    Response = JOptionPane.showInputDialog("FromX?");
    FromX = Integer.parseInt( Response );
    Response = JOptionPane.showInputDialog("FromY?");
    FromY = Integer.parseInt( Response );
    Response = JOptionPane.showInputDialog("ToX?");
    ToX = Integer.parseInt( Response );
    Response = JOptionPane.showInputDialog("ToY?");
    ToY = Integer.parseInt( Response );

    pBoard.UpdateBoard( FromX, FromY, ToX, ToY );
  }
}