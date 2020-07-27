const router = require('express').Router();

router.get('/',(req, res) =>{
    res.sendFile('views/index.html');
})

module.exports = router;
