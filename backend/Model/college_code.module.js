const mongoose = require("mongoose");

const college_code_Schema = mongoose.Schema({
  departmentName: {
    type: String,
    require: true,
  },
});