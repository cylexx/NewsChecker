import java.io.IOException;
import java.util.Timer;

import twitter4j.TwitterException;

public class TwitterConnect {
	
	private static CheckFile check;
	
	//TODO Do a real listener on file change
	public static void main(String[] args) throws TwitterException, IOException{
 
		Timer timer = new Timer();
		check = new CheckFile();
		timer.schedule(check, 0, 2*60000);
	}

}
