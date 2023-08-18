require('dotenv').config();
const SENDGRID_API_KEY = process.env.SENDGRID_KEY

// The Cloud Functions for Firebase SDK to create Cloud Functions and set up triggers.
const functions = require('firebase-functions');

// The Firebase Admin SDK to access Firestore.
const admin = require('firebase-admin');
admin.initializeApp();

const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(SENDGRID_API_KEY);

const fs = require("fs");

const pathToFlu = `${__dirname}/Flu.pdf`;
const fluAttachment = fs.readFileSync(pathToFlu).toString("base64");

const pathToRsv = `${__dirname}/RSV.pdf`;
const rsvAttachment = fs.readFileSync(pathToRsv).toString("base64");

const pathToStrep = `${__dirname}/Strep.pdf`;
const strepAttachment = fs.readFileSync(pathToStrep).toString("base64");

let attachment = "";


// wait for tests to be updated
try {
    exports.sendEmailNotification=functions.firestore.document('tests/{result}')
        .onUpdate(async(change: { after: { data: () => any; }; }, context: any)=>{
            const data=change.after.data();
            console.log("full data: ",data);
            console.log("just status: ",data.status)
            // check if status is closed
            try{
                if(data.status === "Closed"){
                    //get patient name and email
                    console.log("in if statement, status is closed")
                    console.log("this is the patient id: ", data.patient_id)
                    const patientId = data.patient_id;

                    let patientDocRef = null
                    try{
                        patientDocRef = admin.firestore().collection("patients").doc(patientId.trim());
                    } catch(error){
                        console.error(`Issue with getting patient data from database: ${error}`)
                    }
                    
                    let patientDoc = null
                    try{
                        patientDoc = await patientDocRef.get();
                    } catch(error) {
                        console.error(`Issue with getting patient fields from data: ${error}`)
                    }
                    
                    const patientDocData = patientDoc.data();
                    // const patientEmail = patientDocData.email;
                    const patientFirstName = patientDocData.first_name;
                    const patientLastName = patientDocData.last_name;
                    const userId = patientDocData.user_id;
                    console.log("this is the full patient info: ", patientDocData)
                    // console.log("this is the patient email: ", patientEmail);
                    console.log("this is the patient name: ", patientFirstName, patientLastName)

                    //get email from user
                    let userDocRef = null
                    try{
                        userDocRef = admin.firestore().collection("users").doc(userId.trim());
                    } catch(error){
                        console.error(`Issue with getting user data from database: ${error}`)
                    }
                    
                    let userDoc = null
                    try{
                        userDoc = await userDocRef.get();
                    } catch(error) {
                        console.error(`Issue with getting user fields from data: ${error}`)
                    }

                    const userDocData = userDoc.data();
                    console.log("this is user data: ", userDocData)
                    const patientEmail = userDocData.email;
                    console.log("this is the patient email: ", patientEmail)

                    //check service type
                    const serviceId = data.service_id

                    let serviceDocRef = null
                    try{
                        serviceDocRef = admin.firestore().collection("services").doc(serviceId.trim());
                    } catch(error){
                        console.error(`Issue with getting service data from database: ${error}`)
                    }

                    let serviceDoc = null
                    try{
                        serviceDoc = await serviceDocRef.get();
                    } catch(error) {
                        console.error(`Issue with getting service fields from data: ${error}`)
                    }

                    const serviceDocData = serviceDoc.data();
                    console.log("service data: ", serviceDocData)

                    let displayName = null
                    try{
                        displayName = serviceDocData.display_name;
                    } catch(error) {
                        console.error(`Issue with getting service display_name: ${error}`)
                    }
                    

                    //set attachment
                    try{
                        if (displayName === 'RSV') {
                            attachment = rsvAttachment;
                        } else if (displayName === 'Flu') {
                            attachment = fluAttachment;
                        } else if (displayName === 'Strep') {
                            attachment = strepAttachment;
                        } else {
                            
                        }
                    } catch(error) {
                        console.error(`Issue with setting pdf attachment: ${error}`)
                    }


                    //send email
                    const msg = {
                        to: patientEmail,
                        from: 'Results@testandgo.com',
                        //subject text and html part of dynamic template
                        // subject: 'Test email from Firebase Cloud Function',
                        // text: 'Hello from Firebase!',
                        // html: '<p>Hello from Firebase!</p>',
                        templateId: "d-9c5cb5ef27f542f3b260df6cb609968a",
                        dynamic_template_data: {
                            name: `${patientFirstName} ${patientLastName}`
                        },
                        attachments: [
                        {
                            content: attachment,
                            filename: "test_information.pdf",
                            type: "application/pdf",
                            disposition: "attachment"
                        }
                        ]
                    };

                    sgMail.send(msg)
                        .then(() => console.log('Email sent'))
                        .catch((error: any) => console.error(`Issue with sending email: ${error}`));
                } else {
                    console.log("test not ready")
                }
            } catch (error) {
                console.log(`Error occured when checking status: ${error}`)
            }
    });
} catch(error){
    console.log(`Error occured when getting test updates: ${error}`)
}
