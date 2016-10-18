### SE Project - Bot to estimate lifetime of bugs
##### CSC 510 SE - Fall 2016 - Project 
##### Members: avshirod, adeshka, prsangha, vjayath
&nbsp;

### Use Cases
```
Use Case: Create a meeting
1 Preconditions
   User must have google calendar api tokens in system.
2 Main Flow
   User will request meeting and provide list of attendees [S1]. Bot will provide  possible meeting times and user confirms [S2]. Bot creates meeting and posts link [S3].
3 Subflows
  [S1] User provides /meeting command with @username,@username list.
  [S2] Bot will return list of meeting times. User will confirm time.
  [S3] Bot will create meeting and post link to google calendar event.
4 Alternative Flows
  [E1] No team members are available.
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
