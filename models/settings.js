const mongoose = require("mongoose");

const settingSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true
    },
    logo: {
      alt: {
        type: String,
        required: true
      },
      caption: {
        type: String,
        required: true
      },
      url: {
        type: String,
        required: true
      }
    },
    slogan: {
      type: String,
      required: true
    },
    address: {
      city: {
        type: String,
        required: true
      },
      country: {
        type: String,
        required: true
      },
      postalCode: {
        type: String,
        required: true
      }
    },
    phoneNumber: {
      type: String,
      required: true
    },
    officeEmail: {
      type: String,
      required: true
    },
    aboutUs: {
      type: String,
      required: true
    },
    maintainceMode: {
      type: Boolean
    },
    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    }
  },
  { timestamps: true }
);

const Setting = mongoose.model("Settings", settingSchema);
module.exports = Setting;
