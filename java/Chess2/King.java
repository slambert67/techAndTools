class King extends Piece
{
  // instance fields

  Offset[] Offsets;

  // constructors

  public King ( String pIcon,
                int    pValue )
  {
    super( pIcon, pValue );

    Offsets = new Offset[8];

    Offsets[0] = new Offset(-1,-1);
    Offsets[1] = new Offset(0,-1);
    Offsets[2] = new Offset(1,-1);
    Offsets[3] = new Offset(1,0);
    Offsets[4] = new Offset(1,1);
    Offsets[5] = new Offset(0,1);
    Offsets[6] = new Offset(-1,1);
    Offsets[7] = new Offset(-1,0);
  }

  // methods


  // main

  public static void main ( String[] args )
  {
    King WhiteKing;

    System.out.println( "In King class" );

    WhiteKing = new King( "K", 999 );

    System.out.println("Icon = " + WhiteKing.getIcon() );

  }

}