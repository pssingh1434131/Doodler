# WEBSTER 2K23
### Team Name: Friday

### Project Name: Doodler

### Team Member's Name:

- Ankita Verma\
(https://github.com/ankita-46)
- Priyanshu Singh\
(https://github.com/pssingh1434131)
- Madhubrat Dixit\
(https://github.com/Madhubrat1562)

### About project:-
"Doodler" is an engaging multiplayer web game where one participant illustrates an object, and fellow players attempt to guess the object's name based on the drawing. Players earn points based on the accuracy of their guesses, fostering an interactive and fun-filled gaming experience.

### Video Link:-
https://drive.google.com/drive/folders/1yTQvXK-THX7-PIrDpB6RFuiCEfscyfJ0?usp=sharing

### Images from site:-
https://drive.google.com/drive/folders/1TLu3G6X79pXkEANsKEGc0DpnjCaN9rmU?usp=sharing

### Current Features:-

- User authentication and authorization 
- Website has a profile page where users can view their profile and change their avatar, name and password
- Website has a friend feature so that user can send and recieve freind request in realtime
- Website has chat feature externally apart from the in game chat feature
- The game has two different modes ... first mode is play with friends in which user can generate or join a room along with they can send invite code for their friends to join... second mode is play online or play with random people where users join and we select two peoples from the pool on the realtime basis and they can play the game
- It has a multiplayer game which has by default 2 number of players and we can dynamically select number of players as well till five. In one room at a time one player is presenter and others are spectator who guess the object and they will get points depending upon their accuracy.
- The Game has inbuilt chat feature and host can restrict others to chat when found any profanity also chat has inbuilt feature to block the user when he send three profane messages in chat
- The host can kick out other users
- User can download and share whiteboard image
- Whiteboard has multiple drawing tools like pencil, Brush Colors, many shapes and eraser etc...
- Undo and Redo feature is also there in whiteboard
- There are three rounds in game in which each person will get to present his screen periodically and presenter changes in every one minute.
- After every game, game history is saved in database and user can view his game history on homepage.

### Upcomming Features:-
- Collabrative drawing
- Mobile compatibility
- Play with computer with ML Model
- Some more advanced shapes and painting tools in whiteboard

### Tech Stack
* CLIENT:  React.js
* BACKEND:  Node.js, Express.js
* DATABASE:  MongoDB

### How to run on local system
- Clone main branch in your local system
- run "npm i" in Doodler , Doodler/client, Doodler/server directories
- Create and initialize in your .env file and put it in Doodler/server
- in Doodler directory run "npm start" to run both server and client simultaneously.