const { Complaint } = require('../models/complaint')
const nodemailer = require('nodemailer');

/**
 * @route GET /staff/dashboard
 * @description View Staff Dashboard
 * @type RequestHandler
 */


const verifie = 
  [
    {"JZRM5981": "mohatadhruv@gmail.com"},
    {"JZRM5982":"dhirajmohata86@gmial.com"},
    {"JZRM5983": "mohatadhruv@gmail.com"},
    {"JZRM5984" : "mohatadhruv@gmail.com"},
    {"JZRM5985": "mohatadhruv@gmail.com"},
    {"JZRM5986":"dhirajmohata86@gmial.com"},
    {"JZRM5987": "mohatadhruv@gmail.com"},
    {"JZRM5988":"dhirajmohata86@gmial.com"},
    {"JZRM5989": "mohatadhruv@gmail.com"},
    {"JZRM5990":"dhirajmohata86@gmial.com"}
  ];


  const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: 'turbogeek641@gmail.com',
        pass: 'vcle vjly tzln yznv'
    }
});


exports.staffDashboard = async (req, res) => {
  try {
    const complaints = await Complaint.find({ forwardTo: req.user._id })
    res.render('staff/dashboard.ejs', {
      staff: req.user,
      complaints
    })
  } catch (err) {
    console.log(err)
  }
}

/**
 * @route GET /staff/complaints
 * @description View Complaints from Staff Page
 * @type RequestHandler
 */
exports.viewComplaints = async (req, res) => {
  try {
    const complaints = await Complaint.find({ forwardTo: req.user._id })

    if (req.session.role === 'staff') {
      return res.render('staff/complaints.ejs', {
        staff: req.user,
        complaints
      })
    }
  } catch (err) {
    console.log(err)
  }
}

/**
 * @route POST /complaints/feedback
 * @description Post feedback to complaints by Staff
 * @type RequestHandler
 */
exports.complaintFeedback = async (req, res) => {
  try {
    await Complaint.updateOne(
      { _id: req.body.complaintId },
      { $set: { feedback: req.body.feedback, status: 'done' } }
    )

    const complaints = await Complaint.find({ _id: req.body.complaintId})


    var ml;
    console.log(complaints.citizenship);
    for (const obj of verifie) 
    {
      for (const key in obj) {
        if (key === complaints.citizenship) {
          ml = obj[key];
          break;
        }
      }       
    }

    const mailOptions = {
      from: 'turbogeek641@gmail.com',
      to: ml,
      subject: 'Hello, you have sussesfully submited your complain',
      text: req.body.feedback
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
          console.log('Error sending email: ' + error);
      } else {
          console.log('Email sent: ' + info.response);
      }
  });

    await req.flash('success_msg', 'Complaint replied successfully')
    res.redirect('/staff/dashboard')
  } catch (err) {
    console.log(err)
  }
}
