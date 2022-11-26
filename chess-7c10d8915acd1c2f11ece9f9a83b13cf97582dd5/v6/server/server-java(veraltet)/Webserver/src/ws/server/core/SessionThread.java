package ws.server.core;

import java.net.Socket;
import java.nio.charset.StandardCharsets;
import java.util.Scanner;

public class SessionThread extends Thread {

	Socket client;

	public SessionThread(Socket client) {
		this.client = client;
	}

	@Override
	public void run() {
		while (!Thread.interrupted()) {
			try {
				Scanner in = new Scanner(this.client.getInputStream());
				in.useDelimiter("\\z");
				while (in.hasNext() && !Thread.interrupted()) {
					String txt = new String(in.next().getBytes(), StandardCharsets.UTF_8);
					System.out.println(txt);
					var out = client.getOutputStream();
					out.write("test".getBytes(StandardCharsets.UTF_8));
					out.flush();
					out.close();
				
				}
			} catch (Exception e) {
				break;
			}
		}
	}

}
