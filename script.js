const elVideo = document.getElementById("video");

navigator.getMedia =(navigator.getUserMedia ||navigator.webkitGetUserMedia ||navigator.mozGetUserMedia);

const cargarCamara = () => {
  navigator.getMedia(
    {
      audio: false,
      video: true,
    },

    (stream) => (elVideo.srcObject = stream),
    console.error
  );
};

Promise.all([
  faceapi.nets.ssdMobilenetv1.loadFromUri("/models"),
  faceapi.nets.tinyFaceDetector.loadFromUri("/models"),
  faceapi.nets.faceLandmark68Net.loadFromUri("/models"),
  faceapi.nets.faceRecognitionNet.loadFromUri("/models"),
  faceapi.nets.faceExpressionNet.loadFromUri("/models"),
  faceapi.nets.faceLandmark68TinyNet.loadFromUri("/models"),
  faceapi.nets.ageGenderNet.loadFromUri("/models"),
]).then(cargarCamara);


elVideo.addEventListener('playing', async () =>{
    const canvas = faceapi.createCanvasFromMedia(elVideo)
    document.body.append(canvas)

    const displaySize = {width: elVideo.width, height: elVideo.height}
    faceapi.matchDimensions(canvas, displaySize)

    setInterval(async () => {
      const detections = await faceapi.detectAllFaces(elVideo)
        .withFaceLandmarks()
        .withFaceExpressions()
        .withAgeAndGender()
        .withFaceDescriptors()

      const resizeDetections = faceapi.resizeResults(detections, displaySize);

      canvas.getContext('2d').clearRect(0,0, canvas.width, canvas.height);

      faceapi.draw.drawDetections(canvas, resizeDetections);
      faceapi.draw.drawFaceLandMarks(canvas, resizeDetections);
      faceapi.draw.drawFaceExpressions(canvas, resizeDetections);
    });
})