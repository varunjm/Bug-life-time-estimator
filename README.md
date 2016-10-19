# SE-Bot

## Team Members:
* Aditya Shirode (avshirod)
* Anshul Prakash Deshkar (adeshka)
* Parin Sanghavi (prsangha)
* Varun Jayathirtha (vjayath)

## Milestones:
* DESIGN.md added for Design Milestone
* FIXDESIGN.md for Design fixes.

##Usage

###Setup/installation

NOTE: Instructions provided for Linux based system.

* Install [Ngrok](https://ngrok.com/)
* Create a `config.json` file in the same directory as the `app.js` file. This JSON is structured as follows:

```javascript
{
    "github_api_url": "https://github.ncsu.edu/api/v3",
    "repositories": [
        {
            "name": "<repository-name>",
            "owner":"<user-id>",
            "access_token": "token <github-access-token>"
        }
    ],
    "ngrok_api_url": "http://127.0.0.1:4040/api/tunnels/",
    "app_port": "<port number>",
    "app_route": "/predict-bug-lifetime"
}
```
The fields marked in angular brackets are customizable values, needed to be filled by the user, which could be pertinent to their github account or repository. All the remaining fields (`github_api_url`, `ngrok_api_url`, `app_route`) need to be used as is. More than one repositories can be provided as an array of JSONs. Each of these repositories will be assigned a web hook that is triggered by an 'issues' event.

    - `<repository-name>` : Repository to which the event Web Hook belongs.
    - `<user-id>`: Id of the owner of the said repository.
    - `<github-access-token>`: Access token needed make API calls, specific to the said owner.
    - `<port number>`: Port address of the local app. Normally its value is 3000.

### Running the app
* In a terminal, run `ngrok http <port number>`. Use the same port number provided in the `config.json` file.
* In another terminal run `npm install` followed by `npm start`. This installs all the dependencies and starts the app (bot)
