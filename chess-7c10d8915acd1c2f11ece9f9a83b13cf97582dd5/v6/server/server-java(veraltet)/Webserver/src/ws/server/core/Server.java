package ws.server.core;
import java.io.IOException;
import java.lang.reflect.InvocationTargetException;
import java.net.InetAddress;
import java.net.ServerSocket;
import java.util.ArrayList;
import ws.interfaces.Servables;



public class Server {
	private ServerSocket server;
	private ArrayList<Servables> servables = new ArrayList<Servables>();
	private ServeMethodLoader methodLoader;
	
	public Server(int port, int backlog, InetAddress bindAddr) {
		try {
			this.server = new ServerSocket(port, backlog, bindAddr);
		} catch (IOException e) {
			System.out.println("[SERVER] failed to start.");
			System.exit(0);
		}
	 
	}
	
	public boolean register(Servables servable) {
		return this.servables.add(servable);
	}
	
	public void start() {
		this.methodLoader = new ServeMethodLoader(servables);
		try {
			System.out.println(this.methodLoader.getServable("/test").get().method.invoke(null, null));
		} catch (IllegalAccessException | IllegalArgumentException | InvocationTargetException e) {
			e.printStackTrace();
		}
		ServerThread mainloop = new ServerThread(this.server);
		mainloop.start();
	}

}
