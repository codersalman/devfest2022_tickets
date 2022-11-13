const app = require("firebase-admin");
const {sendEmail} = require("./mailController");
const {database} = require("firebase-admin");




exports.validateTicket = async (req, res) => {

    const { email, peer_profile } = req.body;


    if (  !email || !peer_profile || !peer_profile.startsWith("https://peerlist.io/")) {
        return res.status(400).json({
            message: "Please provide all the fields"
        })
    }else {

        if (email ) {
            try {
                var db = app.database();
                var ref = db.ref("tickets_test_1");
                var tktref = db.ref("claimed_tickets");

                let numt = await tktref.get().then( (snapshot) => {

                    return  snapshot.numChildren()

                })


                await ref.orderByChild("email").equalTo(email).once("value", function (snapshot) {


                    if (snapshot.exists()) {

                        snapshot.forEach(function (data) {


                            if (data.val().email === email) {


                                let name = data.val().name

                                claimTicket(req, res, email, peer_profile, name,numt)

                            } else {
                                return res.status(400).json({
                                    message: "Invalid Ticket"
                                })
                            }
                        });

                    } else {
                        res.status(404).json({

                            message: "Ticket Not Found"
                        })
                    }
                })

            } catch (e) {
                console.log(e)
            }
        }
    }

}
exports.validateCert = async (req, res) => {

    const { email, id } = req.body;

        if (email ) {
            try {
                var db = app.database();
                var ref = db.ref("tickets_test_1");
                var tktref = db.ref("claimed_certs");

                let numt = await tktref.get().then( (snapshot) => {

                    return  snapshot.numChildren()

                })


                await ref.orderByChild("email").equalTo(email).once("value", function (snapshot) {


                    if (snapshot.exists()) {

                        snapshot.forEach(function (data) {


                            if (data.val().email === email) {


                                let name = data.val().name

                                claimCert(req, res, email,id,name)

                            } else {
                                return res.status(400).json({
                                    message: "Invalid Ticket"
                                })
                            }
                        });

                    } else {
                        res.status(404).json({

                            message: "Ticket Not Found"
                        })
                    }
                })

            } catch (e) {
                console.log(e)
            }
        }


}

const claimCert = async (req, res,email,id,peer_name) => {

    try{

        var db = app.database();
        var ref = db.ref("claimed_certs");


        await ref.orderByChild("email").equalTo(email).once("value", function (snapshot) {


            if (snapshot.exists()) {

                return res.status(201).json({
                    message: "Certificate Already Claimed",
                    cert: snapshot.val()
                })
            } else {
                const ticket = {
                    name: peer_name,
                    email: email,
                    ticket_id: id,
                }
                ref.push(ticket)
                // sendEmail(req, res, peer_name, ticket.ticket_id, email)
                console.log('mail sent')
                res.status(200).json({
                    message: "Cert Claimed",
                    // email_status: "Email Sent",
                    cert: ticket
                })
            }

        })


    }catch (e) {
        console.log(e)
    }





}
const claimTicket = async (req, res,email,peer_profile, peer_name,numt) => {

    function ticketId() {


        console.log(numt)
        return 'DFN'+numt
    }

    try{

        var db = app.database();
        var ref = db.ref("claimed_tickets");


        await ref.orderByChild("email").equalTo(email).once("value", function (snapshot) {


            if (snapshot.exists()) {

                return res.status(201).json({
                    message: "Ticket Already Claimed",
                    ticket: snapshot.val()
                })
            } else {
                const ticket = {
                    name: peer_name,
                    email: email,
                    peer_profile: peer_profile,
                    ticket_id: ticketId(),
                }
                ref.push(ticket)
                sendEmail(req, res, peer_name, ticket.ticket_id, email)
                console.log('mail sent')
                res.status(200).json({
                    message: "Ticket Claimed",
                    email_status: "Email Sent",
                    ticket: ticket
                })
            }

        })


    }catch (e) {
        console.log(e)
    }





}

exports.getClaimedTickets = async (req, res) => {

    try {
        const db = app.database();

        var ref = db.ref("claimed_tickets");

        await ref.once("value", function (snapshot) {

            if (snapshot.exists()) {

                return res.status(200).json({
                    message: "Tickets Found",
                    tickets: snapshot.val()
                })
            } else {
                res.status(404).json({
                    message: "No Tickets Found"
                })
            }
        })

    } catch (e) {
        console.log(e)
    }
}

exports.counterValidation = async (req,res) =>{

    let id =  req.body.id

    try {

        const db = app.database();

        const ref = db.ref("claimed_tickets");
        const claimRef = db.ref("counter_claim");



        await ref.orderByChild("ticket_id").equalTo(id).once("value", async function (snapshot) {


            console.log(snapshot.val())
            const newD = snapshot.val();

            await claimRef.update(newD)

            res.send(
                snapshot.val()
            )


        });

    }catch (e){


        console.log('Error :'+e)

    }
}

