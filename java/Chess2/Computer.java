class Computer extends Player
{
  // instance fields

  private String Icons[] = new String[6];
  private Move LegalMoves[] = new Move[100];

  // constructors

  public Computer ( String pColour )
  {
    super( pColour );

    if ( pColour == "White" )
    {
      this.Icons[0] = "P";
      this.Icons[1] = "R";
      this.Icons[2] = "N";
      this.Icons[3] = "B";
      this.Icons[4] = "K";
      this.Icons[5] = "Q";
    }
    else
    {
      this.Icons[0] = "p";
      this.Icons[1] = "r";
      this.Icons[2] = "n";
      this.Icons[3] = "b";
      this.Icons[4] = "k";
      this.Icons[5] = "q";
    }
  }

  public void MakeMove( Board pBoard )
  {
    GenerateMoves();
  }

  // private methods

  private void GenerateMoves()
  {
    System.out.println("Comp makes move");

    for ( int y=0; y<=7; y++ )
    {
      for ( int x=0; x<=7; x++ )
      {
        for ( int i=0; i<=5; i++ )
        {

        }
      }   
    }

 
  }

}