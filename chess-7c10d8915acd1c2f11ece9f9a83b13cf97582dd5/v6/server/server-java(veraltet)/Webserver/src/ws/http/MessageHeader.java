package ws.http;

public class MessageHeader {
	
	String[] token;

	public MessageHeader(String content) {
		String[] lines = content.split("\n");
		String[] token = lines[0].split("\\s");
		this.token = token;
		
	}
	
	public String buildAnswer() {
		String res = "";
		switch(token[0]) {
		
		case "GET":
			res = "";
			break;
		
		}
		return res;
	}
	
}
