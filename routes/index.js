var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

const ctrlInst = require('../app_api/controller/institution')


router.post('/institution', ctrlInst.add_institutions)
router.get('/institution_list', ctrlInst.institution_list)
router.get('/read_one_institution/:institutionId', ctrlInst.read_one_institution)
router.put('/update_insititution/:institutionId', ctrlInst.update_insititution)


module.exports = router;
