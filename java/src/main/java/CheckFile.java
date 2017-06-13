import java.io.BufferedReader;
import java.io.FileReader;
import java.io.FileWriter;
import java.io.IOException;
import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.TimerTask;

import org.apache.commons.lang3.ArrayUtils;
import org.json.JSONArray;
import org.json.JSONObject;

import com.mongodb.BasicDBObject;
import com.mongodb.DB;
import com.mongodb.DBCollection;
import com.mongodb.Mongo;

import twitter4j.FilterQuery;
import twitter4j.StallWarning;
import twitter4j.Status;
import twitter4j.StatusDeletionNotice;
import twitter4j.StatusListener;
import twitter4j.TwitterException;
import twitter4j.TwitterStream;
import twitter4j.TwitterStreamFactory;
import twitter4j.URLEntity;
import twitter4j.auth.AccessToken;

public class CheckFile extends TimerTask{
	
	private static long[] arrayId;
	private static TwitterStream twitterStream = new TwitterStreamFactory().getInstance();
	public CheckFile() throws TwitterException, IOException{
		listenToTwitter();
	}
	
	public void listenToTwitter()throws TwitterException, IOException{
		Mongo mongo = new Mongo("127.0.0.1", 27017);
		DB db = mongo.getDB("NewsChecker");
		DBCollection twit = db.getCollection("tweet");
		DateFormat df = new SimpleDateFormat("MM/dd/yyyy HH:mm:ss");
		
	    StatusListener listener = new StatusListener(){
	    	
	        public void onStatus(Status status) {
	        	long id = status.getUser().getId();
	        	if(checkAccountIsInFile(id)){
	        		if(status.isRetweet()){
	        			if(!checkAccountIsInFile(status.getRetweetedStatus().getUser().getId())){
	        				System.out.println("New account : "+status.getRetweetedStatus().getUser().getScreenName());
	        				//addAccountInFile(status);
	        			}else{
	        				System.out.println("Change mark of : "+status.getRetweetedStatus().getUser().getScreenName()+" and "+status.getUser().getScreenName());
	        				changeMark(status);
	        			}
	        		}
	        		System.out.println("New tweet : "+status.getText());
	        		
		        	String name = status.getUser().getScreenName();
		        	String url = "";
		        	for (URLEntity urle : status.getURLEntities()) {
		        		url = urle.getDisplayURL();
		            }
		        	String txt = status.getText();
		        	String img = status.getUser().getProfileImageURL();
		        	String date = df.format(status.getCreatedAt());
		            BasicDBObject mac = new BasicDBObject();
		            mac.put("authorId", id);
		            mac.put("name", name);
		            mac.put("text", txt);
		            mac.put("date", date);
		            mac.put("img", img);
		            mac.put("url", url);
		    		twit.insert(mac);
	        	}
	        }
	        public void onDeletionNotice(StatusDeletionNotice statusDeletionNotice) {}
	        public void onTrackLimitationNotice(int numberOfLimitedStatuses) {}
	        public void onException(Exception ex) {ex.printStackTrace();}
			@Override
			public void onScrubGeo(long arg0, long arg1) {}
			@Override
			public void onStallWarning(StallWarning arg0) {}
	    };
	    twitterStream.addListener(listener);
	    twitterStream.setOAuthConsumer("HzhUWddOvobp3nKHbradGuTBF", "enswXT8asLcnyom18BLCUSkrRx3FgV8tFItgKoNGtVEsFQ5XGM");
	    twitterStream.setOAuthAccessToken(new AccessToken("2203195831-cOSFu1QeMs5pHVO3zjQykeQK674AjLHhAOmK3zj", "SEZbPz5O78RNPzd2Smc6K0RxgS3jhhqlvfdUd9KskHil3"));
	}
	
	/**
	 * Check if an account is in the file of twitter account
	 * @param id Identifiaction of the account
	 * @return true if he is in file, false if not
	 */
	private boolean checkAccountIsInFile(Long id) {
		for(int i=0; i<arrayId.length; i++){
    		if(arrayId[i]==id){
    			return true;
    		}
    	}
		return false;
	}
	
