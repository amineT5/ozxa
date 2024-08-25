const express = require('express');
const bodyParser = require('body-parser');
const AWS = require('aws-sdk');

const app = express();
app.use(bodyParser.json());

// Configure AWS S3
const s3 = new AWS.S3({
  accessKeyId: 'YOUR_ACCESS_KEY_ID',
  secretAccessKey: 'YOUR_SECRET_ACCESS_KEY',
  region: 'YOUR_REGION'
});

const BUCKET_NAME = 'YOUR_BUCKET_NAME';
const FILE_KEY = 'patients.json';

// Get all patients
app.get('/api/patients', async (req, res) => {
  try {
    const data = await s3.getObject({ Bucket: BUCKET_NAME, Key: FILE_KEY }).promise();
    const patients = JSON.parse(data.Body.toString());
    res.json(patients);
  } catch (error) {
    res.status(500).send('Error retrieving data');
  }
});

// Delete a patient by ID
app.delete('/api/patients/:id', async (req, res) => {
  const patientId = req.params.id;
  try {
    const data = await s3.getObject({ Bucket: BUCKET_NAME, Key: FILE_KEY }).promise();
    const patients = JSON.parse(data.Body.toString());
    const updatedPatients = patients.filter(patient => patient.patientId !== patientId);
    
    await s3.putObject({
      Bucket: BUCKET_NAME,
      Key: FILE_KEY,
      Body: JSON.stringify(updatedPatients)
    }).promise();

    res.status(204).send(); // No content to send back
  } catch (error) {
    res.status(500).send('Error deleting data');
  }
});

const PORT = 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

const cors = require('cors');
app.use(cors());
