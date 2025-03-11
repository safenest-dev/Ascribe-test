The URL shortner app.

Steps to test the app
1. clone the repository.
2. It has the client and server folders, you will set up both apps;
   
#   Setup the client:
   
   i.     Navigate into the client directory and run "npm install" to install all dependencies.
   ii.    Create an env file in the root of this folder (client/.env) that will hold the url for your backend server, in this example, the server will be running on "port 5000",
         if your are testing this locally, just ensure this points to the port you are running your server on in the server set up, as it is, if youre not changing anything
         your env should have  VITE_API_URL and for this example VITE_API_URL=http://localhost:<YOUR_SERVER_PORT_NUMBER>.
   iii.  Run "npm run dev" to start the client side application.

#   Setup the server:

   i. Navigate to the server folder and run "npm install" to install all packages and dependecies.
   ii. Run "node index.js" to start the server


Note: the port being used by the server should be the one you are referencing in the env file.

   
 For this project, I decided to use sqlite for its simplicity.

 
 
