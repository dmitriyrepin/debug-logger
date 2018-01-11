# Introduction
Debugging and Stackdriver logging for a Node.js/Express.js app

## Motivation
* When debugging locally, we often use console.log()
  * No message categorization or visual cues
  * Very fast the console becomes overflown with messages
  * Debugging output will pollute Stackdriver logs
* When working Stackdriver logs
  * reviewing __stdout__ and __stderr__ logs can be overwhelming.
  It is possible, but hard, to search for errors vs info/debug output
  * nginx.request log contains a lot of usefull information (request latency, referrer, method url; response status; latency). However, the __request headers__ and the __request parameters__ are not reported

## Solution

The Logger class

* __Logger.error(error: Error)__  
  Logs an ERROR with the Error message and the stack trace.  
  Displays those, if enabled, on the console and in the Stackdriver log.  

* __Logger.error(message: string)__  
  Logs an ERROR with the message.  
  Displays it, if enabled, on the console and in the Stackdriver log.  

* __Logger.warn(error: Error)__  
  Logs a WARNING with the Error message.  
  Displays it, if enabled, on the console and in the Stackdriver log.  

* __Logger.warn(message: string)__  
  Logs a WARNING with the message.  
  Displays it, if enabled, on the console and in the Stackdriver log.

* __Logger.info(message: string)__  
  Logs an INFO with the message.  
  Displays it, if enabled, on the console and in the Stackdriver log.

* __Logger.debug(message: string)__  
  Logs a debug message.  
  Displays it, if enabled, on the console.

Control what messages are displayed by setting the DEBUG environment variable.

Linux:

    export DEBUG=moduleName:*,-moduleName:debug			

Windows:

    $env:DEBUG = "moduleName:*,-moduleName:debug”


# Getting Started
1.	Installation dependencies

        npm install

2.	Run locally

    Linux:

        ./serve.sh

    Windows:

        ./serve.ps1

3.	Deploy to the Google App Engine

        gcloud app deploy
