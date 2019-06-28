const Validator = require('../js/validator');

test("validateName check empty", () => {
  const result = Validator.validateName({
    value: "",
    valid: true,
    message: ""
  });
  expect(result).toStrictEqual({
    value: "",
    valid: false,
    message: "名前を入力してください"
  });
});

test("validateName check not empty", () => {
  const result = Validator.validateName({
    value: "Not empty",
    valid: true,
    message: ""
  });
  expect(result).toStrictEqual({
    value: "Not empty",
    valid: true,
    message: ""
  })
});

test("validateZip check empty", () => {
  const result = Validator.validateZip({
    value: "",
    valid: true,
    message: ""
  });
  expect(result).toStrictEqual({
    value: "",
    valid: false,
    message: "郵便番号を入力してください"
  })
});

test("validateZip check ZIP code format", () => {
  const result = Validator.validateZip({
    value: "0001111",
    valid: true,
    message: ""
  });
  expect(result).toStrictEqual({
    value: "0001111",
    valid: false,
    message: "000-0000の形式で入力してください"
  })
});

test("validateZip pass ZIP code format", () => {
  const result = Validator.validateZip({
    value: "000-1111",
    valid: true,
    message: ""
  });
  expect(result).toStrictEqual({
    value: "000-1111",
    valid: true,
    message: ""
  })
});

test("validateAddress check address empty", () => {
  const result = Validator.validateAddress({
    value: "",
    valid: true,
    message: ""
  });
  expect(result).toStrictEqual({
    value: "",
    valid: false,
    message: "住所を入力してください"
  });
});

test("validateAddress check address not empty", () => {
  const result = Validator.validateAddress({
    value: "福岡市",
    valid: true,
    message: ""
  });
  expect(result).toStrictEqual({
    value: "福岡市",
    valid: true,
    message: ""
  });
});

test("validateMail check empty", () => {
  const result = Validator.validateMail({
    value: "",
    valid: true,
    message: ""
  });
  expect(result).toStrictEqual({
    value: "",
    valid: false,
    message: "メールアドレスを入力してください"
  })
});

test("validateMail check Mail code format", () => {
  const result = Validator.validateMail({
    value: "test",
    valid: true,
    message: ""
  });
  expect(result).toStrictEqual({
    value: "test",
    valid: false,
    message: "メールアドレスの形式が正しくありません。"
  })
});

test("validateMail pass Mail code format", () => {
  const result = Validator.validateMail({
    value: "test@example.com",
    valid: true,
    message: ""
  });
  expect(result).toStrictEqual({
    value: "test@example.com",
    valid: true,
    message: ""
  })
});
