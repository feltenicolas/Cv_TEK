

const cron = require("node-cron");

const functions = require('firebase-functions');
const admin = require('firebase-admin');

const engines = require('consolidate');

var serviceAccount = require("./permissions.json");
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://cvtek-2b310.firebaseio.com"
});
const db = admin.firestore();

const nodemailer = require("nodemailer");
const express = require('express');
const cors = require('cors');
const { response } = require("express");
const cons = require("consolidate");
const app = express(); 
app.use(cors({ origin: true }));

app.engine('hbs', engines.handlebars);
app.set('views', './views');
app.set('view engine', 'hbs');

app.get('/hello-world', (req, res) => {
  return res.status(200).send("Hello you.");
});

app.get('/', (req, res) => {

    
    getAllStudents().then(studentList => {
        res.render('index', {studentList});
        return (studentList);
    }).catch(error => {
        return (error);
    });
});

app.get('/formation', (req, res) => {
    res.render('formation');
});

app.get('/validation', (req, res) => {
    getAllUnvalidatedStudents().then(studentList => {
        res.render('validation', {studentList});
        return (studentList);
    }).catch(error => {
        console.log(error);
        return (error);
    });
    
});

app.get('/inscription', (req, res) => {
    res.render("inscription");
});

app.get('/promowac', (req, res) => {
    getAllFormationStudents("WAC").then(studentList => {
        getFormationInformation("WAC").then(formationList => {
            const promo = "Promotion Web Academy";
            res.render('promo', {promo, studentList, formationList});    
        });
    });
});

app.get('/promomsc', (req, res) => {
    getAllFormationStudents("MSC").then(studentList => {
        getFormationInformation("MSC").then(formationList => {
            const promo = "Promotion MSC";
            res.render('promo', {promo, studentList, formationList});    
        });

    });
});

app.get('/promotek1', (req, res) => {
    const promo = "Promotion TEK 1";
    const month = new Date().getMonth();
    var Year = new Date().getFullYear();
    if (month > 5) {
        Year += 5;
    } else {
        Year += 4;
    }
    getAllPromoStudents(Year).then(studentList => {
        console.log("studentLIst=", studentList);
        getFormationInformation("PGE1").then(formationList => {
            console.log("studentLIst=", studentList);
            res.render('promo', {promo, studentList, formationList});    
        });
    }).catch(error => {
        console.log(error);
        return (error);
    });
});

app.get('/promotek2', (req, res) => {
    const promo = "Promotion TEK 2";
    var Year = new Date().getFullYear();
    const month = new Date().getMonth();
    if (month > 5) {
        Year += 4;
    } else {
        Year += 3;
    }
    getAllPromoStudents(Year).then(studentList => {
        getFormationInformation("PGE2").then(formationList => {
            res.render('promo', {promo, studentList, formationList});    
        });
    }).catch(error => {
        console.log(error);
        return (error);
    });
});

app.get('/promotek3', (req, res) => {
    const promo = "Promotion TEK 3";
    const month = new Date().getMonth();
    var Year = new Date().getFullYear();
    if (month > 5) {
        Year += 3;
    } else {
        Year += 2;
    }
    getAllPromoStudents(Year).then(studentList => {
        getFormationInformation("PGE3").then(formationList => {
            res.render('promo', {promo, studentList, formationList});    
        });
    }).catch(error => {
        console.log(error);
        return (error);
    });
});

async function getFormationInformation(formation) {
    let query = db.collection('Formation');
    let response = [];
    await query.get().then(querySnapshot => {
        let docs = querySnapshot.docs;
        docs.forEach((doc) => {
            const selectedItem = {
                nom: doc.id,
                description: doc.data().description,
                titre: doc.data().titre,
            };
            if (selectedItem.nom === formation) {
                response.push(selectedItem);
            }
            return (response);                
        })
        return querySnapshot;
    });
    return (response);
}

async function getAllFormationStudents(formation) {
    let query = db.collection('Utilisateurs');
    let response = [];
    await query.get().then(querySnapshot => {
        let docs = querySnapshot.docs;
        docs.forEach((doc) => {
            const selectedItem = {
                student_mail: doc.id,
                competences: doc.data().competences,
                nom: doc.data().nom,
                prenom: doc.data().prenom,
                promo: doc.data().promo,
                url_cv : doc.data().url_cv,
                url_photo : doc.data().url_photo,
                display : doc.data().display,
                valid : doc.data().valid
            };
            if (selectedItem.display === true && selectedItem.valid === true && selectedItem.formation === formation) {
                response.push(selectedItem);
            }
            return (response);                
        })
        return querySnapshot;
    });
    return (response);
}