	/**
	 * Change the mark of two accounts
	 * @param status
	 */
	private void changeMark(Status status){
		BufferedReader br = null;
		FileReader fr = null;

		try {

			fr = new FileReader("./sources/sources.json");
			br = new BufferedReader(fr);

			JSONArray json = new JSONArray(br.readLine());
			JSONObject account = null;
			JSONObject accountRetweeted = null;

			for(int i = 0; i < json.length(); i++){
				if(Long.parseLong(json.getJSONObject(i).get("id").toString()) == status.getUser().getId()){
					account = json.getJSONObject(i);
					
				}
				if(Long.parseLong(json.getJSONObject(i).get("id").toString()) == status.getRetweetedStatus().getUser().getId()){
					accountRetweeted = json.getJSONObject(i);
				}
			}
			
			long accountMark = Long.parseLong(account.get("mark").toString());
			long rewteetedAccountMark = Long.parseLong(accountRetweeted.get("mark").toString());
			if(Math.abs(accountMark - rewteetedAccountMark)>1){
				if(accountMark > rewteetedAccountMark){
					if(rewteetedAccountMark<100){
						accountRetweeted.put("mark", rewteetedAccountMark+1);
					}
					if(accountMark>0){
						account.put("mark", accountMark-1);
					}
				}
				else if(rewteetedAccountMark > accountMark){
					if(rewteetedAccountMark>0){
						accountRetweeted.put("mark", rewteetedAccountMark-1);
					}
					if(Long.parseLong(account.get("mark").toString())<100){
						account.put("mark", accountMark+1);
					}
				}
				
				try (FileWriter file = new FileWriter("./sources/sources.json")) {
					file.write(json.toString());
					file.flush();
				} catch (IOException e) {
				    e.printStackTrace();
				}	
			}

		} catch (IOException e) {

			e.printStackTrace();

		}
	}
	
	/**
	 * Add the retweeted account inf the file of twitter account
	 * @param status
	 */
	private void addAccountInFile(Status status){
		SimpleDateFormat sdf = new SimpleDateFormat("dd/M/yyyy");
		String date = sdf.format(new Date());
		JSONObject item = new JSONObject();
		item.put("name", status.getRetweetedStatus().getUser().getScreenName());
		item.put("id", status.getRetweetedStatus().getUser().getId());
		item.put("date", date);
		BufferedReader br = null;
		FileReader fr = null;
		try {
			fr = new FileReader("./sources/sources.json");
			br = new BufferedReader(fr);

			JSONArray json = new JSONArray(br.readLine());
			
			int mark =0;
			for(int i =0; i<json.length(); i++){
				if(Long.parseLong(json.getJSONObject(i).get("id").toString()) == status.getUser().getId()){
					mark = Integer.parseInt(json.getJSONObject(i).get("mark").toString());
				}
			}
			item.put("mark", mark);

			
			json.put(item);
			try (FileWriter file = new FileWriter("./sources/sources.json")) {
				file.write(json.toString());
				file.flush();
			} catch (IOException e) {
			    e.printStackTrace();
			}
		} catch (IOException e) {

			e.printStackTrace();

		}
	}

	/**
	 * Update the table of id account
	 */
	public void run() {
		BufferedReader br = null;
		FileReader fr = null;

		try {

			fr = new FileReader("./sources/sources.json");
			br = new BufferedReader(fr);

			JSONArray json = new JSONArray(br.readLine());
			ArrayList<Long> idsUsers = new ArrayList<Long>();
			for(int i = 0; i < json.length(); i++){
				idsUsers.add(Long.parseLong(json.getJSONObject(i).get("id").toString()));
			}
			Long[] idArrayTemp = new Long[idsUsers.size()];
		    idArrayTemp = idsUsers.toArray(idArrayTemp);
		    arrayId = ArrayUtils.toPrimitive(idArrayTemp);
		    updateQuery(idsUsers);		

		} catch (IOException e) {

			e.printStackTrace();

		}
	}
	
	/**
	 * Update the query with the new table of id account
	 */
	public static void updateQuery(ArrayList<Long> idsUsers){

	    Long[] idArrayTemp = new Long[idsUsers.size()];
	    idArrayTemp = idsUsers.toArray(idArrayTemp);
	    arrayId = ArrayUtils.toPrimitive(idArrayTemp);
	    System.out.println(arrayId.length);
		FilterQuery query = new FilterQuery();
	    query.follow(arrayId);
	    twitterStream.cleanUp();
	    twitterStream.filter(query);
	    
	}
}
