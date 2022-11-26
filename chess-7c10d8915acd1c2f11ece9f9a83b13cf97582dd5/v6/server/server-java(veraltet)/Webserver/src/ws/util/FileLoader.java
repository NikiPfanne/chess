package ws.util;

import java.io.File;
import java.io.IOException;
import java.util.Scanner;

public final class FileLoader {
	
	private FileLoader() {
		
	}
	
	public static String loadFile(String path) throws IOException{
		String res = "";
		File file = new File(path);
		Scanner reader = new Scanner(file);
		reader.useDelimiter("\\Z");
		if(reader.hasNext()) {
			res = reader.next();
		}
		reader.close();
		return res;
	}
}
