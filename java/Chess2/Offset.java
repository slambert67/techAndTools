class Offset
{
  // instance fields

  private int XOffset;
  private int YOffset;

  // constructors

  public Offset (int pX, int pY)
  {
    this.XOffset = pX;
    this.YOffset = pY;
  }

  // methods

  public int getX()
  {
    return XOffset;
  }

  public int getY()
  {
    return YOffset;
  }

  // main

  public static void main ( String[] args )
  {
    System.out.println( "In Offset class");
  }

}