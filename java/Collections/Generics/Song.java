import java.util.*;

public class Song implements Comparable<Song>
{
  private String Title;
  private String Singer;
  
  public Song( String pTitle, String pSinger )
  {
    this.Title = pTitle;
    this.Singer = pSinger;
  }
  
  public void setTitle( String pTitle )
  {
    this.Title = pTitle;
  }
  
  public void setSinger( String pSinger )
  {
    this.Singer = pSinger;
  }
  
  public String getTitle()
  {
    return this.Title;
  }
  
  public String getSinger()
  {
    return this.Singer;
  }
  
  public String toString()
  {
    return this.Title;
  }
  
  public int compareTo( Song pSong )
  {
    return this.Title.compareTo( pSong.getTitle() );
  }
  
  public static void main( String[] args )
  {
    Song MySong;
	ArrayList<Song> mySongs;
	
	/*MySong = new Song("The Mercy Seat", "Nick Cave");	
	System.out.println(MySong.getTitle() + " by " + MySong.getSinger() + ":" + MySong.toString() );*/
	
	mySongs = new ArrayList<Song>();
	MySong = new Song( "The Mercy Seat", "Nick Cave" );
	mySongs.add( MySong );
	MySong = new Song( "Comfortably Numb", "Pink Floyd" );
	mySongs.add( MySong );
	System.out.println("My songs : " + mySongs);
	
	Collections.sort( mySongs );
	System.out.println("My sorted songs : " + mySongs);
	
	
	
  }
}