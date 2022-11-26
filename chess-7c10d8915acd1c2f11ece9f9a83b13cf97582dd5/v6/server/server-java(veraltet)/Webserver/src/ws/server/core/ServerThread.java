package ws.server.core;

import java.io.IOException;
import java.net.ServerSocket;
import java.net.Socket;
import java.net.SocketException;
import java.util.ArrayList;

public class ServerThread extends Thread{
	
	private ArrayList<Socket> clients = new ArrayList<Socket>();
	private ServerSocket server;
	private int timeout;
	
	public ServerThread(ServerSocket server) {
		this.server = server;
	}
	
	@Override
	public void run() {
		try {
			server.setSoTimeout(this.timeout);
		} catch (SocketException error) {
			System.out.println("[SERVER] setting a timeout for accepting connections failed.");
		}
		
		while(!Thread.interrupted()) {
			try {
				Socket client = server.accept();
				clients.add(client);
				SessionThread client_thred = new SessionThread(client);
				client_thred.start();
				
			} catch (IOException e) {
				e.printStackTrace();
			}
			
		}
	}

}
