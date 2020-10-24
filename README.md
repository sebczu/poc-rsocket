### **POC-RSOCKET**
**spring boot + rsocket**

#### 1. Build service
```bash
mvn clean install
```

#### 2. Run service
```bash
mvn clean package -Prun
```

#### 3. Build docker image
```bash
mvn clean package -Pbuild-image
```

#### Client rsocket
https://github.com/making/rsc/releases

#### Client rsocket, tests:
##### directory: /rsocket-client
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
