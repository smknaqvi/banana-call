const express = require("express");
const { DrawFaceLandmarksOptions } = require("face-api.js/build/commonjs/draw");
const router = express.Router();
const faceapi = require("face-api.js");
const canvas = require("canvas");
const { request } = require("express");
const faceDetectionNet = faceapi.nets.ssdMobilenetv1;
var userExpressions = {};

router.route("/expression").post(async (request, response) => {
  await faceapi.nets.tinyFaceDetector.loadFromDisk("weights");
  await faceapi.nets.faceLandmark68Net.loadFromDisk("weights");
  await faceDetectionNet.loadFromDisk("weights");
  await faceapi.nets.faceExpressionNet.loadFromDisk("weights");
  const image = new canvas.Image();
  image.src = request.body.imageData;

  const detectionsWithExpressions = await faceapi
    .detectAllFaces(image, new faceapi.TinyFaceDetectorOptions())
    .withFaceLandmarks()
    .withFaceExpressions();

  if (detectionsWithExpressions.length > 0) {
    // 009 - walk through all faces detected
    detectionsWithExpressions.forEach((element) => {
      /**
       * 010 - each face element has a expressions attribute
       * for example:
       * neutral: 0.33032259345054626
       * happy: 0.0004914478631690145
       * sad: 0.6230283975601196
       * angry: 0.042668383568525314
       * fearful: 0.000010881130037887488
       * disgusted: 0.003466457361355424
       * surprised: 0.000011861078746733256
       */
      let status = "";
      let valueStatus = 0.0;
      for (const [key, value] of Object.entries(element.expressions)) {
        if (value > valueStatus) {
          status = key;
          valueStatus = value;
        }
      }
      // 011 - once we have the highest scored expression (status) we display the right Emoji
      userExpressions[request.body.sid] = status;
      console.log(userExpressions);
    });
  }
  return response.status(200).send(userExpressions);
});
module.exports = router;
