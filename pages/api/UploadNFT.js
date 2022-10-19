// Next.js API route support: https://nextjs.org/docs/api-routes/introduction



var aws = require("aws-sdk");
var multer = require("multer");
var multerS3 = require("multer-s3");

aws.config.update({
  secretAccessKey: "d1Ab4otzvfhcF4ueVgFyBj9u96ubrNSDnK+ws2/W",
  accessKeyId: "AKIA2FZYRLEOEJKAH3ET",
  bucket: "nft-vishal-0987",
  region: "us-east-1",
});

const s3 = new aws.S3();

const upload = multer({
  storage: multerS3({
    s3: s3,
    bucket: "nft-vishal-0987",
    acl: "public-read",
    metadata: function (req, file, cb) {
      cb(null, { fieldName: file.fieldname });
    },
    key: function (req, file, cb) {
      cb(null, Date.now().toString());
    },
  }),
});

const singleUpload = upload.single("image");

export default function UploadNFT(req, res) {
  console.log("FILE", req);
  singleUpload(req, res, function (err, some) {
    console.log("res", res.body);
    console.log("some", some);
    if (err) {
      return res.status(422).send({
        errors: [{ title: "Image Upload Error", detail: err.message }],
      });
    }
    return res.json({ imageUrl: "req.file.location" });
  });
};
