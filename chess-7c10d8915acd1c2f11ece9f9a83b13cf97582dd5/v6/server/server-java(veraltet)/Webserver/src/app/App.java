package app;

import java.io.IOException;

import ws.annotations.WebPage;
import ws.enums.MIME_TYPE;
import ws.interfaces.Servables;
import ws.util.FileLoader;

public final class App implements Servables{
	
	
	@WebPage(mime_type = MIME_TYPE.text_html, path = "/test")
	public static String index1() {
		return "hallo world";
	}
	
	@WebPage(mime_type = MIME_TYPE.text_html, path = "/homepage/index.html")
	public static String page3() throws IOException {
		return FileLoader.loadFile("/index.html");
	}
	
}
