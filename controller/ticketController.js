const app = require("firebase-admin");
const {sendEmail} = require("./mailController");

exports.validateTicket = async (req, res) => {

    const {refid , email, peer_profile} = req.body;

    if (!refid || !email || !peer_profile) {
        return res.status(400).json({
            message: "Please provide all the fields"
        })
    }else {

        if (refid && email ) {
            try {
                var db = app.database();
                var ref = db.ref("tickets_test_1");

                await ref.orderByChild("email").equalTo(email).once("value", function (snapshot) {
                    if (snapshot.exists()) {

                        snapshot.forEach(function (data) {
                            if (data.val().refid.toString() === refid) {

                                    claimTicket(req, res, email, refid, peer_profile)

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

const claimTicket = async (req, res,email,refid,peer_profile) => {

    function ticketId(a) {
      let  tktID = a.split('1')

        return tktID[1]+'_' + Math.random().toString(36).substring(2, 7);
    }

    try{

        var db = app.database();
        var ref = db.ref("claimed_tickets");


        await ref.orderByChild("email").equalTo(email).once("value", function (snapshot) {

            if (snapshot.exists()) {
                return res.status(400).json({
                    message: "Ticket Already Claimed"
                })
            } else {
                const ticket = {
                    refid: refid,
                    email: email,
                    peer_profile: peer_profile,
                    ticket_id: ticketId(refid),
                }
                ref.push(ticket)
                // sendEmail(email, ticket.ticket_id,refid)
                res.status(200).json({
                    message: "Ticket Claimed",
                    ticket: ticket
                })
            }

        })


    }catch (e) {
        console.log(e)
    }





}