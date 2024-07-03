# Install instructions:

## 1) From project root folder run this - npm install

## 2) Go to server folder and run this - npm install

Note - In case of any install/version mismatch error trying installing node version 18.20.2 and repeat the above steps
Make sure to delete node_modules folder in both root directory and in server folder

## 3) Kafka setup:

    Note - make sure Java is installed. If not install Java before proceeding with Kafka setup.
    Reference - https://kafka.apache.org/quickstart

    — Download latest Kafka from this link - https://www.apache.org/dyn/closer.cgi?path=/kafka/3.7.1/kafka_2.13-3.7.1.tgz  

    - Extract the zip file and go inside the folder and change the below properties (this is make sure kafka can accept and process bugger files)

        add these lines in ./config/server.properties:
            message.max.bytes=15728640
            replica.fetch.max.bytes=15728640

        add these lines in ./config/consumer.properties:
            fetch.message.max.bytes=15728640

        add these lines in ./config/producer.properties:
            max.request.size=15728640
         

    — Run below commands inside kafka folder:

        bin/zookeeper-server-start.sh config/zookeeper.properties
        bin/kafka-server-start.sh config/server.properties
        bin/kafka-topics.sh --create --topic transactions --bootstrap-server localhost:9092 max.message.bytes=4096

    Note - If you want to restart kafka, CTRL+C all the scripts and run the below command to clean it. After this all the above scripts can be run to start it again.
    
    rm -rf /tmp/kafka-logs /tmp/zookeeper /tmp/kraft-combined-logs

## 4) Start express server in server folder - npx ts-node app.ts

## 5) Start consumer in server folder - npx ts-node consumer.ts

## 6) Start front end - go to root directory and run this - npm start

    Note - Once the UI is up and running, click on ‘Reset system’ button once - this will reset all the existing data and create the DB tables required.


# TODO list:
==============

     Proper validations for each field in the file (Right now, I have only the shell implemented)
     Handling other file types
     Encryption/Decryption for all data exchange
     User authorizations and access tokens for API calls
     Unit test cases/ Functional test cases creation for all files
     Use react-virtualize/pagination to display huge transaction list as table
     Handling amount transfer when target account name is not specified
