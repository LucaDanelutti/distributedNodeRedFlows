# Distributed Node-RED flows

---
## Assignment
![alt text](./report/images/before_after.PNG)
This project was developed during the course of [Middleware Technologies for Distributed Systems at PoliMi](https://www11.ceda.polimi.it/schedaincarico/schedaincarico/controller/scheda_pubblica/SchedaPublic.do?&evn_default=evento&c_classe=743721&__pj0=0&__pj1=e23728bb4735457dfd2d5db09f370ef1) (2020/2021)
and received the maximum grade. 
> You are to implement an architecture that allows Node-red flows to span multiple devices.
Normally, a Node-red flow executes locally to the machine where it is installed.
Instead, consider multiple Node-red installations that:\
• register to a central repository that maintains information on all running installations\
• can exchange messages among them by logically connecting the output of a node in
one installation to the input of another node in a different installation\
Addressing of Node-RED installations must be content-based, that is, the target Node-red
installations that receive the messages cannot be determined based on their IP address or
some other form of machine-level identifier.
---
## Structure and more info
A report with all the specs and design choices made in the project
can be found at [`./report/report.pdf`](./report/report.pdf).

![alt text](./report/images/docker.PNG)


---
## Demo
The demo consists in dividing a previously defined flow into multiple
(and probably excessive) sub-flows. 
The initial flow is defined as follows:

![alt text](./report/images/demo_before.PNG)

It is composed of a Telegram bot that listens for new messages
(using the [pre-built node of Telegram](https://flows.nodered.org/node/node-red-contrib-telegrambot)) and act upon newly received
messages by turning ON/OFF the appropriate led of [ESP-32 modules](https://en.wikipedia.org/wiki/ESP32). \
This is achieved by publishing messages into an [MQTT topic](https://cookbook.nodered.org/#mqtt) where
the ESP-32 are registered. 

![alt text](./report/images/flow_divided.PNG)

As you can see in the picture above the initial flow is divided and distributed between
7 different Node-RED installations that cooperates together. \
The light-blue clouds represents the middleware infrastructure, namely Kafka,
responsible for forwarding the messages to the proper nodes.

### How to run the demo
1. Change the value `token` inside of all the  .json files in the `creds`
folder matching the token of your personal Telegram bots ([more info](https://core.telegram.org/bots)).
   1. Please note that you need to create two different bots, one for sending and one for receiving
   the outputs (this is a limitation imposed by the Telegram API on
   concurrent accesses).
   2. The tokens are all equal except for the ones of `flows_6_cred.json`, here put the token
   of the bot responsible for the replies. 
2. Configure the connection to the MQTT broker by changing the values `user` and `password` inside the .json files in the `creds` folder. Change the values of `broker` and `port` in `flows_[3/4/5/7].json` inside of the `demo_flows` folder. Inside flows_6.json at line 44 change the chatId ([how to get it](https://core.telegram.org/bots/api#getting-updates)) with the one of the chat in which you want to receive the replies.
3. Open the iot-device/code.ino with Arduino IDE and change the Wi-Fi and MQTT settings. Compile it and upload it to an esp8266/eps-32 (or similar devices). Optionally, connect three leds to the GPIO pins specified in the source code.
4. Run the demo by typing `docker-compose -f ./docker-compose-demo.yml up -d`
5. Send `#num off/on` in your telegram bot to trigger the change in the ESP-32 setup (`#num` must be a number ranging from 1 to 3)
   1. Example: `3 on`
6. To access the different components of the project:
   1. Node-RED nodes: `localhost:[1881 -> 1887]`
   2. Kafka-UI: `localhost:8080` useful to investigate the behaviour of Kafka

---
## Folder structure
- `creds` 
  - Credentials needed by the node-red installations to access the Telegram bot
  and the MQTT broker
- `custom-nodes` 
  - Folder containing the custom node-red nodes
- `demo_flows`
  - Folder containing the source code of the Node-red nodes of the demo
- `iot-device`
  - Folder containing the source code of the iot device implemented to run the demo
- `report` 
  - Folder containing report files
- `docker-compose.yml` 
  - Deploys a working environment with 3 kafka brokers and 3 Node-red empty istances 
- `docker-compose-demo.yml`
  - Deploys a working environment with 3 kafka brokers and 7 Node-red istances with our demo inside
- `Dockerfile` 
  - Builds a custom node-red image with the required plugins pre-installed
---
