# Express Photo Application

### Step 01 - Install pre-requirments

### Pre requirements
* [NodeJS](https://nodejs.org/)
* [Git](https://git-scm.com/downloads)
* [MongoDB](https://www.mongodb.org/downloads)

### Visual Studio 
* **Install the mongoDB plugin:** [Azure Cosmos DB](https://marketplace.visualstudio.com/items?itemName=ms-azuretools.vscode-cosmosdb)
* Add mongo to your VS Code path in your `settings.json`
```
  "mongo.shell.path" : "..."
```

### Connecting to the DB
* Create folder named `data` in your project root folder
  - This folder will contain all the mongoDB files
* Copy the `mongod.conf` to your local project folder
* Check the connection to your db
  - Windows: `mongod.bat` (Edit the file and set the path to your `mongod.exe`)
  - Unix based: `mongod.sh`

