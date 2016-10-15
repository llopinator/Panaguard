#Panaguard <a name="panaguard"></a>


www.panaguard.org

Panaguard is a proof of concept for technologically up-to-date emergency response infrastructure, streamlining  9-1-1 to relay more information in less time - no registration or login required. 
<div style="text-align:center" align="center">
	<img src="https://github.com/llopinator/Panaguard/blob/master/Screenshots/Panaguard.gif" 
		display="block"/>
</div>

##Table of Contents

	* [Panaguard](#panaguard)
	* [Table of Contents](#table-of-contents)
	* [How it Works](#how-it-works)
	* [Technologies Used](#technologies-used)
	* [Implementation](#implementation)
		* [Mobile App (Users)](#mobile-app)
		* [Web App (Dispatchers)](#web-app)


##How it Works

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

