1.	Download/Install Node – 
2.	Download/Install Git
3.	Open Git bash on project directory
4.	git clone https://github.com/oAln/NFGI.git - this will create front end folder
5.	git clone https://github.com/oAln/NFGI_Backend.git - This will create back end folder
6.	open git bash folder wise.
7.	Run npm i – this is only one time on both folder
8.	Run npm run start on both folder
9.  Login admin/ admin@321


# Create Docker Image
$ docker build -t nfgi-fe .

# Run Docker Image
$ docker run -p 4200:4200 nfgi-fe