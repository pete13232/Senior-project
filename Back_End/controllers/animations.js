const { default: mongoose } = require("mongoose");
const upload = require("../middleware/multer")
const fs = require('fs')
const path = require('path')
const { format } = require("util");
const { Storage } = require("@google-cloud/storage");
const { gzip, ungzip } = require('node-gzip');
// Instantiate a storage client with credentials
const storage = new Storage({ keyFilename: "google-cloud-key.json" });
const bucket = storage.bucket("pete-bucket-1068");
//
const Animation = require("../models/Animation");
const User = require("../models/User");
const ValidateLog = require("../models/ValidateLog");
const Word = require("../models/Word");
const { gunzip } = require("zlib");

// Get All Animation
const getAnimation = async (req, res) => {
  try {
    const foundAnimation = await Animation.find({}).populate('wordID')

    res.status(200).json({ data: foundAnimation });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Get Animation by wordID
const getAnimationByWordID = async (req, res) => {
  const { wordID } = req.query;

  try {
    let animation
    if (wordID) {
      console.log(wordID)
      animation = await Animation.find({ wordID: wordID });
    }
    res.status(200).json({ data: animation });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
}

// Get Animation by ID
const getAnimationByID = async (req, res) => {
  const { animationID } = req.params;

  try {
    const animation = await Animation.findById({ _id: animationID });
    res.status(200).json({ data: animation });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
}


// Compress original .json from GCS then upload back to GCS
const compressJsonAnimation = async (req, res) => {
  const { animationID } = req.query
  await upload.uploadLocalMiddleware(req, res)
  const { GCS_filename } = req.body
  const file = bucket.file(GCS_filename)
  const [content] = await file.download()
  try {
    const fileName = file.name
    const filePath = `C:/Users/Admin/Desktop/Pete Kmutt assign/Senior_Project/Senior_Project/Back_End/Download/${fileName}`
    fs.writeFileSync(filePath, content)
    const compressedData = await compress_animation(filePath, fileName)
    await upload_compressed_data(req, res, animationID, fileName, compressedData)
    await deleteDownloadOriginalFile(req, res, fileName)
    await removeLocalCompressFile(req, res, fileName)
    
  } catch (err) {
    res.json({ message: err.message })
  }
}

//------------------------------------Function----------------------------------------------//

const upload_compressed_data = async (req, res, animationID, fileName, compressedData) => {
  // Create a new blob in the bucket and upload the file data.
  const blob = bucket.file(Date.now() + '-' + `${fileName}.gz`);
  const blobStream = blob.createWriteStream({
    resumable: false,
  });

  blobStream.on("error", (err) => {
    res.status(500).send({ message: err.message });
  });

  blobStream.on("finish", async (data) => {
    // Create URL for directly file access via HTTP.
    const publicUrl = format(
      `https://storage.googleapis.com/${bucket.name}/${blob.name}`
    );
    const updatedAnimation = await update_animation(req, res, animationID, publicUrl)
    try {
      await updatedAnimation.save()
      res.status(201).json(updatedAnimation);
    } catch (err) {
      // res.status(400).json({ message: err.message });
      console.log({ message: err.message });
    }
  });

  blobStream.end(compressedData);
}

const compress_animation = async (filePath, fileName) => {
  // Compressing file
  const largeFile = fs.readFileSync(filePath)
  const compressedData = await gzip(largeFile)
  const compressedFileName = `${fileName}.gz`
  const compressedFilePath = `C:/Users/Admin/Desktop/Pete Kmutt assign/Senior_Project/Senior_Project/Back_End/Compressed/${compressedFileName}`
  fs.writeFileSync(compressedFilePath, compressedData)
  return compressedData
}

// Update file path (after convert .fbx to .json)
const update_animation = async (req, res, animationID, fileURL) => {
  const verifyAnimationID = mongoose.Types.ObjectId.isValid(animationID);
  if (!verifyAnimationID) {
    res.status(400).json("animationID isn't ObjectID");
  } else {
    try {
      const updatedAnimation = await Animation.findByIdAndUpdate(
        { _id: animationID },
        {
          $set: {
            file: fileURL
          }
        },
        { new: true }
      );
      if (updatedAnimation) {
        return updatedAnimation
      } else {
        // res.status(200).json("No file path edit (.fbx to .json cloud file path)");
        console.log("No file path edit (.fbx to .json cloud file path)");
      }
    } catch (err) {
      // res.status(400).json({ message: err.message });
      console.log({ message: err.message });
    }
  }
}

const deleteDownloadOriginalFile = async (req, res, filename) => {
  try {
    fs.unlink("Download/" + filename, (err => {
      if (err) console.log({ message: err.message })
      else console.log(`File ${filename} on local storage has successfully deleted`)
    }))
  } catch (err) {
    console.log({ message: err.message })
  }
}

const removeLocalCompressFile = async (req, res, filename) => {
  try {
    fs.unlink("Compressed/" + `${filename}.gz`, (err => {
      if (err) console.log({ message: err.message })
      else console.log(`Compressed file ${filename} on local storage has successfully deleted`)
    }))
  } catch (err) {
    console.log({ message: err.message })
  }
}

//------------------------------------------------------------------------------------------------------------//

// Create New Animation (.json)
const uploadCloudAnimation = async (req, res) => {
  const { animationID } = req.query
  // const verifyWordID = mongoose.Types.ObjectId.isValid(wordID);
  const animationID_exist = await Animation.countDocuments({ _id: animationID })

  if (animationID_exist > 0) {
    // 6. Upload .json file to cloud after converted from Front-End
    await upload.uploadCloudMiddleware(req, res)
    req.file.originalname = Date.now() + '-' + req.file.originalname
    if (!req.file) {
      return res.status(400).send({ message: "Please upload a file!" });
    }

    // Create a new blob in the bucket and upload the file data.
    const blob = bucket.file(req.file.originalname);

    const blobStream = blob.createWriteStream({
      resumable: false,
    });

    blobStream.on("error", (err) => {
      res.status(500).send({ message: err.message });
    });

    blobStream.on("finish", async (data) => {
      // Create URL for directly file access via HTTP.
      const publicUrl = format(
        `https://storage.googleapis.com/${bucket.name}/${blob.name}`
      );

      // 7. Updated cloud file path to db
      const updatedAnimation = await Animation.findByIdAndUpdate(
        { _id: animationID },
        {
          $set: {
            file: publicUrl
          }
        },
        { new: true }
      );

      try {
        await updatedAnimation.save()
        res.status(201).json(updatedAnimation);
      } catch (err) {
        res.status(400).json({ message: err.message });
      }
    });

    blobStream.end(req.file.buffer);

  } else {
    res.status(400).json("invalid wordID")
  }
};

// Create New Animation to local (.fbx)
// 1. Uploading original file -> save to /Uploaded folder
const uploadLocalAnimation = async (req, res) => {
  const { wordID } = req.query
  await upload.uploadLocalMiddleware(req, res)
  const largeFile = (fs.readFileSync("C:/Users/Admin/Desktop/Pete Kmutt assign/Senior_Project/Senior_Project/Back_End/Uploaded/" + req.file.filename))
  const compressedData = await gzip(largeFile)

  // 2. Compressing File -> save to /Compressed folder
  const compressedFileName = `${req.file.filename}.gz`
  const compressedFilePath = `C:/Users/Admin/Desktop/Pete Kmutt assign/Senior_Project/Senior_Project/Back_End/Compressed/${compressedFileName}`
  fs.writeFileSync(compressedFilePath, compressedData)

  // Decompressing File
  // const compressedFile = (fs.readFileSync(compressedFilePath))
  // console.log(compressedFile)
  // const decompressedFileName =  req.file.filename
  // const decompressedData = await ungzip(compressedFile)
  // const decompressedFilePath = `C:/Users/Admin/Desktop/Pete Kmutt assign/Senior_Project/Senior_Project/Back_End/Decompressed/${decompressedFileName}`
  // fs.writeFileSync(decompressedFilePath, decompressedData)

  // 3. save compress file path to db then convert to .json on Front-end
  const newAnimation = new Animation({
    wordID: wordID,
    file: `http://localhost:3333/file/compress/${compressedFileName}`
  })
  try {
    await newAnimation.save()
    res.status(201).json(newAnimation)
  }
  catch (err) {
    res.status(400).json({ message: err.message })
  }
};

// Delete local original file (.fbx)
// 4. delete local file (original file)
const deleteLocalOriginalFile = async (req, res) => {
  await upload.uploadLocalMiddleware(req, res) // เพื่อใช้ form-data ในการรับ filename จาก body เฉย ๆ ไม่ได้มีการอัพโหลดไฟล์ใหม่
  const { filename } = req.body
  try {
    fs.unlink("Uploaded/" + filename, (err => {
      if (err) res.status(400).json({ message: err.message })
      else res.status(200).json(`File ${filename} on local storage has successfully deleted`)
    }))
  } catch (err) {
    res.status(400).json({ message: err.message })
  }
}

// Delete local compressed file (.fbx)
// 5. delete local compressed file (original file)
const deleteLocalCompressFile = async (req, res) => {
  await upload.uploadLocalMiddleware(req, res) // เพื่อใช้ form-data ในการรับ filename จาก body เฉย ๆ ไม่ได้มีการอัพโหลดไฟล์ใหม่
  const { filename } = req.body
  try {
    fs.unlink("Compressed/" + filename, (err => {
      if (err) res.status(400).json({ message: err.message })
      else res.status(200).json(`Compressed file ${filename} on local storage has successfully deleted`)
    }))
  } catch (err) {
    res.status(400).json({ message: err.message })
  }
}

// Update file path (after convert .fbx to .json)
// const editAnimation = async (req, res) => {
//   const { animationID } = req.params
//   await upload.uploadLocalMiddleware(req, res) // เพื่อใช้ form-data ในการรับ fileURL จาก body เฉย ๆ ไม่ได้มีการอัพโหลดไฟล์ใหม่
//   const { fileURL } = req.body
//   const verifyAnimationID = mongoose.Types.ObjectId.isValid(animationID);
//   if (!verifyAnimationID) {
//     res.status(400).json("animationID isn't ObjectID");
//   } else {
//     try {
//       const updatedAnimation = await Animation.findByIdAndUpdate(
//         { _id: animationID },
//         {
//           $set: {
//             file: fileURL
//           }
//         },
//         { new: true }
//       );
//       if (updatedAnimation) {
//         res.status(200).json(updatedAnimation);
//       } else {
//         res.status(200).json("No file path edit (.fbx to .json cloud file path)");
//       }
//     } catch (err) {
//       res.status(400).json({ message: err.message });
//     }
//   }
// }

//
const updateValidateLog_get = (req, res) => {
  res.render('animation')
}

// Validate Animation
const updateValidateLog = async (req, res) => {
  const { animationID } = req.params;
  const userID = res.locals.user._id
  await upload.uploadLocalMiddleware(req, res)
  const { validateStat } = req.body;
  const verifyUserID = mongoose.Types.ObjectId.isValid(userID);
  const verifyAnimationID = mongoose.Types.ObjectId.isValid(animationID);

  const newValidateLog = new ValidateLog({
    animationID: animationID,
    userID: userID,
    validateStat: validateStat,
  });

  if (!(verifyUserID && verifyAnimationID)) {
    res.status(400).json("userID or animationID isn't ObjectID");
  } else {
    try {
      const validateLog = await newValidateLog.save();
      if (validateLog) {
        const count = await User.countDocuments({ _id: userID });

        if (count > 0) {
          await User.findByIdAndUpdate(
            { _id: userID },
            { $push: { validateLog: validateLog._id } }
          );
          await Animation.findByIdAndUpdate(
            { _id: animationID },
            { $set: { validateLog: validateLog._id } }
          );
          res.status(200).json(validateLog);
        } else {
          res.status(404).json("userID doesn't exist");
        }
      } else {
        res.status(400).json("Can't add validateLog to user or animation");
      }
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  }
};

// Delete Selected Animation
const deleteAnimation = async (req, res) => {
  const { animationID } = req.params;
  const verifyAnimationID = mongoose.Types.ObjectId.isValid(animationID);
  if (!verifyAnimationID) {
    res.status(400).json("animationID isn't ObjectID");
  } else {
    try {
      const deletedAnimation = await Animation.findByIdAndDelete({
        _id: animationID,
      });
      if (deletedAnimation) {
        res.status(200).json(`Animation "${deleteAnimation.word}" has been deleted`);
      } else {
        res.status(200).json("No animation deleted");
      }
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  }
};

// Get All animation validate log
const getAnimationLog = async (req, res) => {
  const { animationID } = req.params
  try {
    const animationLog = await ValidateLog.find({ animationID: animationID }).sort({ _id: -1 }).select({ animationID: 0 }).limit(1)
      .populate({
        path: "userID",
      })

    res.status(200).json({ animationLog: animationLog })
  } catch (err) {
    res.status(400).json({ message: err.message })
  }
}

module.exports = {
  getAnimation,
  uploadCloudAnimation,
  uploadLocalAnimation,
  updateValidateLog,
  deleteAnimation,
  getAnimationLog,
  getAnimationByID,
  getAnimationByWordID,
  updateValidateLog_get,
  deleteLocalOriginalFile,
  deleteLocalCompressFile,
  compressJsonAnimation
  // editAnimation
};
