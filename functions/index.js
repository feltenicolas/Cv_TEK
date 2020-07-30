

const cron = require("node-cron");

const functions = require('firebase-functions');
const admin = require('firebase-admin');

var serviceAccount = require("./permissions.json");
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://cvtek-5979f.firebaseio.com"
});
const db = admin.firestore();

const nodemailer = require("nodemailer");
const express = require('express');
const cors = require('cors');
const app = express();
app.use(cors({ origin: true }));

app.get('/hello-world', (req, res) => {
  return res.status(200).send("Hello you.");
});


let transporter = nodemailer.createTransport({  //Be careful you may have to change your gmail settings to accept low security applications
    service: 'gmail',
    auth: {
        user: /*YOUR GMAIL ADDRESS*/'',
        pass: /*YOUR GMAIL PASSWORD*/''
    }
});


function sendMail(mail) {
    // getting dest email by query string
    const dest = mail;

    const mailOptions = {
        from: 'NicoLeCodeurFou <address@gmail.com>', // Something like: Jane Doe <janedoe@gmail.com>
        to: dest,
        subject: 'Garder votre CV dans la CVTEK', // email subject
        html: `<p style="font-size: 16px;">Déjà 1 mois !</p>
              <br />
              Bonjour si vous voulez continuer à afficher votre CV dans notre bibliothèque merci de
              <a href="http://localhost:5001/cvtek-5979f/us-central1/app/api/activatecv/`+mail+`">cliquer sur ce lien</a>.
              ` // email content in HTML
    };
      
    // returning result
    return transporter.sendMail(mailOptions, (erro, info) => {
        if(erro){
            console.log(erro);
            return (erro.toString());
        }
        return ('Sended');
    });
}

/** THIS FUNCTION PULL THE WHOLE DATABASE AND CHECK FOR THE DATE OF LAST PUSH OF CV (if date > 1 month then change CV display to false) */
cron.schedule("0 2 * * *", () => {
    console.log("test message every minutes");

    (async () => {
        try {
            let query = db.collection('Utilisateurs');
            let studentList = [];
            await query.get().then(querySnapshot => {
            let docs = querySnapshot.docs;
            for (let doc of docs) {
                const selectedItem = {
                    student_mail: doc.id,
                    competences: doc.data().competences,
                    nom: doc.data().nom,
                    prenom: doc.data().prenom,
                    promo: doc.data().promo,
                    url_cv : doc.data().url_cv,
                    url_photo : doc.data().url_photo,
                    display : doc.data().display,
                    creationDate : doc.data().creationDate,
                    expirationDate : doc.data().expirationDate
                };
                if (selectedItem.display == true) {
                    studentList.push(selectedItem);
                }
            }
            studentList = studentManager(studentList);
            });
        } catch (error) {
            console.log(error);
        }
        })();
});

function studentManager(studentLists) {
    var dateComparator = new Date().getTime();
    studentLists.forEach(student => {
        if (student.expirationDate != undefined) {
            if (dateComparator > student.expirationDate) {
                console.log("More than a month passed since last update");
                CvDisplayManager(false, student.student_mail); //Passe le display du CV en false
                sendMail(student.student_mail); // Envoie un mail à l'étudiant pour qu'il réactive son CV
            }
        } else {
            console.log(student.mail + " has no creation date !");
        }
    });
    return (studentLists);
}

function getTodayDate() {
    var today = new Date();
    var dd = String(today.getDate()).padStart(2, '0');
    var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    var yyyy = today.getFullYear();

    today = dd + '/' + mm + '/' + yyyy;
    return today;
}

