// --> /api/members
const express = require('express');
const uuid = require('uuid');
const fs = require('fs');
const path = require('path');
const members = require('../../Members');
const router = express.Router();


//Gets all members
router.get('/', (req, res) => {
    res.json(members)
});

//Get a single member
router.get('/:id', (req, res) => {
    const _id = req.params.id;
    const singleMember = members.find(member => member.id == _id);
    if (singleMember) {
        res.json(singleMember)
    } else {
        res.status(404);
        res.json({
            error: `There is no member with the id of ${_id} `
        })
    }
});

//Create a member and save it to members.json
router.post('/', (req, res) => {
    const newMember = {
        id: uuid.v4(),
        name: req.body.name,
        email: req.body.email,
        status: 'active'
    }
    if (!newMember.name || !newMember.email) {
        return res.status(400).json({
            error: `Bad request. Please provide both name and email.`
        })
    }
    fs.readFile(path.join(__dirname, '../../members.json'), 'utf-8', (err, content) => {
        const membersArr = JSON.parse(content)
        membersArr.push(newMember)
        writingDB(membersArr);
        //res.json(membersArr)
        res.render('success');
    });
});

//Update a member and apply changes on member.json
router.put('/:id', (req, res) => {
    const _id = req.params.id;
    const memberToUpdate = members.find(member => member.id == _id);
    const indexOfMemberToUpdate = members.indexOf(memberToUpdate);
    if (memberToUpdate) {
        memberToUpdate.name = req.body.name ? req.body.name : memberToUpdate.name;
        memberToUpdate.email = req.body.email ? req.body.email : memberToUpdate.email;
        //Apply update on member.json
        fs.readFile(path.join(__dirname, '../../members.json'), 'utf-8', (err, content) => {
            const membersArr = JSON.parse(content)
            membersArr.splice(indexOfMemberToUpdate, 1, memberToUpdate);
            writingDB(membersArr);
            console.log('Member was added')
            res.json(memberToUpdate)
        });
    } else {
        res.status(404);
        res.json({
            error: `There is no member with the id of ${_id} `
        });
    }
});

//Delete a member
router.delete('/:id', (req, res) => {
    const _id = req.params.id;
    const memberToDelete = members.find(member => member.id == _id);
    const indexOfMemberToDelete = members.indexOf(memberToDelete);
    if (memberToDelete) {
        fs.readFile(path.join(__dirname, '../../members.json'), 'utf-8', (err, content) => {
            const membersArr = JSON.parse(content)
            membersArr.splice(indexOfMemberToDelete, 1);
            console.log(membersArr)
            writingDB(membersArr);
            console.log('Member was deleted')
        });
        res.json({
            deletedMember: memberToDelete
        })
    } else {
        res.status(404);
        res.json({
            error: `There is no member with the id of ${_id} `
        })
    }
})

const writingDB = (membersArr) => {
    fs.writeFile(path.join(__dirname, '../../members.json'), JSON.stringify(membersArr), (err) => {
        if (err) {
            console.log(err)
        }
    })
}

module.exports = router;