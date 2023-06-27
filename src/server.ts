import express from 'express';
import bodyParser from 'body-parser';
import { filterImageFromURL, deleteLocalFiles } from './util/util';
import { Request, Response } from "express";


(async () => {

  // Init the Express application
  const app = express();

  // Set the network port
  const port = process.env.PORT || 8083;

  // Use the body parser middleware for post requests
  app.use(bodyParser.json());

  app.get('/', (req, res) => {
    res.send("try GET /filteredimage?image_url={{}}");
  })

  app.get("/filteredimage", async (req: Request, res: Response) => {
    const imgPath = req.query["image_url"];
    if (imgPath) {
      const imageFiltered = await filterImageFromURL(imgPath.toString());
      if (imageFiltered) {
        res.sendFile(imageFiltered, {}, (error) => {
          if (error) {
            return res.status(500).send("Appeared error while sending file");
          }
          deleteLocalFiles([imageFiltered]);
        });
      } else {
        return res.status(500).send("Filtered image could not find MIME for Buffer <null>");
      }
    } else {
      return res.status(400).send("imgPath query is not provided");
    }
  });

  // Start the Server
  app.listen(port, () => {
    console.log(`server running http://localhost:${port}`);
    console.log(`press CTRL+C to stop server`);
  });
})();