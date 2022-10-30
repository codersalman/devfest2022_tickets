const app = require("firebase-admin");
const {response} = require("express");

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
                var ref = db.ref("tickets");

                await ref.orderByChild("email").equalTo(email).once("value", function (snapshot) {
                    if (snapshot.exists()) {

                        snapshot.forEach(function (data) {


                                if (data.val().refid === refid) {

                                    claimTicket(req, res, email, refid, peer_profile)

                                // return
                                //     res.status(200).json({
                                //     message: "Valid Ticket",
                                //     data: data.val()
                                // })

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
      let  tktID = refid.split('1')

        return tktID[1]+'_' + Math.random().toString(36).substring(2, 7);
    }

    try{


        var db = app.database();
        var ref = db.ref("claimed_tickets");

        const check = await ref.orderByChild("status").equalTo('claimed').once("value", function (snapshot) {

            if (snapshot.exists()) {
                snapshot.forEach(function (data) {
                    if (data.val().email === email) {
                        return res.status(400).json({
                            message: "Ticket Already Claimed"
                        })
                    }
                })
            } else {
                ref.push({
                    email: email,
                    refid: refid,
                    peer_profile: peer_profile,
                    status: 'claimed',
                    ticketID: ticketId(Date.now()),

                })
                return res.status(200).json({
                    message: "Ticket Claimed Successfully",
                    data: {
                        email: email,
                        refid: refid,
                        peer_profile: peer_profile,
                        status: 'claimed',
                        timeStamp: new Date().getTime(),


                    }
                })
            }
        }

        )


    }catch (e) {
        console.log(e)
    }





}