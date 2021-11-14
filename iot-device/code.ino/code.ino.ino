#include <ESP8266WiFi.h>
#include <PubSubClient.h>

// If set to 1 the esp will print debug messages on the serial connection, 0 otherwise
const int debug = 1;

// WiFi
const char *ssid = "your-ssid"; // Enter your WiFi name
const char *password = "your-password";  // Enter WiFi password

// MQTT Broker
const char *mqtt_broker = "your-broker-hostname";
const int mqtt_port = 1883;
const char *subscribe_topic = "leds";
const char *publish_topic = "notification";
const char *mqtt_username = "your-username";
const char *mqtt_password = "your-password";

// Buffer used to call the pubblish() function with a message
char * buf;

WiFiClient espClient;
PubSubClient client(espClient);

void setup() {
  // Set software serial baud to 115200;
  Serial.begin(115200);
  
  // Connecting to the WiFi network
  WiFi.begin(ssid, password);
  while (WiFi.status() != WL_CONNECTED) {
      delay(500);
      if (debug) {
        Serial.println("Connecting to WiFi..");
      }
  }
  if (debug) {
    Serial.println("Connected to the WiFi network");
  }
  
  // Connect to the mqtt broker
  client.setServer(mqtt_broker, mqtt_port);
  client.setCallback(callback);
  while (!client.connected()) {
      String client_id = "esp8266-client-";
      client_id += String(WiFi.macAddress());
      if (debug) {
        Serial.printf("Client %s connects to the mqtt broker\n", client_id.c_str());
      }
      if (client.connect(client_id.c_str(), mqtt_username, mqtt_password)) {
          if (debug) {
            Serial.println("Connected to the mqtt broker");
          }
      } else {
          if (debug) {
            Serial.print("Failed to connect to mqtt broker with state ");
            Serial.print(client.state());
          }
          delay(2000);
      }
  }
  
  // Subscribe to the topic
  client.subscribe(subscribe_topic);

  // Set led pins
  pinMode(12, OUTPUT);
  pinMode(13, OUTPUT);
  pinMode(14, OUTPUT);

  // Allocate buffer
  buf = (char*) malloc(sizeof(char)*60);
}

// Callback to turn leds on/off and send notifications
void callback(char *topic, byte *payload, unsigned int length) {
  if (debug) {
    Serial.print("Received message on topic: ");
    Serial.print(topic);
    Serial.print(", content:");
    for (int i = 0; i < length; i++) {
        Serial.print((char) payload[i]);
    }
    Serial.println();
    Serial.println("-----------------------");
  }

  // Logic
  if (!strncmp("LED_1_ON", (char*) payload, 8)) {
    digitalWrite(14, HIGH);
    String str_buf = "LED_1 is now ON on device ";
    str_buf += "esp8266-client-";
    str_buf += String(WiFi.macAddress());
    str_buf.toCharArray(buf, 60);
    client.publish(publish_topic, buf);
  } else if (!strncmp("LED_1_OFF", (char*) payload,8)) {
    digitalWrite(14, LOW);
    String str_buf = "LED_1 is now OFF on device ";
    str_buf += "esp8266-client-";
    str_buf += String(WiFi.macAddress());
    str_buf.toCharArray(buf, 60);
    client.publish(publish_topic, buf);
  } else if (!strncmp("LED_2_ON", (char*) payload, 8)) {
    digitalWrite(12, HIGH);
    String str_buf = "LED_2 is now ON on device ";
    str_buf += "esp8266-client-";
    str_buf += String(WiFi.macAddress());
    str_buf.toCharArray(buf, 60);
    client.publish(publish_topic, buf);
  } else if (!strncmp("LED_2_OFF", (char*) payload, 8)) {
    digitalWrite(12, LOW);
    String str_buf = "LED_2 is now OFF on device ";
    str_buf += "esp8266-client-";
    str_buf += String(WiFi.macAddress());
    str_buf.toCharArray(buf, 60);
    client.publish(publish_topic, buf);
  } else if (!strncmp("LED_3_ON", (char*) payload, 8)) {
    digitalWrite(13, HIGH);
    String str_buf = "LED_3 is now ON on device ";
    str_buf += "esp8266-client-";
    str_buf += String(WiFi.macAddress());
    str_buf.toCharArray(buf, 60);
    client.publish(publish_topic, buf);
  } else if (!strncmp("LED_3_OFF", (char*) payload, 8)) {
    digitalWrite(13, LOW);
    String str_buf = "LED_3 is now OFF on device ";
    str_buf += "esp8266-client-";
    str_buf += String(WiFi.macAddress());
    str_buf.toCharArray(buf, 60);
    client.publish(publish_topic, buf);
  }
}

void loop() {
  client.loop();
}
