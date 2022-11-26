package ws.config;

import java.io.File;
import java.io.FileInputStream;
import java.nio.charset.StandardCharsets;
import java.util.HashMap;

public class ConfigLoader {
	private String path;
	HashMap<String,String> lookup = new HashMap<String, String>();
	
	
	public ConfigLoader(String path) {
		this.path = path;
		load();
	}
	
	/**
	 * loads the config file.
	 * @throws RuntimeException if the config file could not be loaded.
	 */
	private void load() {
		try {
			FileInputStream in = new FileInputStream(new File(this.path));
			String content = new String(in.readAllBytes(),StandardCharsets.UTF_8).strip();
			String[] lines = content.split("\n");
			for(String line : lines) {
				String[] key_value = line.split(":");
				if(key_value.length != 2) {
					System.out.println("[CONFIG] invalid config");
					throw new Exception();
				}
				lookup.put(key_value[0].strip(), key_value[1].strip());
			}
			
		} catch (Exception e) {
			throw new RuntimeException("[CONFIG] couldn't load config file.");
		}
		
	}
	
	/**
	 * @return an ip4 address (4 bytes) given in the config file.
	 * @throws RuntimeException if there is an error with the ip property.
	 */
	public byte[] getIP(){
		try {
			if(this.lookup.containsKey("ip")) {
				String ip = this.lookup.get("ip");
				String[] ip_parts = ip.split("\\.");
				return new byte[] {Integer.valueOf(ip_parts[0]).byteValue(),Integer.valueOf(ip_parts[1]).byteValue(),Integer.valueOf(ip_parts[2]).byteValue(),Integer.valueOf(ip_parts[3]).byteValue()};
			}
			throw new Exception();
		} catch (Exception e) {
			throw new RuntimeException("[CONFIG] couldn't load ip.");
		}
		
	}
	
	/**
	 * @return the ip4 address given in the config as a string.
	 */
	public String getIPName() {
		return lookup.get("ip");
	}
	
	public int getPort(){
		try {
			if(this.lookup.containsKey("port")) {
				String port = this.lookup.get("port");
				return Integer.valueOf(port);
			}
			throw new Exception();
		} catch (Exception e) {
			throw new RuntimeException("[CONFIG] couldn't load port.");
		}
		
	}
	
	public String getCertPath(){
		try {
			if(this.lookup.containsKey("cert-path")) {
				String certpath = this.lookup.get("cert-path");
				return certpath;
			}
			throw new Exception();
		} catch (Exception e) {
			throw new RuntimeException("[CONFIG] couldn't load cert-path property.");
		}
		
	}
	
	public String getKeyPath(){
		try {
			if(this.lookup.containsKey("key-path")) {
				String keypath = this.lookup.get("key-path");
				return keypath;
			}
			throw new Exception();
		} catch (Exception e) {
			throw new RuntimeException("[CONFIG] couldn't load key-path property.");
		}
		
	}
	
	public boolean isSSL(){
		try {
			if(this.lookup.containsKey("ssl")) {
				String ssl = this.lookup.get("ssl");
				return Boolean.valueOf(ssl);
			}
			throw new Exception();
		} catch (Exception e) {
			throw new RuntimeException("[CONFIG] couldn't load the ssl property.");
		}
		
	}
	
}


