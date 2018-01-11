# Introduction
Debugging and Stackdriver loggingNode.js/Express.js app
## Motivation
* When debugging locally, we often use console.log()
  * No message categorization or visual cues
  * Very fast the console becomes overflown with messages
  * Debugging output will pollute Stackdriver logs
* When working Stackdriver logs
  * reviewing __stdout__ and __stderr__ logs can be overwhelming.
  It is possible, but hard, to search for errors vs info/debug output
  * nginx.request log contains a lot of usefull information (request latency, referrer, method url; response status; latency). However, the __request headers__ and the __request parameters__ are not reported

# Getting Started
TODO: Guide users through getting your code up and running on their own system. In this section you can talk about:
1.	Installation process
2.	Software dependencies
3.	Latest releases
4.	API references

# Build and Test
TODO: Describe and show how to build your code and run the tests.

# Contribute
TODO: Explain how other users and developers can contribute to make your code better.
