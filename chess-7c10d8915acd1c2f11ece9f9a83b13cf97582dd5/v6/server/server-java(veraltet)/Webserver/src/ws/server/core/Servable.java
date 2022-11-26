package ws.server.core;

import java.lang.reflect.Method;

import ws.enums.MIME_TYPE;

public class Servable {
	public Method method;
	public MIME_TYPE mimeType;
	
	public Servable(Method method, MIME_TYPE mimeType) {
		this.method = method;
		this.mimeType = mimeType;
	}
	
}
