https://github.com/making/rsc/releases

java -jar rsc-0.6.1.jar --debug --im FIRE_AND_FORGET --data "haha" --route save ws://localhost:7000
java -jar rsc-0.6.1.jar --debug --im REQUEST_RESPONSE --data "haha" --route hello ws://localhost:7000
java -jar rsc-0.6.1.jar --debug --im REQUEST_STREAM --data "haha" --route split ws://localhost:7000

???
java -jar rsc-0.6.1.jar --debug --im REQUEST_CHANNEL --data "1" --route message ws://localhost:7000
 
 npm install
 npm run-script build