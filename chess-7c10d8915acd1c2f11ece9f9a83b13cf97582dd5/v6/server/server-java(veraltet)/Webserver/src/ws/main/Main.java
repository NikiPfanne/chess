package ws.main;

import java.net.InetAddress;
import java.net.UnknownHostException;
import java.util.Scanner;

import app.App;
import ws.config.ConfigLoader;
import ws.server.core.Server;

public class Main {

	public static void main(String[] args) {
		 ConfigLoader config = new ConfigLoader("config/config.yml");
		 System.out.println(config.isSSL());
		 try {
			Server server = new Server(config.getPort(),10,InetAddress.getByAddress(config.getIP()));
			server.register(new App());
			server.start();
		} catch (UnknownHostException e) {
			System.out.println("[SERVER] failed to start.");
			System.exit(0);
		}
		System.out.println("[SERVER] " +config.getIPName()+" started on port "+config.getPort()+"...");
		Scanner input = new Scanner(System.in);
		input.useDelimiter("\n");
		boolean run = true;
		while(run) {
			if(!input.hasNext()) {
				continue;
			}
			String flag = input.next().strip();
			if(flag.equals("q")) break;
			if(flag.equals("quit")) break;
			if(flag.equals("e")) break;
			if(flag.equals("exit")) break;
		}
		input.close();
		System.out.println("[SERVER] closed...");
		System.exit(0);
	}

}
