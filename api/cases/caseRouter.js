const express = require('express');
const Cases = require('./caseModel');
const AWS = require('../../utils/AWS');
const Verify = require('../middleware/verifyDataID');
const router = express.Router();

// TODO add auth to route also - final phase

//middleware

router.use('/:id', Verify.verifyCase);

//routes

router.get('/', (req, res) => {
  Cases.findAll()
    .then((cases) => {
      res.status(200).json(cases);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ message: err.message });
    });
});

router.get('/:id', (req, res) => {
  const id = String(req.params.id);
  Cases.findById(id)
    .then((cases) => {
      res.status(200).json(cases);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ message: err.message });
    });
});

router.get('/:id/csv', (req, res) => {
  // * returns csv of case data
  const id = String(req.params.id);
  Cases.writeCSV(id)
    .then((cases) => {
      res.header('Content-Type', 'text/csv');
      res.attachment(`${id}_case_data.csv`);
      res.status(200).send(cases);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ message: err.message });
    });
});

router.get('/:id/view-pdf', (req, res) => {
  const id = req.params.id;
  AWS.fetch_pdf_view(id)
    .then((pdf) => {
      res.header('Content-Type', 'application/pdf');
      res.status(200).send(pdf);
    })
    .catch((err) => {
      res.status(500).json({ message: err.message });
    });
});

router.get('/:id/download-pdf', (req, res) => {
  // * returns pdf of ORIGINAL case
  const id = req.params.id;
  AWS.fetch_pdf_download(id);
  // ! file is sent in  utils/AWS
});

router.get('/:id/download-csv', (req, res) => {
  const id = req.params.id;
  Cases.writeCSV(id)
    .then((csv) => {
      res.header('Content-Type', 'text/csv');
      res.attachment(`${id}_data.csv`);
      res.status(200).send(csv);
    })
    .catch((err) => {
      res.status(500).json({ message: err.message });
    });
});

module.exports = router;
