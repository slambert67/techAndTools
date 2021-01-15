const express = require('express');
const uuid = require('uuid');
const router = express.Router();
const members = require('../../Members');

// simple REST API
// routes / endpoints

// get all members
router.get('/', (req,res) => {
    res.json(members); // takes care of stringify
});

// get single member
router.get('/:id', (req,res) => {
    //res.send(req.params.id); // id retrieved from url

    const found = members.some(member => member.id === parseInt(req.params.id));
    if (found) {
        res.json( members.filter(member => member.id === parseInt(req.params.id)) ); // status: 200
    } else {
        res.status(400).json( {msg:`No member with the id of ${req.params.id}`} );
    }

});

// create member - requires POST
router.post('/', (req,res) => {
    const newMember = {
        id: uuid.v4(),
        name: req.body.name,      // req.body elements can be from form POST
        email: req.body.email,
        status: 'active'
    }

    if (!newMember.name || !newMember.email) {
        return res.status(400).json({msg:'Please include a name and email'});
    }

    members.push(newMember);
    res.json(members);

    // if using templates
    //res.redirect('/');
});

// update member - requires PUT
router.put('/:id', (req,res) => {

    const found = members.some(member => member.id === parseInt(req.params.id));
    if (found) {
        const updMember = req.body;
        members.forEach(member => {
            if ( member.id === parseInt(req.params.id) ) {
                member.name = updMember.name ? updMember.name : member.name;
                member.email = updMember.email ? updMember.email : member.email;
                res.json({msg: 'Member updated', member: member});
            }
        });
    } else {
        res.status(400).json( {msg:`No member with the id of ${req.params.id}`} );
    }

});

// delete member
router.delete('/:id', (req,res) => {
    //res.send(req.params.id); // id retrieved from url

    const found = members.some(member => member.id === parseInt(req.params.id));
    if (found) {
        res.json(   {
                        msg: 'Member deleted',
                        members: members.filter(member => member.id !== parseInt(req.params.id))
                    } ); // status: 200
    } else {
        res.status(400).json( {msg:`No member with the id of ${req.params.id}`} );
    }

});

module.exports = router;