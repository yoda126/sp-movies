BED assignment 2
Name: Chian ZhengHang
Admin number: p2025845
Class: DISM/FT/2A/01

Setting up:
Open and run init.sql in mysql workbench (some sample data will already be in the database)
Open and edit "dbconnect.js" in Backend folder, changing its host, user and password to the one for the mysql connection
Open start.bat, it should start both the frontend and backend servers
If needed do npm install to get or repair the node modules needed
Password for users and admins already in database is in userandpassword.txt
website is at http://localhost:80/

Folder hierarchy:
- root folder
	Backend
		auth
			verifytoken.js
		controller
			app.js
		imagestorage
		model
			databaseconfig.js
			genres.js
			login.js
			movieimage.js
			movies.js
			review.js
			screening.js
			users.js
		node_modules
		config.js
		package.json
		package-lock.json
		readme.txt
		server.js
		table.docx
	Frontend
		node_modules
		public
			css
				admin.css
				index.css
				login.css
				navbar.css
				register.css
			images
			js
				admin.js
				index.js
				login.js
				navbar.js
				register.js
			admin.html
			index.html
			login.html
			register.html
		package.json
		package-lock.json
		server.js
	init.sql
	Modifications.docx
	readme.txt	
	start.bat
	userandpassword.txt
				
			