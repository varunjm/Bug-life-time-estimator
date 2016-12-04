##Problem statement

In the realm of Software engineering, one of the most time sensitive issues is fixing of bugs. In code bases which are huge and being contributed to by many participants, there is a plethora of bugs being reported. Therefore one needs to prioritize the bugs in terms of its urgency and the time needed to solve a bug. This is critical to rolling out updates that fix these bugs. So can a bot help and simplify this process for the developers?


##Solution

Our bot solved this problem by estimating the time required for a given bug, so that the developers can prioritize the bugs. This would make the software development process more efficient in terms of maintaining deadlines. The bot estimates time using machine learning algorithms to create a predictor model from an initial dataset so that it can estimate the time for the given bug. The bot tracks a GitHub repository and comments its prediction on an issue that is marked as a bug.


##Primary Features

###Predict bug lifetime

This is the main feature of the bot. When an issue is created and tagged with the ‘bug’ label, the bot parses the issue description as a JSON and sends it to the predictor model. The predictor then returns an estimate which the bot uses to reply as an issue comment
![Case3](/images/case3.PNG)


### Assuming default values on missing fields

If the issue does not provide all the variables required by the predictor, the bot sets default values for those variables and sends it to the predictor. It also specifies what default values were used when replying to time estimate as an issue comment.
![Case4](/images/case4.PNG)


### Validation of input format

The description of the issue created is parsed as a JSON. To handle corner cases, if the description does not follow the JSON format, the bot replies with the error message as an issue comment informing that the user has given an invalid JSON.
![Case5](/images/case5.PNG)

## Development Process

### Design

Based on the problem statement we came up with the following architecture.

![Architecture](/images/arch_diag.png)

The architecture consists of a prediction model built on a Bugzilla bug database, the bot which has the event listener that listens to the notification from Github webhook, the event parser that parses the issue description and sends it to the predictor and the github UI which is used to make the interaction between the bot and the user. 

The project has three major aspects 
* The predictor model
* Communication with GitHub
* App deployment

### Prediction model

We referred a [technical paper] (http://flosshub.org/system/files/28300029.pdf) on Predicting Eclipse Bug Lifetimes by Dr. L. D. Panjer. This introduces the concept of using a variety of features like priority, severity, product, component, operating system, platform, version, target milestone, assignee count, bug dependencies. Taking a cue from his paper we decided to source our own data set from the Mozilla’s bug data set using the Bugzilla API. From approximately 12,000 bugs we extract the severity, priority, operating system, assignee count, bug dependency list , start time and end time of the bug. All these values were not in directly usable format to build a prediction model.  
 - Severity had values like ‘blocker’, ‘normal’, ‘trivial’ etc; 
 - priority had values from ‘P1’ to ‘P5’. 
 - Operating system names like ‘linux’, ‘CentOS’ were provided. 

All the fields were then discretized into numerical values to indicate uniquely, each of the unique values for the fields. Additionally the bug ‘resolution time’ (end time minus start time) was also discretized into a set of 100 values ranging from 1 day to 1958 days.
 
After initial analysis, the model with Decision Tree Learning was giving the best results. As compared to other models based on naive bayes, neural net. An interesting observation of the model was that information gain is the highest on the ‘Assignee count’ field. This could be owing to the fact that fewer the number of people involved in solving a bug, more time it could take to do it. the The model is built using R programming language’s C-Tree library and the bot queries this model with the parameters of a bug to estimate its lifetime.


### Communication with Github
Two way communication was needed to be set up between the Bot and GitHub. GitHub needs to inform the bot about an ‘issue event’ on GitHub, i.e. whenever a new issue is created. We make use of GitHub webhooks. They do a ‘POST’ on a url provided by us with a JSON containing all the information about the ‘issue event’. This could not be achieved easily, as a locally running App is not visible to the GitHub server. To achieve visibility, one option was to run the app on a server with a Public address, but we chose to go with an alternate approach. A service called ‘Ngrok’ dynamically generates a temporary Publically visible URL, and can tunnel requests sent to that address onto any port on the local machine. The dynamically generated url was available through a REST API call to Ngrok. This approach was preferred for two specific reasons, Flexibility and free service. This covered the incoming communication from GitHub.
 
The outgoing communication (commenting on an issue) to GitHub from the app was simpler as GitHub provides an easy RESTful API to achieve the communication.


### Deploy
    
* Final deployment needed to the app to be live and usable at any time. We decided to deploy the app on an Ubuntu 16.04 VM running on Microsoft Azure cloud service.  
* Ansible-playbooks were helpful in setting up all the dependencies on the VM and running the app. 
* One problem that was faced during deployment was the Ngrok service that was started by a shell command run through ansible was not visible to the app, but if Ngrok was created manually, it would be visible. This happened for reasons which were not clearly understood, although we found a solution to this problem by making the ngrok service as a daemon on the machine, which made the service visible and query-able through a REST API call. 


## Limitations

* One major limitation is that the existing variables for a bug report does not fully capture the information needed to correctly estimate the bug lifetime. Some factors that influence the lifetime of a bug cannot be quantified as variables, so the prediction would never be optimal.
* Another limitation is that most of the relevant information in a bug report is a human input as it cannot be automated just from the bug.


## Future Work

* The predictor model can be improved by experimenting with more machine learning algorithms to see which would give a better prediction.
* The initial dataset can be expanded to cover more than the Mozilla dataset in Bugzilla.
* Instead of manually getting the bug information through GitHub issue, we can get it from Bugzilla itself.
* More functionalities can be added like rerunning the bot when there are changes to the issue like adding the bug label, adding assignees or changing the attribute values in the description.
* The predictor model can incorporate the [recent research](http://dl.acm.org/citation.cfm?id=2901751) on Bug Lifetime Prediction for improved results.
* This bot can be incorporated in a bug planner as the estimated time would be a relevant value.


## Screencast
[Final Screencast](https://youtu.be/5ETHg6E7dQM)


## References
[1] Lucas D. Panjer - Predicting Eclipse Bug Lifetimes

[2] Cathrin Weib, Rahul Premraj, Thomas Zimmermann, Andreas Zeller - How Long will it Take to Fix This Bug?

[3] Bugzilla Documentation – Life Cycle of a Bug. Available online at http://www.bugzilla.org/docs/tip/html/lifecycle.html

[4] Bugzilla Mozilla database - https://bugzilla.mozilla.org/

[5] Riivo Kikas, Marlon Dumas, Dietmar Pfahl - Using dynamic and contextual features to predict issue lifetime in GitHub projects


