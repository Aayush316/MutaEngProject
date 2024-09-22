const VerifyRecaptcha = async (captchaValue) => {
    const secretKey = '6LfSDUsqAAAAACy5MexSJsMKviFGM2wpFJeFTqCs'; 
    const response = await fetch(`https://www.google.com/recaptcha/api/siteverify?secret=${secretKey}&response=${captchaValue}`, {
      method: 'POST',
    });
    const data = await response.json();
    return data.success;
};

export default VerifyRecaptcha;
