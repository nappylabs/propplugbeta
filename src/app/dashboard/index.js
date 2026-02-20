const functions = require("firebase-functions");
const admin = require("firebase-admin");
const nodemailer = require("nodemailer");
admin.initializeApp();
 
// Email Transporter
// Use `functions.config().nodemailer` to access the environment variables
// you set with `firebase functions:config:set`.
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: { user: functions.config().nodemailer.user, pass: functions.config().nodemailer.pass }
});

exports.requestSnapshotPermission = functions.https.onCall(async (data, context) => {
  const { snapshotId, requesterEmail, ownerUid } = data;
  
  // 1. Get Owner Profile
  const ownerDoc = await admin.firestore().collection("users").doc(ownerUid).get();
  const ownerEmail = ownerDoc.data().email;

  // 2. Log Request in Firestore
  await admin.firestore().collection("sharedSnapshots").doc(snapshotId).update({
    pendingRequests: admin.firestore.FieldValue.arrayUnion({
      email: requesterEmail,
      timestamp: admin.firestore.Timestamp.now()
    })
  });

  // 3. Send Email to Owner
  const mailOptions = {
    from: 'PropPlug <noreply@propplug.co.za>',
    to: ownerEmail,
    subject: 'New Permission Request: PropPlug Snapshot',
    text: `User ${requesterEmail} has requested permission to clone your property snapshot. Log in to your dashboard to approve.`
  };

  return transporter.sendMail(mailOptions);
});