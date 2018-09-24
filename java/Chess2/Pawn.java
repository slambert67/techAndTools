class Pawn extends Piece
{
  // instance fields

  Offset[] Offsets;

  // constructors

  public Pawn ( String pIcon,
                int    pValue )
  {
    super( pIcon, pValue );

    Offsets = new Offset[1];

    if ( pIcon == "p" ) // black pawn
    {
      Offsets[0] = new Offset(0,1);
    }
    else
    {
      Offsets[0] = new Offset(0,-1);
    }
  }

}