async function getAllPromoStudents(promo) {
    let query = db.collection('Utilisateurs');
    let response = [];
    await query.get().then(querySnapshot => {
        let docs = querySnapshot.docs;
        docs.forEach((doc) => {
            const selectedItem = {
                student_mail: doc.id,
                competences: doc.data().competences,
                nom: doc.data().nom,
                prenom: doc.data().prenom,
                promo: doc.data().promo,
                url_cv : doc.data().url_cv,
                url_photo : doc.data().url_photo,
                display : doc.data().display,
                valid : doc.data().valid
            };
            if (selectedItem.display === true && selectedItem.valid === true && selectedItem.promo === promo) {
                response.push(selectedItem);
            }
            return (response);                
        })
        return querySnapshot;
    });
    return (response);
}


async function getAllStudents() {
    let query = db.collection('Utilisateurs');
    let response = [];
    await query.get().then(querySnapshot => {
        let docs = querySnapshot.docs;
        docs.forEach((doc) => {
            const selectedItem = {
                student_mail: doc.id,
                competences: doc.data().competences,
                nom: doc.data().nom,
                prenom: doc.data().prenom,
                promo: doc.data().promo,
                url_cv : doc.data().url_cv,
                url_photo : doc.data().url_photo,
                display : doc.data().display,
                valid : doc.data().valid
            };
            if (selectedItem.display === true && selectedItem.valid === true) {
                response.push(selectedItem);
            }
            return (response);                
        })
        return querySnapshot;
    });
    return (response);
}


async function getAllStudents() {
    let query = db.collection('Utilisateurs');
    let response = [];
    await query.get().then(querySnapshot => {
        let docs = querySnapshot.docs;
        docs.forEach((doc) => {
            const selectedItem = {
                student_mail: doc.id,
                competences: doc.data().competences,
                nom: doc.data().nom,
                prenom: doc.data().prenom,
                promo: doc.data().promo,
                url_cv : doc.data().url_cv,
                url_photo : doc.data().url_photo,
                display : doc.data().display,
                valid : doc.data().valid
            };
            if (selectedItem.display === true && selectedItem.valid === true) {
                response.push(selectedItem);
            }
            return (response);                
        })
        return querySnapshot;
    });
    return (response);
}

async function getAllUnvalidatedStudents() {
    let query = db.collection('Utilisateurs');
    let response = [];
    await query.get().then(querySnapshot => {
        let docs = querySnapshot.docs;
        docs.forEach((doc) => {
            const selectedItem = {
                student_mail: doc.id,
                competences: doc.data().competences,
                nom: doc.data().nom,
                prenom: doc.data().prenom,
                promo: doc.data().promo,
                url_cv : doc.data().url_cv,
                url_photo : doc.data().url_photo,
                display : doc.data().display,
                valid : doc.data().valid
            };
            if (selectedItem.display === true && selectedItem.valid === false) {
                response.push(selectedItem);
            }
            return (response);                
        })
        return querySnapshot;
    });
    return (response);
}

async function getAllFormations() {
    let query = db.collection('Formation');
    let response = [];
    await query.get().then(querySnapshot => {
        let docs = querySnapshot.docs;
        docs.forEach((doc) => {
            const selectedItem = {
                nom: doc.id,
                description: doc.data().description,
                titre: doc.data().titre,
            };
            response.push(selectedItem);
            return (response);                
        })
        return querySnapshot;
    });
    return (response);
}

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
        from: 'CVTEQUE@NOREPLY <epitech.cvteque@gmail.com>', // Something like: Jane Doe <janedoe@gmail.com>
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
                
                docs.forEach((doc) => {
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
                    if (selectedItem.display === true) {
                        studentList.push(selectedItem);
                    }
                    return (studentList);
                })
                
                /*for (let doc of docs) {
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
                    if (selectedItem.display === true) {
                        studentList.push(selectedItem);
                    }
                }*/
                studentList = studentManager(studentList);
                return (studentList);
            });
        } catch (error) {
            console.log(error);
        }
        })();
});

