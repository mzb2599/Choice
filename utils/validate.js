export const isValidPhone = (phone) =>
  /^[0-9]{10}$/.test(phone.replace(/\D/g, ""));

export const isValidAmount = (value) =>
  !isNaN(parseFloat(value)) && parseFloat(value) > 0;
