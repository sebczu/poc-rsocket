### **POC-RSOCKET**
**spring boot + rsocket**

#### Build application
```bash
mvn clean install -DskipTests
```

#### Client rsocket
https://github.com/making/rsc/releases

#### Client rsocket, tests:
Fire and forget
```bash
java -jar rsc-0.6.1.jar --debug --im FIRE_AND_FORGET --route save ws://localhost:7000  --data "text"
```
Request response
```bash
java -jar rsc-0.6.1.jar --debug --im REQUEST_RESPONSE --route hello ws://localhost:7000 --data "text"
```
Request stream
```bash
java -jar rsc-0.6.1.jar --debug --im REQUEST_STREAM --route split ws://localhost:7000 --data "text"
```
Request channel
```bash
java -jar rsc-0.6.1.jar --debug --im REQUEST_CHANNEL --route message ws://localhost:7000 --data -
```
 
#### Compile frontend module
```bash
npm install
npm run build
``` 
