package ws.enums;

public enum MIME_TYPE {
	text_html("text/html"),
	text_javascript("text/javascript"),
	text_css("text/css");
	
	public String mimeType;
	
	MIME_TYPE(String type) {
		this.mimeType = type;
	}
	
}
