class Piece
{
  // instance fields

  private String Icon;
  private int    Value;

  // constructors


  public Piece ( String pIcon,
                 int    pValue )
  {
    this.Icon = pIcon;
    this.Value = pValue;
  }

  // methods


  public void setIcon( String pIcon )
  {
    Icon = pIcon;
  }


  public String getIcon()
  {
    return Icon;
  }

  // main

  public static void main( String[] args )
  {
    System.out.println( "In Piece Class" );
  }
}