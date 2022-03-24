This project contains the React JavaScript frontend code for the brain atlas application.

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

---

## Requirements

You need to have Node.js installed on your local development machine, this is required to handle npm packages.

https://nodejs.org/en/download/

Once the react project has been cloned from GitHub run the following from the react project directory: '/react-ui'.

```shell script
npm install
```

This will install all of the project dependencies specified in package.json.

---

## Running the project in development mode

In the react project directory '/react-ui', you can run:

```shell script
npm start
```

Runs the app in the development mode.<br />
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.<br />
You will also see any lint errors in the console.

---

## Building the project for production

```shell script
npm run build
```

Builds the app for production to the `build` folder.<br />
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.<br />
Your app is ready to be deployed!

This command can be skipped if you wish to build and deploy the project using the shortcut command (see below)

---

### Deployment

You can build and deploy the project using a single command:

```shell script
npm run deploy
```

This will run the predeploy process first which builds the app and then deploys it to GitHub pages.

---

### Hosting

The application is hosted on GitHub pages in the same project as where the source code is published.

The URL for the hosted application is [https://github-pages.ucl.ac.uk/BrainAtlas/#/atlas](https://github-pages.ucl.ac.uk/BrainAtlas/#/atlas)

---

## Building the project for staging

```shell script
npm run deployStaging
```

Builds a staging version of the app to the `build` folder.<br />

The build is minified and the filenames include the hashes.<br />

The build is then published to a separate GitHub repository that is setup simply to host the staging version of the app. No development code is maintained in the staging repo, it only hosts the current build.

The URL for the staging application is [https://github-pages.ucl.ac.uk/BrainAtlas-staging/#/atlas](https://github-pages.ucl.ac.uk/BrainAtlas-staging/#/atlas)

Once the staging app is deployed, the build folder is deleted next time you run the above command. This allows us to push a brand new staging build each time.

For more guidance see: [https://blog.bloomca.me/2017/12/15/how-to-push-folder-to-github-pages.html](https://blog.bloomca.me/2017/12/15/how-to-push-folder-to-github-pages.html)

---

## Running JavaScript tests

In the react project directory '/react-ui', you can run:

```shell script
npm test -- --watchAll=false
```

This will run the tests with watch and interactive mode set to false.

## Additional Project Notes

Please refer to the top level readme for information on how mri and histology slices are synchronised.

---

## Project Structure

Development files are located in '/react-ui/src' with all components routed into App.js
