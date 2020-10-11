https://github.com/making/rsc/releases

java -jar rsc-0.6.1.jar --debug --im FIRE_AND_FORGET --route save ws://localhost:7000  --data "text"
java -jar rsc-0.6.1.jar --debug --im REQUEST_RESPONSE --route hello ws://localhost:7000 --data "haha"
java -jar rsc-0.6.1.jar --debug --im REQUEST_STREAM --route split ws://localhost:7000 --data "haha"
java -jar rsc-0.6.1.jar --debug --im REQUEST_CHANNEL --route message ws://localhost:7000 --data -
 
 
 
 npm install
 npm run tsc-compile && npm run build
 npm run-script build