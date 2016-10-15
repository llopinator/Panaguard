#Panaguard 
<a name="panaguard"></a>

www.panaguard.org

Panaguard is a proof of concept for technologically up-to-date emergency response infrastructure, streamlining  9-1-1 to relay more information in less time - no registration or login required. 
<div style="text-align:center" align="center">
	<img src="https://github.com/llopinator/Panaguard/blob/master/Screenshots/Panaguard.gif" 
		display="block"/>
</div>

<a name="table-of-contents"></a>
#Table of Contents
 
 * [Panaguard](#panaguard)
 * [Table of Contents](#table-of-contents)
 * [How it Works](#how-it-works)
 * [Technologies and Packages Used](#technologies)
 	* [Mobile App (Users)](#mobile-app)
 	* [Web App (Dispatchers) and Backend](#web-app)
 * [Implementation](#implementation)
 	* [Mobile App (Users)](#mobile-app-implementation)
 	* [Web App (Dispatchers) and Backend](#web-app-implementation)

<a name="how-it-works"></a>
#How it Works

An iOS app enables users to store medical information/conditions and emergency contacts in advance.

<div style="text-align:center" align="center">
	<img src="https://github.com/llopinator/Panaguard/blob/master/Screenshots/Panaguard%20Landing.png" 
		display="inline-block"
		width="218"
		height="394"/>
	<img src="https://github.com/llopinator/Panaguard/blob/master/Screenshots/Panaguard%20MedInfo1.png" 
		display="inline-block"
		width="218"
		height="394"/>
	<img src="https://github.com/llopinator/Panaguard/blob/master/Screenshots/Panaguard%20MedInfo2.png" 
		display="inline-block"
		width="218"
		height="394"/>
	<img src="https://github.com/llopinator/Panaguard/blob/master/Screenshots/Panaguard%20EmergencyContacts.png" 
		display="inline-block"
		width="218"
		height="394"/>
</div>

In the event of an emergency, users press one button, which alerts their emergency contacts and sends their medical information/conditions - along with location data like their latitude & longitude - to a dispatcher, who receives this data on a web app. In the current iteration of the app, the user can then select from their known medical conditions to indicate which one is the cause of their current emergency. All of this occurs in realtime over a WebSocket connection between user and dispatcher.


<div style="text-align:center" align="center">
	<img src="https://github.com/llopinator/Panaguard/blob/master/Screenshots/Emergency1.png" 
		display="block"/>
	<img src="https://github.com/llopinator/Panaguard/blob/master/Screenshots/Emergency2.png" 
		display="block"/>
</div>


<a name="technologies"></a>
#Technologies and Packages Used

	
<a name="mobile-app"></a>
##Mobile App (Users)

* React Native (https://facebook.github.io/react-native/)
* react-native-uuid (https://www.npmjs.com/package/react-native-uuid)
* react-native-keychain (https://github.com/oblador/react-native-keychain)

<a name="web-app"></a>
##Web App (Dispatchers) and Backend

* React.js (https://facebook.github.io/react/)
* Node.js (https://nodejs.org/en/)
* Express.js (http://expressjs.com/)
* MongoDB (https://mlab.com)
* Mongoose (http://mongoosejs.com/)
* jsonwebtoken (https://www.npmjs.com/package/jsonwebtoken)
* bcrypt (https://www.npmjs.com/package/bcrypt)
* ws (https://www.npmjs.com/package/ws)

<a name="implementation"></a>
#Implementation

<a name="mobile-app-implementation"></a>
##Mobile App (Users)


<a name="web-app-implementation"></a>
##Web App (Dispatchers) and Backend



