var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

const ctrlInst = require('../app_api/controller/institution')
const ctrlAuth = require('../app_api/controller/auth')


router.post('/institution', ctrlInst.add_institutions)
router.get('/institution_list', ctrlInst.institution_list)
router.get('/read_one_institution/:institutionId', ctrlInst.read_one_institution)
router.put('/update_institution/:institutionId', ctrlInst.update_institution)
router.get('/')

// Auth
router.post('/register', ctrlAuth.register_user)
router.post('/login', ctrlAuth.login)
//router.get('/')


module.exports = router;