function studentManager(studentLists) {
    var dateComparator = new Date().getTime();
    studentLists.forEach(student => {
        if (student.expirationDate !== undefined) {
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

app.post('/api/createformation', (req, res) => {
    (async () => {
        try {
            await db.collection('Formation').doc('/' + req.body.nom + '/')
              .create({
                  description: req.body.description,
                  titre: req.body.titre,
                });
            return res.status(200).send("Formation créé.");
        } catch (error) {
            return res.status(500).send("Une erreur est survenue, veuillez contacter un administrateur.");
        }
      })();
  });

// create
app.post('/api/create', (req, res) => {
    var date = new Date();
    var expirationDate = date.getTime() + (30 * 24 * 60 * 60 * 1000);
    (async () => {
        try {
            if (req.body.url_cv.includes("http") === false) {
                req.body.url_cv = "https://"+req.body.url_cv;
            }
            if (req.body.url_photo.includes("http") === false ) {
                req.body.url_photo = "https://"+req.body.url_photo;
            }
            await db.collection('Utilisateurs').doc('/' + req.body.student_mail + '/')
              .create({
                  nom: req.body.nom,
                  prenom: req.body.prenom,
                  promo: parseInt(req.body.promo, 10),
                  url_cv: req.body.url_cv,
                  url_photo: req.body.url_photo,
                  competences: req.body.competences,
                  display : true,
                  valid : false,
                  creationDate : date,
                  expirationDate : expirationDate,
                  formation : req.body.formation
                });
            return res.status(200).send("CV créé, en attente de validation.");
        } catch (error) {
            return res.status(500).send("Une erreur est survenue, veuillez contacter un administrateur.");
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
                reponse = docs.forEach((doc) => {
                    const selectedItem = {
                        student_mail: doc.id,
                        competences: doc.data().competences,
                        nom: doc.data().nom,
                        prenom: doc.data().prenom,
                        promo: doc.data().promo,
                        url_cv : doc.data().url_cv,
                        url_photo : doc.data().url_photo,
                        display : doc.data().display,
                        valid : doc.data().valid
                    };
                    if (selectedItem.display === true && selectedItem.valid === true) {
                        response.push(selectedItem);
                    }
                    return (response);                
                })
                return (querySnapshot);
            });
            return res.status(200).send(response);
        } catch (error) {
            console.log(error);
            return res.status(500).send(error);
        }
        })();
  });

  app.get('/api/search', (req, res) => {
    const type = req.query.type;



    var research = req.query.research.trim();
    switch (type) {
        case 'promo':
            const year = parseInt(research, 10);
            getAllPromoStudents(year).then(studentList => {
                //return (res.status(200).send(studentList));
                return (res.render("search", {newList}));
            }).catch(error => {
                res.status(500).send(error);
            });
            break;
        case 'mail':
            getAllStudents().then(studentList => {
                studentList = searchStudentByMail(studentList, research);
                //return (res.status(200).send(newList));
                return (res.render("search", {studentList}));
            }).catch(error => {
                return (res.status(500).send(error));
            })
            break;
        case 'nom':
            getAllStudents().then(studentList => {
                studentList = searchStudentByName(studentList, research);
                return (res.render("search", {studentList}));
                //return (res.status(200).send(newList));
            }).catch(error => {
                return (res.status(500).send(error));
            })
            break;
        case 'prenom':
            getAllStudents().then(studentList => {
                studentList = searchStudentByForename(studentList, research);
                return (res.render("search", {studentList}));
                //return (res.status(200).send(newList));
            }).catch(error => {
                return (res.status(500).send(error));
            })
            break;
        case 'competences':
            getAllStudents().then(studentList => {
                studentList = searchStudentByCompetence(studentList, research);
                return (res.render("search", {studentList}));
                //return (res.status(200).send(newList));
            }).catch(error => {
                return (res.status(500).send(error));
            })
            break;
        default :
          return res.status(500).send("Error, please enter a correct type for your research.");
    }
  });

  function searchStudentByMail(studentList, research) {
    const newList = [];

    studentList.forEach(student => {
        if (student.student_mail.toLowerCase().includes(research.toLowerCase())) {
            newList.push(student);
        }
        return (studentList);
    });
    return newList;
  }

  function searchStudentByName(studentList, research) {
    const newList = [];
    studentList.forEach(student => {
        if (student.nom.toLowerCase().includes(research.toLowerCase()) === true) {
            newList.push(student);
        }
        return (studentList);
    });
    return newList;
  }

  function searchStudentByForename(studentList, research) {
    const newList = [];

    studentList.forEach(student => {
        if (student.prenom.toLowerCase().includes(research.toLowerCase())) {
            newList.push(student);
        }
        return (studentList);
    });
    return newList;
  }

  function searchStudentByCompetence(studentList, research) {
    const newList = [];

    studentList.forEach(student => {
        if (student.competences.toLowerCase().includes(research.toLowerCase())) {
            newList.push(student);
        }
        return (studentList);
    });
    return newList;
  }

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

  app.get('/api/validatecv/:mail', (req, res) => {
    (async () => {
        try {
            const document = db.collection('Utilisateurs').doc(req.params.mail);
            await document.update({
                valid: true,
            });
            return res.status(200).send("Vous venez de valider le CV de : " + req.params.mail);
        } catch (error) {
            console.log("An error happened:", error);
            return res.status(500).send(error);
        }
        })();
  })

  app.get('/api/unvalidatecv/:mail', (req, res) => {
    (async () => {
        try {
            const document = db.collection('Utilisateurs').doc(req.params.mail);
            await document.update({
                valid: false,
            });
            return res.status(200).send("Vous venez de dévalider le CV de : " + req.params.mail);
        } catch (error) {
            console.log("An error happened:", error);
            return res.status(500).send(error);
        }
        })();
  })

  app.get('/api/disablecv/:mail', (req, res) => {
    (async () => {
        try {
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
            var date = new Date();
            var expirationDate = date.getTime() + (30 * 24 * 60 * 60 * 1000);        
            const document = db.collection('Utilisateurs').doc(req.params.mail);
            await document.update({
                display: true,
                expirationDate : expirationDate
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