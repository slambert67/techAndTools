import java.util.*;

public class Song2
{
  private String Title;
  private String Singer;
  
  public Song2( String pTitle, String pSinger )
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
    return this.Title + " by " + this.Singer;
  }
   
  public static void main( String[] args )
  {
    Song2 MySong;
	ArrayList<Song2> mySongs;

	class TitleCompare implements Comparator<Song2>
	{
	  public int compare( Song2 pSong1, Song2 pSong2 )
	  {
        return pSong1.getTitle().compareTo( pSong2.getTitle() );
	  }
	}	

	class SingerCompare implements Comparator<Song2>
	{
	  public int compare( Song2 pSong1, Song2 pSong2 )
	  {
        return pSong1.getSinger().compareTo( pSong2.getSinger() );
	  }
	}
	
	mySongs = new ArrayList<Song2>();
	MySong = new Song2( "The Mercy Seat", "Nick Cave" );
	mySongs.add( MySong );
	MySong = new Song2( "Comfortably Numb", "Pink Floyd" );
	mySongs.add( MySong );
	System.out.println("My songs : " + mySongs);
	
	TitleCompare MyTitleComparator = new TitleCompare();
	Collections.sort( mySongs, MyTitleComparator );
	System.out.println("My songs sorted by title: " + mySongs);
	
	SingerCompare MySingerComparator = new SingerCompare();
	Collections.sort( mySongs, MySingerComparator );
	System.out.println("My songs sorted by singer: " + mySongs);	
	
  }
}