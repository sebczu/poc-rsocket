https://github.com/making/rsc/releases

java -jar rsc-0.6.1.jar --debug --im FIRE_AND_FORGET --data "haha" --route save tcp://localhost:7000
java -jar rsc-0.6.1.jar --debug --im REQUEST_RESPONSE --data "haha" --route hello tcp://localhost:7000
java -jar rsc-0.6.1.jar --debug --im REQUEST_STREAM --data "haha" --route split tcp://localhost:7000

???
java -jar rsc-0.6.1.jar --debug --im REQUEST_CHANNEL --data "1" --route message tcp://localhost:7000
 