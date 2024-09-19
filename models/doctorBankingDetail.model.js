import mongoose from "mongoose";

const doctorBankingDetail = mongoose.Schema(
  {
    accountName: {
        type: String,
        required: [true, "Please enter your account name"],
      },
      bankName: {
        type: String,
        required: [true, "Please enter your bank name"],
      },
      bankAddress: {
        type: String,
        required: [true, "Please enter your bank address"],
      },
      bankAccountNumber: {
        type: String,
        required: [true, "Please enter your bank account number"],
        minlength: [8, "Bank account number must be at least 8 characters"],
      },
      branchCodeIFSC: {
        type: String,
        required: [true, "Please enter your branch code or IFSC"],
      },
      bankAccountNumberIBAN: {
        type: String,
        required: [true, "Please enter your IBAN"],
      },
      fullName: {
        type: String,
        required: [true, "Please enter your full name"],
      },
      speciality: {
        type: String,
        required: [true, "Please enter your speciality"],
      },
      description: {
        type: String,
        required: [true, "Please provide a description"],
      },
      experience: {
        type: String,
        required: [true, "Please enter your years of experience"],
      },
      consultationCharges: {
        type: String,
        required: [true, "Please enter your consultation charges"],
      }
  },
  {
    timestamps: true,
  }
);


const DoctorBankingDetail = mongoose.model("doctorBankingDetail", doctorBankingDetail);
export default DoctorBankingDetail;