import express from "express";
import ffmpeg from "fluent-ffmpeg";
// ffmpeg.setFfmpegPath("/usr/bin/ffmpeg"); // This is the path in most Ubuntu/WSL setups

const app = express()
app.use(express.json());


app.post("/process-video", (req,res) => { //http post endpoint
    //get path of input video file from the req body
    const inputFilePath = req.body.inputFilePath;
    const outputFilePath = req.body.outputFilePath;

    if(!inputFilePath || !outputFilePath){
        res.status(400).send("Bad Request: Missing file path.");
    }

    ffmpeg(inputFilePath)
        .outputOptions('-vf', "scale=-1:360") //360p
        .on("end", ()=> {
            res.status(200).send("Processing finished successfully.")
        })
        .on("error", (err) =>{
            console.log(`An error occured: ${err.message}`);
            res.status(500).send(`Internal Server Error: ${err.message}`)
        })
        .save(outputFilePath);
    
});

const port = process.env.PORT || 3000;
app.listen(port, () =>{
    console.log(`Video processing service listening at http://localhost:${port}`)
});