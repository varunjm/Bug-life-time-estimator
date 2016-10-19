### SE Project - Bot to estimate lifetime of bugs
##### CSC 510 SE - Fall 2016 - Project 
##### Members: avshirod, adeshka, prsangha, vjayath
&nbsp;

### Use Cases
```
Use Case 1: 
1 Preconditions
   An issue is created/updated which is not a bug
2 Main Flow
   Bot ignores the issue
3 Subflows
  [S1] Observe the label of issue (- is not Bug)
  
Use Case 2: 
1 Preconditions
   An issue, which is a bug, is updated/ commented upon
2 Main Flow
   Bot ignores the issue
3 Subflows
  [S1] Observe the label of issue (- is Bug)
  [S2] Observe the status of issue is (- is not Created)
4 Alternative Flows
  [E1] A new bug is mentioned in the comments; bot posts a follow-up comment
  [E2] The bug parameters have been changed; bot posts a follow-up comment

Use Case 3: 
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

Use Case 4: 
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
A webhook is implemented to *POST* a JSON to a specified url, which will then be received by a *node* script.
The script will parse the JSON for attributes, which will be sent to the prediction model to get the lifetime estimate.

For mocking this behavior, we have created a template bug example which will be created as an issue in [this](https://github.ncsu.edu/adeshka/SE-Bot/) repository. We have employed a webhook which will send the JSON as a POST request to a *localhost* url, which is running the bot script.
A generic answer will be posted as a comment on the originating issue.

We can mock the JSON request locally and observe how the bot behaves; but the project has not yet reached that stage.


### Bot Implementation

Our bot is a 'code bot', which will actively be listening for new Issues created on a specified GitHub repository. The script for the bot will always be running and catching the JSONs sent by the WebHook on the repository.
The WebHook `issues` is updated to send the corresponding JSON to the url on which the bot is listening. This WebHook JSON POST request acts as a trigger command for the bot.

A basic prototype of the bot is running on the project repository.


### Selenium Testing
[Code](https://github.ncsu.edu/adeshka/SE-Bot/blob/master/lib/webHook.js)

**Results**:
> results for each use case


### Task Tracking
Refer: [WORKSHEET.md](/WORKSHEET.md)


### ScreenCast
![Working BOT](/images/Wireframe%202.PNG)
