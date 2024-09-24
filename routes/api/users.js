const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const keys = require("../../config/keys");
const validateRegisterInput = require("../../validation/register");
const validateLoginInput = require("../../validation/login");
const validateUpdateUserInput = require("../../validation/updateUser");
const User = require("../../models/Users");
const Loans = require("../../models/Loans");
const TijarahLoans = require("../../models/TijarahLoans");

// import mogoClient from mongoose;
const mogoClient = require("mongoose");

const dotenv = require("dotenv");
dotenv.config();
const nodemailer = require("nodemailer");
const Slab = require("../../models/Slab");
const { toNumber, toInteger } = require("lodash");
let otpEmail;

router.post("/register", (req, res) => {
  try {
    console.log(req.body);
    const {
      email,
      password,
      phone_no,
      name,
      fatherName,
      motherName,
      cnic,
      address,
      accountType,
    } = req.body;
    if (!email || !password) {
      return res.status(400).json({
        error: "You must provide email and password",
      });
    }
    // check if user already exists
    User.findOne({ email }, (err, user) => {
      if (user) {
        return res.status(400).json({
          error: "User already exists",
        });
      }

      // encrypt password
      bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(password, salt, (err, hash) => {
          if (err) throw err;
          // create a new user
          const newUser = new User({
            email,
            password: hash,
            phone_no,
            name,
            fatherName,
            motherName,
            cnic,
            address,
            accountType,
          });
          newUser
            .save()
            .then((user) => {
              return res.status(200).json({
                user,
                message: "User Register successfully",
              });
            })
            .catch((err) => console.log(err));
        });
      });
    });
  } catch (err) {
    console.log(err);
  }
});

router.post("/user", (req, res) => {
  try {
    const body = req.body;
    let id = body.id;

    User.findById(id).then((user) => {
      if (user) {
        return res.status(200).send(user);
      } else {
        return res.status(400).json({
          error: "User not found",
        });
      }
    });
  } catch (err) {
    console.log(err);
  }
});

router.post("/login", (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({
        error: "You must provide email and password",
      });
    }
    console.log(email);
    User.findOne({ email }, (err, user) => {
      if (!user) {
        return res.status(400).json({
          error: "User with this emial not Register",
        });
      }
      bcrypt.compare(password, user.password, (err, isMatch) => {
        if (isMatch) {
          const payload = {
            user: user,
          };
          jwt.sign(
            payload,
            keys.secretOrKey,
            { expiresIn: 3600 },
            (err, token) => {
              res.json({
                success: true,
                token: token,
                user: user,
              });
            }
          );
        } else {
          return res.status(400).json({
            error: "Password incorrect",
          });
        }
      });
    });
  } catch (err) {
    console.log(err);
  }
});

router.post("/for-get-password", async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        error: "You must provide email",
      });
    }
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({
        error: "User with this emial not Register",
      });
    }
    console.log(user);

    const token = jwt.sign({ id: user._id }, keys.secretOrKey, {
      expiresIn: "1d",
    });
    console.log(token);
    var transporter = nodemailer.createTransport({
      service: "gmail",
      host: "smtp.gmail.com",
      port: 587,
      secure: false, // Use `
      auth: {
        user: "kashan.tech.io@gmail.com",
        pass: "bgdt ovkf jwpy wuxv",
      },
    });

    var mailOptions = {
      from: {
        name: "Fintech App",
        address: "kashan.tech.io@gmail.com",
      },
      to: email,
      subject: "Reset Your Password",
      text: `http://localhost:3000/updatePassword/${user._id}/${token}`,
    };

    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log(error);
      } else {
        return res.status(200).json({
          success:true,
          msg: "Email send Check Mail box",
        });
      }
    });
  } catch (err) {
    console.log(err);
  }
});

