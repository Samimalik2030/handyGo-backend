import { getOtpRepository } from "../entity/otp";


const otpRepository = getOtpRepository();


export const generateOTP = async (email: string) => {
  const otp = Math.floor(100000 + Math.random() * 900000);
  const createdOtp = otpRepository.create({
    email,
    otp: otp,
  });
  otpRepository.save(createdOtp);
  return otp;
};

export const checkOtpExists = async (email: string,otp:number): Promise<boolean> => {
  const existingOtp = await otpRepository.findOne({ where: { email, otp} });
    return !!existingOtp;
}

export const verifyOTP = async (email: string, otp:number): Promise<boolean> => {
  const savedOtp = await otpRepository.findOne({ where: { email, otp } });
  if (!savedOtp) {
    return false;
  }
  await otpRepository.delete(savedOtp.id);
  return true;
};