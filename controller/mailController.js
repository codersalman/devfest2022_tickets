// const formData = require('form-data');
// const Mailgun = require('mailgun.js');
// const mailgun = new Mailgun(formData);
// const mg = mailgun.client({username: 'api', key: '' || ''});
//
//
// exports.sendEmail = async (email,ticketid,refid,name) => {
//
//
//     // const mailgunData = {
//     //     from: 'Salman from Scattr <salman@scattr.io>',
//     //     to: `${email}`,
//     //     subject: `Hey ${name}, Subject`,
//     //     template: 'waitlist_invite',
//     //     'h:Reply-To': 'hello@scattr.io',
//     //     'h:X-Mailgun-Variables': JSON.stringify({ // be sure to stringify your payload
//     //         name,
//     //     }),
//     // };
//
//     try {
//         const resdata = await mg.messages.create('mailg.scattr.io', mailgunData);
//         response(res, true, "email sent", resdata, 200);
//         console.log(resdata);
//
//     } catch (error) {
//         response(res, false, "Error sending email", error, 400);
//         console.log(error);
//     }
//
//
// }