router.post("/reset-password/:id/:token", async (req, res) => {
  const { id, token } = req.params;
  const { password } = req.body;

  if (!token || !id || !password) {
    return res.status(200).json({ msg: "Invalid request parameters" });
  }

  try {
    const decoded = jwt.verify(token, keys.secretOrKey);

    // if (decoded?.id !== id) {
    //   return res.status(200).json({ msg: "Invalid token" });
    // }

    const user = await User.findById(id);

    if (!user) {
      return res.status(200).json({ msg: "User not found" });
    }

    const hash = await bcrypt.hash(password, 10);

    user.password = hash;
    await user.save();

    res.status(200).json({  success:true ,msg: "Password updated successfully" });
  } catch (error) {
    console.error("Error during password reset:", error.message);

    if (error.name === "JsonWebTokenError") {
      return res.status(401).json({ msg: "Invalid token" });
    }

    res.status(500).json({ msg: "Something went wrong" });
  }
});

router.post("/myloans", (req, res) => {
  try {
    const body = req.body;
    let id = body.id;
    let loans = [];

    Loans.find({ userid: id }).then((loans) => {
      if (loans) {
        return res.status(200).send(loans);
      } else {
        return res.status(400).json({
          error: "User not found",
        });
      }
    });
  } catch (err) {
    console.log(err);
  }
});

//create post api for allslabs by bankid
router.post("/allslabs", (req, res) => {
  try {
    const bankid = req.body.bankid;
    Slab.find({ bankid }).then((slabs) => {
      if (slabs) {
        return res.status(200).send(slabs);
      } else {
        return res.status(400).json({
          error: "No Slab not found",
        });
      }
    });
  } catch (err) {
    console.log(err);
  }
});

// create a get api that returns all users
router.get("/costumers", (req, res) => {
  try {
    User.find().then((users) => {
      if (users) {
        return res.status(200).json({
          users: users,
          success: true,
          message: "Users fetched successfully",
        });
      } else {
        return res.status(400).json({
          error: "No users found",
        });
      }
    });
  } catch (err) {
    console.log(err);
  }
});
// how to change base url to /api/us
// create a get request to get a user by id from params
router.get("/admin/userListLoan/:id", (req, res) => {
  try {
    const id = req.params.id;
    User.findById(id).then((user) => {
      if (user) {
        return res.status(200).send(user);
      } else {
        return res.status(400).json({
          error: "User not found",
        });
      }
    });
  } catch (err) {
    console.log(err);
  }
});

// router.route("/user/register").post(userController.upload.fields([{
//     name: 'scannedcnic', maxCount: 1
//   }, {
//     name: 'certificate', maxCount: 1
//   }]), userController.register);

const path = require("path");
const multer = require("multer");
// const { route } = require("next/dist/server/router");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    if (file.fieldname === "goodsImage") {
      cb(null, "public/uploads");
    } else if (file.fieldname === "invocieImage") {
      cb(null, "public/uploads");
    }
  },
  filename: (req, file, cb) => {
    if (file.fieldname === "goodsImage") {
      cb(null, file.fieldname + Date.now() + path.extname(file.originalname));
    } else if (file.fieldname === "invocieImage") {
      cb(null, file.fieldname + Date.now() + path.extname(file.originalname));
    }
  },
});

upload = multer({
  storage: storage,
  limits: {
    fileSize: 1024 * 1024 * 10,
  },
  fileFilter: (req, file, cb) => {
    checkFileType(file, cb);
  },
});

