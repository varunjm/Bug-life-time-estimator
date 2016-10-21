# MILESTONE: BOT


### Use Cases
```
Use Case 1: (Non-bug Issues creation)
1 Preconditions
   An issue is created/updated which is not a bug
2 Main Flow
   Bot ignores the issue
3 Subflows
  [S1] Observe the label of issue (- is not Bug)
  
Use Case 2: (Bug Issue comment)
1 Preconditions
   An issue, which is a bug, is updated/ commented upon
2 Main Flow
   Bot ignores the issue
3 Subflows
  [S1] Observe the label of issue (- is Bug)
  [S2] Observe the status of issue is (- is not Created)
4 Alternative Flows
  [E1] A new bug is mentioned in the comments; bot ignores it as new issue needs to be created for new bug
  [E2] The bug parameters have been changed; bot posts a follow-up comment

Use Case 3: (Bug issue creation with all data)
1 Preconditions
   An issue, which is a bug, is created
2 Main Flow
   Bot comments an estimated lifetime for the bug
3 Subflows
  [S1] Check action:'opened', label:'bug', assignee: > 0
  [S2] Parse the body for bug attributes - Priority, Severity, Operating System, Bug Dependency List
  [S3] Use Prediction model to get estimated lifetime of the bug
4 Alternative Flows
  [E1] Bot cannot estimate the lifetime of the bug

Use Case 4: (Bug issue creation with partial data)
1 Preconditions
   An issue, which is a bug, is created
2 Main Flow
   Partial information provided in the Bug Description
   Bot comments an estimated lifetime for the bug
3 Subflows
  [S1] Check action:'opened', label:'bug', assignee: > 0
  [S2] Parse the body for bug attributes - Priority, Severity, Operating System, Bug Dependency List; Use Default values for missing attributes
  [S3] Use Prediction model to get estimated lifetime of the bug
4 Alternative Flows
  [E1] Bot cannot estimate the lifetime of the bug
```

### Mocking Service Component
A mock model is created as the mocking service component in the [bot.js](bot.js) file in the predictor function. Since it is a mock model, the predictions are not accurate but help simulate the behaviour of the bot.

For mocking this behavior, we have created a template bug example which is created as an issue in [this](https://github.ncsu.edu/adeshka/SE-Bot/) repository. We have employed a webhook which sends the JSON as a POST request to a *localhost* url, which is running the bot script.
A generic answer is created using the mock model and posted as a comment on the originating issue.


### Bot Implementation

A webhook is implemented to *POST* a JSON to a specified url, which is then received by a *node* script.
The script parses the JSON for attributes, which is sent to the prediction model to get the lifetime estimate.

Our bot is a 'code bot', which will actively be listening for new Issues created on a specified GitHub repository. The script for the bot needs to always be running and catching the JSONs sent by the WebHook on the repository.
The WebHook `issues` is updated to send the corresponding JSON to the url on which the bot listens to. This WebHook JSON POST request acts as a trigger command for the bot.

A basic prototype of the bot can run on any repository by following the instructions on the [README](README.md) file.


### Selenium Testing
The code for the JUnit Tests is in the Selenium directory which can be imported as a Maven project in Eclipse. Since the number of cases are limited for the scope of the bot we have 4 test for the 4 cases the bot needs to consider.
The Tests are in the file: [SEBotSeleniumTest.java](https://github.ncsu.edu/adeshka/SE-Bot/blob/master/Selenium/src/test/java/UnitTests.java)



### Task Tracking
Refer: [WORKSHEET.md](/WORKSHEET.md)


### ScreenCast
Case 1:


![Working BOT](/images/screencast1.gif)

Case2:


![Working BOT](/images/screencast2.gif)

Case 3:


![Working BOT](/images/screencast3.gif)

Case 4:


![Working BOT](/images/screencast4.gif)
