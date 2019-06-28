"use strict"

/*
 * Stateオブジェクトのインターフェイス
 * {
 *  value: string
 *  valid: boolean
 *  message: string
 * }
 */

// exportしやすいように1つのオブジェクトにまとめちゃう
const Validator = {}
/**
 * 名前のバリデーション
 * @param {State} state 
 */
Validator.validateName = function(state) {
  if (state.value) {
    return {
      ...state,
      valid: true,
      message: ""
    }
  } else {
    return {
      ...state,
      valid: false,
      message: "名前を入力してください"
    }
  }
}
Validator.validateAddress = function(state) {
  if (state.value) {
    return {
      ...state,
      valid: true,
      message: ""
    }
  } else {
    return {
      ...state,
      valid: false,
      message: "住所を入力してください"
    }
  }
}
Validator.validateZip = function(state) {
  if (state.value) {
    if (state.value.match(/^\d{3}-\d{4}$/)) {
      return {
        ...state,
        valid: true,
        message: ""
      }
    } else {
      return {
        ...state,
        valid: false,
        message: "000-0000の形式で入力してください"
      }
    }
  } else {
    return {
      ...state,
      valid: false,
      message: "郵便番号を入力してください"
    }
  }
}
Validator.validateMail = function(state) {
  if (state.value) {
    if (state.value.match(/^[\w\.]+@[\w\.]+[^\.]$/)) {
      return {
        ...state,
        valid: true,
        message: ""
      }
    } else {
      return {
        ...state,
        valid: false,
        message: "メールアドレスの形式が正しくありません。"
      }
    }
  } else {
    return {
      ...state,
      valid: false,
      message: "メールアドレスを入力してください"
    }
  }
}


// テスト用コード。ブラウザでは実行されない
if (typeof module !== "undefined" && typeof module.exports !== "undefined") {
  module.exports = Validator;
}