function checkFileType(file, cb) {
  if (file.fieldname === "goodsImage") {
    if (
      file.mimetype === "image/png" ||
      file.mimetype === "image/jpg" ||
      file.mimetype === "image/jpeg"
    ) {
      // check file type to be png, jpeg, or jpg
      cb(null, true);
    } else {
      cb(null, false); // else fails
    }
  } else if (file.fieldname === "invocieImage") {
    if (
      file.mimetype === "image/png" ||
      file.mimetype === "image/jpg" ||
      file.mimetype === "image/jpeg"
    ) {
      // check file type to be png, jpeg, or jpg
      cb(null, true);
    } else {
      cb(null, false); // else fails
    }
  }
}
// create a post api that save a loan to the database
router.post(
  "/upload-loans",
  upload.fields([
    {
      name: "goodsImage",
      maxCount: 1,
    },
    {
      name: "invocieImage",
      maxCount: 1,
    },
  ]),
  (req, res) => {
    let goodsImage =
      req.files && req.files.goodsImage && req.files.goodsImage[0].filename
        ? req.files.goodsImage[0].filename
        : req.body.goodsImage;
    let invocieImage =
      req.files && req.files.invocieImage && req.files.invocieImage[0].filename
        ? req.files.invocieImage[0].filename
        : req.body.invocieImage;

    console.log(goodsImage);
    console.log(invocieImage);
    let pathg = "public/uploads/" + goodsImage;
    let pathi = "public/uploads/" + invocieImage;
    try {
      const body = req.body;
      let userid = body.userId;
      let loan_type = body.loan_type;
      let distributor = body.distributor;
      let loan_amount = body.loanAmount;
      let tenure = body.tenure;
      let plan = body.plan;
      let bank_id = "1";
      let user_name = body.user_name;
      let phone_no = body.phone_no;
      let email = body.email;

      let qtyNewProduct = body.qtyNewProduct;
      let currentInventory = body.currentInventory;
      let mblPercentage = body.mblPercentage;

      console.log(loan_amount);
      User.findOne({ _id: userid }).then((user) => {
        if (user) {
          let pending_loan;
          let total_loan;
          if (user.pending_loan && user.total_loan) {
            pending_loan = user.pending_loan + loan_amount;
            total_loan = user.total_loan + loan_amount;
            // convert to integer
            pending_loan = parseInt(pending_loan);
            total_loan = parseInt(total_loan);
          } else {
            pending_loan = loan_amount;
            total_loan = loan_amount;
            pending_loan = parseInt(pending_loan);
            total_loan = parseInt(total_loan);
          }

          User.findOneAndUpdate(
            { _id: userid },
            { pending_loan: pending_loan, total_loan: total_loan }
          ).then((user) => {
            if (user) {
              // console.log(user);
            } else {
              console.log("No user found");
            }
          });
        }
      });

      Loans.insertMany({
        userid: userid,
        user_name: user_name,
        loan_type: loan_type,
        distributor: distributor,
        loan_amount: loan_amount,
        tenure: tenure,
        plan: plan,
        bank_id: bank_id,
        phone_no: phone_no,
        email: email,
        invocieImage: invocieImage,
        goodsImage: goodsImage,
        qtyNewProduct: qtyNewProduct,
        currentInventory: currentInventory,
        mblPercentage: mblPercentage,
      }).then((loans) => {
        return res.status(200).json({
          loans: loans,
          success: true,
          message: "Loan added successfully",
        });
      });
    } catch (err) {
      console.log(err);
    }
  }
);

router.post("/upload-loans-tijarah", (req, res) => {
  try {
    const body = req.body;
    let userid = body.userId;
    let loan_type = body.loan_type;
    let distributor = body.distributor;
    let loan_amount = body.loanAmount;
    let tenure = body.tenure;
    let plan = body.plan;
    let bank_id = "1";
    let user_name = body.user_name;
    let qtyNewProduct = body.qtyNewProduct;
    let currentInventory = body.currentInventory;
    let mblPercentage = body.mblPercentage;

    User.findOne({ _id: userid }).then((user) => {
      if (user) {
        pending_loan = user.pending_loan + loan_amount;

        total_loan = user.total_loan + loan_amount;

        // let pending_loan = tempUser.pending_loan + loan_amount;
        // let total_loan = tempUser.total_loan + loan_amount;
        // console.log(pending_loan);
        // console.log(total_loan);

        User.findOneAndUpdate(
          { _id: userid },
          { pending_loan: pending_loan, total_loan: total_loan }
        ).then((user) => {
          if (user) {
            //console.log(user);
          } else {
            //console.log("No user found");
          }
        });
      }
    });

    TijarahLoans.insertMany({
      userid: userid,
      user_name: user_name,
      loan_type: loan_type,
      distributor: distributor,
      loan_amount: loan_amount,
      tenure: tenure,
      plan: plan,
      bank_id: bank_id,
      qtyNewProduct: qtyNewProduct,
      currentInventory: currentInventory,
      mblPercentage: mblPercentage,
    }).then((loans) => {
      return res.status(200).json({
        loans: loans,
        success: true,
        message: "Loan added successfully",
      });
    });
  } catch (err) {
    console.log(err);
  }
});

//     router.post('/upload-loans', (req, res) => {
//         try{

