
const URL = "./data/";
let model, webcam, labelContainer, maxPredictions;

async function sleep(ms) {
    return new Promise((r) => setTimeout(r, ms));
}

async function init() {
    const modelURL = URL + "model.json";
    const metadataURL = URL + "metadata.json";
    model = await tmImage.load(modelURL, metadataURL);
    maxPredictions = model.getTotalClasses();


    const flip = true;
    webcam = new tmImage.Webcam(400, 400, flip);
    await webcam.setup();
    await webcam.play();
    window.requestAnimationFrame(loop);

    document.getElementById("webcam-container").appendChild(webcam.canvas);
    labelContainer = document.getElementById("teacher_list");
}

async function loop() {
    webcam.update();
    await predict();
    window.requestAnimationFrame(loop);
}


async function predict() {
    const prediction = await model.predict(webcam.canvas);
    let lookLikeResult = prediction.sort((a,b) => b.probability - a.probability)
    console.log(lookLikeResult[0].probability)

    document.getElementById(`most-looklike`).innerText = `${lookLikeResult[0].className.split("_")[0]}(${lookLikeResult[0].className.split("_")[1]}) 선생님과 가장 닮았어요! (${(lookLikeResult[0].probability*100).toFixed(2)}%)`
    for (let i = 1; i < 4; i ++) {
        document.getElementById(`teacher${i}_name`).innerText = `${lookLikeResult[i].className.split("_")[0]}(${lookLikeResult[i].className.split("_")[1]}) 선생님`
        document.getElementById(`teacher${i}_percent`).innerText = `${(lookLikeResult[i].probability*100).toFixed(2)}%`
    }

    await sleep(100)


    // for (let i = 0; i < maxPredictions; i++) {
    //     const classPrediction =
    //         prediction[i].className + ": " + prediction[i].probability.toFixed(2);
    //     labelContainer.childNodes[i].innerHTML = classPrediction;
    // }
}

init()