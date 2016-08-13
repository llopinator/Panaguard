PANAGUARD

Panaguard offers a mobile app that enables users to request emergency medical assistance with the touch of one button. This button press simultaneously sends the type of a user's medical emergency/ any relevant medical information as well as their GPS location to both first responders (911 dispatch) AND to emergency contacts that have been preentered into the app. Panaguard greatly reduces the time it takes to receive emergency medical assistance by condensing an array of actions that victims must currently take in the event of a medical emergency, into one action. 

Key features include:

-Securely storing users' medical information and emergency contacts, mobile app interface to do so
-Intuitive mobile app interface with button for requesting emergency response ("Are you sure?" prompt when button is pressed), optional dropdown for selecting type of emergency (tentative feature)
-Web app for 911 dispatch to navigate incoming emergency requests; requires personnel to log in with an authenticated account 
-(tentative) specifically alert emergency contacts and/or nearby app users
-(tentative) mobile app live chat box with 911 dispatcher to tell them more about your emergency
-(tentative) option for mobile app users to be called immediately by their 911 dispatcher upon requesting EMS


##Technologies:

-MongoDB for storing user/dispatch profile information
-React native for mobile app
-React or server-side rendering for 911 dispatch web app
-Express, node, mongoose for backend

##Wireframes:  https://drive.google.com/file/d/0B6mZqI1ANQ1bRl9mellfQ3diUHc/view?usp=sharing

##Prioritized Feature List:

Phase 1: Mobile App
	a) Navigation between main, emergency contact, medical info & preferences views (see wireframes)
	b) The big red EMERGENCY button
	c) Sleek, polished, intuitive design that's easy to use across age groups
	d) (tentative) live chat with 911 dispatcher after requesting EMS
	e) (tentative) option to receive immediate call from 911 dispatcher after requesting EMS
	f) button for requesting help from emergency contacts (sends message informing emergency contact of emergency and whether or not EMS was also notified)
	g) backend
Phase 2: Web App
	a) GPS display of address where EMS required
	b) UX optimal display of victim's name, phone number, type of emergency, medical information
	c) (tentative) Live chat where victim can rapidly send details of their emergency
	d) (tentative) Button to call victim
	e) backend


**Must ensure everything above is HIPAA compliant.

##Data Models, Routes, Views
	
	Data Models:
		- User (mobile app)
			- phone (string)
			- password
			- medical information (object)
			- contacts (array of contact objects)
			- active (array of active requests)
			- preferences
		- User (911 dispatch)
			- name (string)
			- admin (bool)
			- occupied (bool)
			- active (array of requests)
		- Request (what the mobile app user creates when they have an emergency)
			- time (date)
			- user (object id)
			- dispatcher (object id)
			- active (bool)
		- Contact
			- name (string)
			- phone (string)
			- email (string)
			- relationship (string)
		- (tentative) Message (saves each message exchanged between mobile app user and 911 dispatcher via live chat feature)
			- user (object id)
			- dispatcher (object id)
			- body (string)
			- time (date)

	Routes:
		Mobile:
			auth.js
				- GET /login (render log in view)
				- POST /login (log in)

				- GET /signup (render sign up view)
				- POST /signup (sign up)

			index.js
				- GET /main (render main app view)

				- POST /main/emergency (submits request for EMS, renders an altered main app view)
				- GET /main/emergency (renders altered main app view for after user has requested EMS)

				- (tentative) POST /main/emergency/chat (submits message in live chat with 911 dispatcher)
				
				- GET /contacts (renders view for managing emergency contacts)
				- POST /contacts (creates new emergency contact)
				- DEL /contacts (deletes existing emergency contact)

				- GET /medinfo (renders view for managing medical information)
				- POST /medinfo (updates medical information)

				- GET /preferences (renders view for managing app preferences)
				- POST /preferences (updates app preferences)

		Web:
			emsAuth.js
				- GET /ems/login (renders log in view)
				- POST /ems/login (log in)

			emsIndex.js
				- GET /ems/main (renders view for display of victim's name, phone number, type of emergency, medical information, maybe live chat box)

				- (tentative) POST /ems/main/chat (submits message in live chat with victim requesting EMS)

			emsAdmin.js
				- GET /ems/admin (renders view for 911 dispatch center administrator to manage dispatcher profiles)
				- GET /ems/admin/dispatcher (renders view for viewing a dispatcher's profile)
				- POST /ems/admin/dispatcher (creates dispatcher profile)
				- DEL /ems/admin/dispatcher (deletes dispatcher profile)

	Views: 
		-Log In
		-Sign Up
		-Register
		-View for each wireframe

# Panaguard
