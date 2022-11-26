package ws.server.core;

import java.lang.reflect.Method;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.Optional;

import ws.annotations.WebPage;
import ws.interfaces.Servables;

public final class ServeMethodLoader {
	private HashMap<String,Servable> pages = new HashMap<String, Servable>();

	public ServeMethodLoader(ArrayList<Servables> servables) {
		for (Servables s : servables) {
			@SuppressWarnings("unchecked")
			Class<Servables> sClass = (Class<Servables>) s.getClass();
			Method[] methods = sClass.getMethods();
			for (Method method : methods) {
				if (method.isAnnotationPresent(WebPage.class)) {
					WebPage annotation = method.getAnnotation(WebPage.class);
					pages.put(annotation.path(), new Servable(method,annotation.mime_type()));
				}
			}
		}
	}
	
	public Optional<Servable> getServable(String path) {
		if(pages.containsKey(path)) {
			return Optional.of(pages.get(path));
		}
		return Optional.empty();
	}
	
}