//     let body = (req.body);
//     let userid = body.userId;
//     let loan_type = body.loan_type;
//     let distributor = body.distributor;
//     let loan_amount = body.loanAmount;
//     let tenure = body.tenure;
//     let plan = body.plan;
//     let bank_id = '1';
//     let user_name = body.user_name;
//     console.log(body);

//     Loans.insertMany({
//         userid: userid,
//         user_name: user_name,
//         loan_type: loan_type,
//         distributor: distributor,
//         loan_amount : loan_amount,
//         tenure : tenure,
//         plan : plan,
//         bank_id: bank_id
//     }).then(loans => {
//         console.log(body);
//         return res.status(200).json({
//             loans: body,
//             success: true,
//             message: "Loan added successfully",
//         });
//     }
//     );
// }
// catch(err){
//     console.log(err);
// }
// }
// );

router.post("/upload-loans2", (req, res) => {
  try {
    const body = req.body;
    let id = body.id;

    let phone_number = body.phoneNumber;
    let invoice_number = body.invoiceNumber;
    let destination_location = body.salesLocation;
    let distributor = body.distributorVal;
    // update loans by id
    if (distributor) {
      Loans.findOneAndUpdate(
        { _id: id },
        {
          phone_number: phone_number,
          invoice_number: invoice_number,
          destination_location: destination_location,
          distributor: distributor,
        }
      ).then((loans) => {
        return res.status(200).json({
          loans: loans,
          success: true,
          message: "Loan added successfully",
        });
      });
    } else {
      Loans.findOneAndUpdate(
        { _id: id },
        {
          phone_number: phone_number,
          invoice_number: invoice_number,
          destination_location: destination_location,
        }
      ).then((loans) => {
        return res.status(200).json({
          loans: loans,
          success: true,
          message: "Loan added successfully",
        });
      });
    }
  } catch (err) {
    console.log(err);
  }
});

router.post("/upload-loans2-tijarah", (req, res) => {
  try {
    const body = req.body;
    let userid = body.userId;

    let phone_number = body.phoneNumber;
    let invoice_number = body.invoiceNumber;
    let destination_location = body.salesLocation;
    let distributor = body.distributorVal;

    TijarahLoans.insertMany(
      { userid: userid },
      { phone_number: phone_number },
      { invoice_number: invoice_number },
      { destination_location: destination_location },
      { distributor: distributor }
    ).then((loans) => {
      return res.status(200).json({
        loans: loans,
        success: true,
        message: "Loan added successfully",
      });
    });
  } catch (err) {
    console.log(err);
  }
});

router.get("/pending-loans", (req, res) => {
  try {
    let data = [];
    let loans = Loans.find({ status: "pending" }).then((loans) => {
      if (loans) {
        return res.status(200).send(loans);
      } else {
        return res.status(400).json({
          error: "No loans found",
        });
      }
    });
  } catch (err) {
    console.log(err);
  }
});

router.get("/approved-loans", (req, res) => {
  try {
    let loans = [];
    let loan = Loans.find({ status: "Approve" }).then((loan) => {
      if (loan) {
        return res.status(200).send(loan);
        loans.push("loan", loan);
      } else {
        // return res.status(400).json({
        //     error: "No loans found",
        // });
      }

      TijarahLoans.find({ status: "Approve" }).then((tijarahLoans) => {
        if (tijarahLoans) {
          loans.push("tijarahLoans", tijarahLoans);
          return res.status(200).send(loans);
          //return res.status(200).send(loans);
        }
      });
    });
  } catch (err) {
    console.log(err);
  }
});

router.get("/rejected-loans", (req, res) => {
  try {
    let data = [];
    let loans = Loans.find({ status: "Rejected" }).then((loans) => {
      if (loans) {
        return res.status(200).send(loans);
      } else {
        return res.status(400).json({
          error: "No loans found",
        });
      }
    });
  } catch (err) {
    console.log(err);
  }
});

