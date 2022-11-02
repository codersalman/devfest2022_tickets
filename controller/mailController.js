const formData = require('form-data');
const Mailgun = require('mailgun.js');
const mailgun = new Mailgun(formData);
const mg = mailgun.client({username: 'api', key: process.env.MAILGUN_API || process.env.MAILGUN_KEY});

exports.sendEmail = async (req,res,name,tktid,email) => {

    const mailgunData = {
        from: 'DevFest Nagpur 2022 <support@devfestnagpur.in>',
        to: `${email}`,
        subject: `Hey ${name}, You got the ALL ACCESS PASS 🚀
`,
        template: 'ticket_1',
        'h:Reply-To': 'support@devfestnagpur.in',
        'h:X-Mailgun-Variables': JSON.stringify({
            ticket_id: tktid,
            name: name,
qr_data : `https://api.qrserver.com/v1/create-qr-code/?size=1000x1000&data=Hey this is DevFest Nagpur 2022 ALL ACCESS PASS for ${name}, / ticket id: ${tktid}  /`
        }),

    };

    try {
        const resdata = await mg.messages.create('mail.devfestnagpur.in', mailgunData);
        console.log(resdata);

    } catch (error) {
        res.send(error);
        console.log(error);
    }

}