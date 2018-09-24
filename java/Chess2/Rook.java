class Rook extends Piece
{
  // instance fields

  Offset[] Offsets;

  // constructors

  public Rook ( String pIcon,
                int    pValue )
  {
    super( pIcon, pValue );

    Offsets = new Offset[4];

    Offsets[0] = new Offset(0,-1);
    Offsets[1] = new Offset(1,0);
    Offsets[2] = new Offset(0,1);
    Offsets[3] = new Offset(-1,0);
  }

}