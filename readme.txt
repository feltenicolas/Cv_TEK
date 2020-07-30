Created by Nicolas FELTEN 
Epitech Marseille promo 2020

This is a NodeJS API designed to work with firebase.
The goal of this API is to manage student CV to make it more acceccible to recruiters.


/!!\ IMPORTANT !! You will need to create a file permissions.json :
 - First go to : https://console.firebase.google.com/
 - Then create a project
 - Go to your project settings : https://console.firebase.google.com/project/[PROJECT ID]/settings/general
 - Click on service accounts
 - then click on generate new private key, it will normaly give you a file.json => This is the permissions.json file.

The GET routes are : 

- /api/getallstudents : You will get a list containings all students and all informations about their CV.
- /api/students/:mail : Replace the :mail by the student mail in order to get informations about the student.
  Exemple : /api/students/nicolas.felten@epitech.eu
- /api/search : STILL IN PROGRESS -> This route will allow  you to search for a category like promo, mail, nom, prenom or competences.
For exemple you will search for competences they keyword PHP and you will get all students who have PHP competences.


The POST routes are :

- /api/create : This route will create a student in the database. 
You will need to send these informations : nom, prenom, promo, url_cv, url_photo, competences.

The PUT routes are :

- /api/updatestudent/:mail : Replace :mail by the student mail in order to modify informations about the student or his CV.
Exemple : /api/updatestudent/nicolas.felten@epitech.eu 

The DELETE routes are :

- /api/delete/:mail : Replace :mail by the student mail in order to delete the informations about him and his CV.
