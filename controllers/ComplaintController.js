const _ = require('lodash')
const nodemailer = require('nodemailer');

const { Complaint, validateComplaint } = require('../models/complaint')

/**
 * @route POST /complaints/add
 * @description add complaint by user
 * @type RequestHandler
 */
const verifie = 
  [
    {"JZRM5981": "mohatadhruv@gmail.com"},
    {"JZRM5982":"dhirajmohata86@gmial.com"},
    {"JZRM5983": "ridhamk.j@gmail.com"},
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




exports.addComplaint = async (req, res) => {
  const { citizenship, description } = req.body
  const { error } = validateComplaint(req.body)

  

  var flag = 0;
  var ml;
  for (const obj of verifie) 
  {
    for (const key in obj) {
      if (key === citizenship) {
        flag = 1;
        ml = obj[key];
        break;
      }
    }       
  }

 

  if(flag === 0)
  {
    await req.flash(
      'error',
      'You are not a valid user please register first'
    )

    res.redirect('/')
  }
  else {
    if (error) {
      res.render('index.ejs', {
        errors: error.details[0].message,
        citizenship,
        description
      })
    }

    try {
      const complaint = new Complaint(
        _.pick(req.body, ['citizenship', 'category', 'description'])
      )
      const newComplaint = await complaint.save()

      const mailOptions = {
        from: 'turbogeek641@gmail.com',
        to: ml,
        subject: 'Hello, you have sussesfully submited your complain',
        text: `Complaint sent succesfully ! Copy the Reference ID below: ${newComplaint._id}`
      };

      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log('Error sending email: ' + error);
        } else {
            console.log('Email sent: ' + info.response);
        }
    });

      await req.flash(
        'success_msg',
        `Complaint sent succesfully ! Copy the Reference ID below: ${newComplaint._id}`
      )

      res.redirect('/')
    } catch (err) {
      console.log(err)
    }
  }
}