// create
app.post('/api/create', (req, res) => {
    var date = new Date();
    var expirationDate = date.getTime() + (30 * 24 * 60 * 60 * 1000);
    (async () => {
        try {
          await db.collection('Utilisateurs').doc('/' + req.body.student_mail + '/')
              .create({
                  nom: req.body.nom,
                  prenom: req.body.prenom,
                  promo: req.body.promo,
                  url_cv: req.body.url_cv,
                  url_photo: req.body.url_photo,
                  competences: req.body.competences,
                  display : true,
                  creationDate : date,
                  expirationDate : expirationDate});
          return res.status(200).send();
        } catch (error) {
          console.log(error);
          return res.status(500).send(error);
        }
      })();
  });

  app.get('/api/student/:mail', (req, res) => {
    (async () => {
        try {
            const document = db.collection('Utilisateurs').doc(req.params.mail);
            let item = await document.get();
            let response = item.data();
            return res.status(200).send(response);
        } catch (error) {
            console.log(error);
            return res.status(500).send(error);
        }
        })();
    });

  app.get('/api/getallstudents', (req, res) => {
    (async () => {
        try {
            let query = db.collection('Utilisateurs');
            let response = [];
            await query.get().then(querySnapshot => {
            let docs = querySnapshot.docs;
            for (let doc of docs) {
                const selectedItem = {
                    student_mail: doc.id,
                    competences: doc.data().competences,
                    nom: doc.data().nom,
                    prenom: doc.data().prenom,
                    promo: doc.data().promo,
                    url_cv : doc.data().url_cv,
                    url_photo : doc.data().url_photo,
                    display : true
                };
                if (selectedItem.display == true) {
                    response.push(selectedItem);
                }
            }
            });
            return res.status(200).send(response);
        } catch (error) {
            console.log(error);
            return res.status(500).send(error);
        }
        })();
  });

  app.get('/api/search', (req, res) => {
    const type = req.body.type;
    switch (type) {
        case 'promo':
            break;
        case 'mail':
            break;
        case 'nom':
            break;
        case 'prenom':
            break;
        case 'competences':
            break;
        default :
          return res.status(500).send("Error, please enter a correct type for your research.");
    }
  });

  app.put('/api/updatestudent/:mail', (req, res) => {
    (async () => {
        try {
            const document = db.collection('Utilisateurs').doc(req.params.mail);
            await document.update({
                nom: req.body.nom,
                prenom: req.body.prenom,
                promo : req.body.promo,
                url_cv : req.body.url_cv,
                url_photo : req.body.url_photo
            });
            return res.status(200).send();
        } catch (error) {
            console.log(error);
            return res.status(500).send(error);
        }
        })();
  });

  app.get('/api/disablecv/:mail', (req, res) => {
    (async () => {
        try {
            console.log(req.params.mail);
            const document = db.collection('Utilisateurs').doc(req.params.mail);
            await document.update({
                display: false,
            });
            return res.status(200).send("Vous venez de désactiver votre CV avec l'adresse mail : " + req.params.mail);
        } catch (error) {
            console.log("An error happened:", error);
            return res.status(500).send(error);
        }
        })();

  })

  app.get('/api/activatecv/:mail', (req, res) => {
    (async () => {
        try {
            console.log(req.params.mail);
            const document = db.collection('Utilisateurs').doc(req.params.mail);
            await document.update({
                display: true,
            });
            return res.status(200).send("Vous venez de réactiver votre CV pour 1 mois avec l'adresse mail : " + req.params.mail);
        } catch (error) {
            console.log("An error happened:", error);
            return res.status(500).send(error);
        }
        })();
  })



  function CvDisplayManager(display, mail) {
    (async () => {
        try {
            console.log(mail);
            const document = db.collection('Utilisateurs').doc(mail);
            await document.update({
                display: display,
            });
            return true;
        } catch (error) {
            console.log("An error happened:", error);
            return error;
        }
        })();
  }


  //DELETE FROM DATABASE : BE REALLY CAREFUL WHEN YOU CALL THIS ONE.
  app.delete('/api/deleteStudent/:mail', (req, res) => {
    (async () => {
        try {
            const document = db.collection('Utilisateurs').doc(req.params.mail);
            await document.delete();
            return res.status(200).send();
        } catch (error) {
            console.log(error);
            return res.status(500).send(error);
        }
        })();
    });
  

exports.app = functions.https.onRequest(app);