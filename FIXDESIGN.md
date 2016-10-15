### Reacting to Actions for Milestone 1


&nbsp;
#### Action 1: How Training/Testing is handled in process? Is there online learning/feedback?
*Bugzilla* offers a Web API that can be used to get data about a bug in JSON format. We would be extracting features from this data to generate our dataset.

The data would be divided into training (80%) and testing (20%) datasets. The Training dataset would be used to create the prediction model using the listed machine learning algorithms and the Testing dataset would be used to compute performance metrics to compare which model works the best.
Online learning/feedback does not suit our system completely, because a bug may be reopened after being closed so its lifetime can only be confirmed after the project is completed. 

#### Action 2: What features are used for prediction? How are they extracted?
The features in the dataset used for prediction would be:
* Priority - The Priority field on a bug
* Severity - The Severity field on a bug
* Operating System - On which the bug was observed
* Assignee count - The number of users assigned to the issue
* Bug dependency time aggregate - Sum of lifetimes of all bugs this bug is dependant on
* Keywords - Each keyword associated with the bug


These features would be extracted from the Issue JSON as follows:
* Keywords would be extracted from the ‘Title’, ‘Description’
* For the purpose of bug lifetime prediction, we would mandate the issue created to contain the following information in the ‘Description’ - `Priority, Severity, Operating System, Bug dependency list`. 
The Bug dependency time aggregate would be calculated using the Bug dependency list.
* Assignee count would be extracted from ‘Assignees’


#### Action 3: Architecture is very sparse; think through requirements more deeply

![Updated Architecture](/images/arch_diag.png)

&nbsp;
The bot follows the Implicit Invocation Event Driven Architecture. 
We have 3 parts in the architecture:
* The process of creating a prediction model
* The bot 
* GitHub UI

The Process of creating a prediction model includes Feature Extraction from the raw dataset. The dataset itself is divided into training and testing datasets (80:20 partition). The Prediction Model is created using the most accurate machine learning algorithm (among a few) to return an estimate of the lifetime of the bug, depending on various parameters of the bug. It would be generated before the deployment of the bot and would be a static data structure that the bot will use for prediction.

The Bot would work as a program that interacts with the user through the Github UI and uses the Prediction Model to evaluate it. The Event Listener would listen to the event of an issue opening on Github. This is accomplished by using Webhooks. The Event Parser extracts the required features from the JSON received from the Webhook. After the bot predicts the lifetime, it would comment back on the Github issue with this prediction.

The GitHub UI would display the Issue and comments on the Issue’s page and would serve as Front-End for the Bot and its functionalities.


#### Action 4: Additional Patterns

We can use Singleton pattern, as it fits the single instance logic of the program. The bot acts as the only access point for the predictor model. The bot will listen to the events reported by Webhooks of various repositories. It filters events and looks for only those which are tagged as ‘bug’ and ‘opened’. 

Another relevant pattern is Facade pattern, because the bot encapsulates all the complex logic that goes on when an issue is generated on GitHub - it analyses the bug reported, finds out attributes to give to predictor model, uses predictor model to estimate the time the bug would take, on average to be fixed, and comment that on the concerned issue. The bot simplifies all this and provides us with the final output - a comment, based on the description provided for the bug.
