# Panaguard #
<a name="panaguard"></a>

www.panaguard.org

Panaguard is a proof of concept for technologically up-to-date emergency response infrastructure, streamlining  9-1-1 to relay more information in less time - no registration or login required. 
<div style="text-align:center" align="center">
	<img src="https://github.com/llopinator/Panaguard/blob/master/Screenshots/Panaguard.gif" 
		display="block"/>
</div>

<a name="table-of-contents"></a>
# Table of Contents 
 
 * [Panaguard](#panaguard)
 * [Table of Contents](#table-of-contents)
 * [How it Works](#how-it-works)
 * [Technologies and Packages Used](#technologies)
 	* [Mobile App (Users)](#mobile-app)
 	* [Web App (Dispatchers) and Backend](#web-app)
 * [Implementation](#implementation)
 	* [Mobile App (Users)](#mobile-app-implementation)
 	* [Web App (Dispatchers)](#web-app-implementation)
 * [Future User Experience Flow](#ux-flow)

<a name="how-it-works"></a>
# How it Works

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

In the event of an emergency, users press one button, which alerts their emergency contacts and sends their medical information/conditions - along with location data like their latitude & longitude - to a dispatcher, who receives this data on a web app and can begin dispatching the appropriate help. In the current iteration of the app, the user can then select from their known medical conditions to indicate which one is the cause of their current emergency. All of this occurs in real time over a WebSocket connection between user and dispatcher.


<div style="text-align:center" align="center">
	<img src="https://github.com/llopinator/Panaguard/blob/master/Screenshots/Emergency1.png" 
		display="block"/>
	<img src="https://github.com/llopinator/Panaguard/blob/master/Screenshots/Emergency2.png" 
		display="block"/>
</div>


<a name="technologies"></a>
# Technologies and Packages Used

	
<a name="mobile-app"></a>
## Mobile App (Users)

* React Native (https://facebook.github.io/react-native/)
* react-native-uuid (https://www.npmjs.com/package/react-native-uuid)

<a name="web-app"></a>
## Web App (Dispatchers) and Backend

* React (https://facebook.github.io/react/)
* Node.js (https://nodejs.org/en/)
* Express (http://expressjs.com/)
* MongoDB (https://mlab.com)
* Mongoose (http://mongoosejs.com/)
* jsonwebtoken (https://www.npmjs.com/package/jsonwebtoken)
* bcrypt (https://www.npmjs.com/package/bcrypt)
* ws (https://www.npmjs.com/package/ws)

<a name="implementation"></a>
# Implementation

<a name="mobile-app-implementation"></a>
## Mobile App (Users)

Users aren't required to register, log in, perform sms verification, or otherwise do anything besides entering the app to access its full functionality. Instead, a unique user id (uuid) is issued to first time app users when they open the app. The uuid is encrypted in a jsonwebtoken (JWT), signed with a user specific secret, and stored locally in async storage. Medical information/conditions and emergency contacts are also stored in async storage.
 
When a user presses the emergency button, a WebSocket message is sent to the WebSocket server (WSS) with the JWT containing the user's uuid. If the JWT is successfully unencrypted, the user is authenticated and paired with the next dispatcher currently connected to the WSS (dispatchers are put into a queue upon connecting to the WSS and removed as they get paired with users) and an acknowledgement message is sent back to the user. User and dispatcher are paired by storing the object representing each party's WebSocket connection as a property on the other's connection object.

The acknowledgment message sent to the user upon being paired with a dispatcher in turn prompts the user to send the WSS back a message containing the user's medical information/conditions and location data, all of which is passed along to the dispatcher they've been paired with. Before the dispatcher receives this information, it's stored in a timestamped Emergency object and saved in the database. When the emergency is canceled or resolved, the Emergency object in the database is updated with the emergency's end time.

When the user selects the type of their emergency from their known medical conditions, another message is sent that relays this information to the dispatcher. If a user cancels their emergency, their connection to the WSS is eliminated. However, the user's information (including a callback number) remains on the dispatcher's screen to allow follow up contact with the user if deemed necessary. If it's not, the dispatcher can either choose to reenter the queue for emergency requests or stop listening for emergencies.

<a name="web-app-implementation"></a>
## Web App (Dispatchers)

Unlike app users, dispatchers must register accounts. When a registered dispatcher logs in to the web app, they're issued a JWT signed with a dispatcher specific secret that encrypts their User object (retrieved from the database) and stores the JWT in local storage. From here they can begin "listening for emergencies", which attempts to connect them to the WSS by sending a WebSocket message with their JWT and, upon successful authentication, adds them to a queue of dispatchers waiting to be paired with incoming emergencies.

When a dispatcher resolves an emergency, they can choose to either be added to the end of the queue of dispatchers or to stop listening for emergencies. 

<a name="ux-flow"></a>
# Future User Experience Flow

<div style="text-align:center" align="center">
	<img src="https://github.com/llopinator/Panaguard/blob/master/mockups/Panaguard%20mock3.png" 
		display="inline-block"
		width="290"
		height="301.7"/>
	<img src="https://github.com/llopinator/Panaguard/blob/master/mockups/Panaguard%20mock1.png" 
		display="inline-block"
		width="290"
		height="301.7"/>
	<img src="https://github.com/llopinator/Panaguard/blob/master/mockups/Panaguard%20mock2.png" 
		display="inline-block"
		width="290"
		height="301.7"/>
</div>

These mockups represent the final design iteration - of which there were many - that I settled on. 

A test call button has been added to the main view (left mockup) so that users can practice using the app before emegency strikes. 

A transition (middle mockup) has also been added between requesting emergency help and being paired with a dispatcher, allowing users to correct their GPS location if it's incorrect or cancel the call if they wish. Although not pictured in the mockup, there'd also be a "can't speak" button on this view.

Finally, the view presented to users once they've been paired with a dispatcher (right mockup) has been completely revamped. The buttons on the top enable users to, in order: text the dispatcher, adjust their location, mute/unmute the dispatcher, and turn speaker on/off. The 'select emergency button' takes users to an interface from which they can select either a known medical condition or an unrelated event as the cause of their emergency. Finally, there's a box of real time updates tracking important developments, such as when the user is successfully paired with a dispatcher or when they've successfully communicated something about their emergency. Like the previous view, this view would also ideally have a "can't speak" button.