router.post("/approve-loan", (req, res) => {
  try {
    const id = req.body.id;

    Loans.findOneAndUpdate({ _id: id }, { status: "Approve" }).then((loans) => {
      if (loans) {
        User.findOne({ _id: loans.userid }).then((user) => {
          if (user) {
            let ptemp_loan = user.pending_loan;
            let aproved_loan = loans.loan_amount;
            let pending_loan = ptemp_loan - loans.loan_amount;

            User.findOneAndUpdate(
              { _id: loans.userid },
              { pending_loan: pending_loan, aproved_loan: aproved_loan }
            ).then((usernew) => {
              if (usernew) {
                console.log(usernew);
              } else {
                console.log("No user found");
              }
            });
          }
        });
        return res.status(200).json({
          loans: loans,
          success: true,
          message: "Loan approved successfully",
        });
      } else {
        return res.status(400).json({
          error: "Loan not found",
        });
      }
    });
  } catch (err) {
    console.log(err);
  }
});

router.post("/reject-loan", (req, res) => {
  try {
    const id = req.body.id;
    Loans.findOneAndUpdate({ _id: id }, { status: "Rejected" }).then(
      (loans) => {
        if (loans) {
          return res.status(200).json({
            loans: loans,
            success: true,
            message: "Loan approved successfully",
          });
        } else {
          return res.status(400).json({
            error: "Loan not found",
          });
        }
      }
    );
  } catch (err) {
    console.log(err);
  }
});

// tijarah routes

router.get("/pending-loans-tijarah", (req, res) => {
  try {
    let data = [];
    console.log("pending loanssssssssssss");
    TijarahLoans.find({ status: "pending" }).then((loans) => {
      if (loans) {
        console.log(loans);
        return res.status(200).send(loans);
      } else {
        return res.status(400).json({
          error: "No loans found",
        });
      }
    });
  } catch (err) {
    console.log(err);
  }
});

router.get("/approved-loans-tijarah", (req, res) => {
  try {
    let data = [];
    TijarahLoans.find({ status: "Approve" }).then((loans) => {
      if (loans) {
        return res.status(200).send(loans);
      } else {
        return res.status(400).json({
          error: "No loans found",
        });
      }
    });
  } catch (err) {
    console.log(err);
  }
});

router.get("/rejected-loans-tijarah", (req, res) => {
  try {
    let data = [];
    TijarahLoans.find({ status: "Rejected" }).then((loans) => {
      if (loans) {
        return res.status(200).send(loans);
      } else {
        return res.status(400).json({
          error: "No loans found",
        });
      }
    });
  } catch (err) {
    console.log(err);
  }
});

router.post("/approve-loan-tijarah", (req, res) => {
  try {
    const id = req.body.id;

    TijarahLoans.findOneAndUpdate({ _id: id }, { status: "Approve" }).then(
      (loans) => {
        if (loans) {
          User.findOne({ _id: loans.userid }).then((user) => {
            if (user) {
              let ptemp_loan = user.pending_loan;
              let aproved_loan = loans.loan_amount;
              let pending_loan = ptemp_loan - loans.loan_amount;

              User.findOneAndUpdate(
                { _id: loans.userid },
                { pending_loan: pending_loan, aproved_loan: aproved_loan }
              ).then((usernew) => {
                if (usernew) {
                  console.log(usernew);
                } else {
                  console.log("No user found");
                }
              });
            }
          });
          return res.status(200).json({
            loans: loans,
            success: true,
            message: "Loan approved successfully",
          });
        } else {
          return res.status(400).json({
            error: "Loan not found",
          });
        }
      }
    );
  } catch (err) {
    console.log(err);
  }
});

router.post("/reject-loan-tijarah", (req, res) => {
  try {
    const id = req.body.id;
    TijarahLoans.findOneAndUpdate({ _id: id }, { status: "Rejected" }).then(
      (loans) => {
        if (loans) {
          return res.status(200).json({
            loans: loans,
            success: true,
            message: "Loan approved successfully",
          });
        } else {
          return res.status(400).json({
            error: "Loan not found",
          });
        }
      }
    );
  } catch (err) {
    console.log(err);
  }
});

// create an api that return loan details by loan id
router.get("/userloandetails/:id", (req, res) => {
  try {
    let data = [];
    let id = req.params.id;
    Loans.find({ _id: id }).then((loans) => {
      if (loans) {
        return res.status(200).send(loans);
      } else {
        return res.status(400).json({
          error: "No loans found",
        });
      }
    });
  } catch (err) {
    console.log(err);
  }
});

module.exports = router;
