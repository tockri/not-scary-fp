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
 * valueが空かどうかチェックする
 * @param {State} state
 * @param {string} messageIfError 空の場合のエラーメッセージ
 * @returns {State} 結果のState
 */
Validator.checkEmpty = function(state, messageIfError) {
  if (state.value !== "") {
    return {
      ...state,
      valid: true,
      message: ""
    }
  } else {
    return {
      ...state,
      valid: false,
      message: messageIfError
    }
  }
}
/**
 * valueが正規表現に一致しているかチェックする
 * @param {State} state
 * @param {Regex} pattern 正規表現
 * @param {string} messageIfError 一致しない場合のエラーメッセージ
 * @returns {State} 結果のState
 */
Validator.checkPattern = function(state, pattern, messageIfError) {
  if (!state.valid) {
    return state;
  }
  if (state.value.match(pattern)) {
    return {
      ...state,
      valid: true,
      message: ""
    };
  } else {
    return {
      ...state,
      valid: false,
      message: messageIfError
    };
  }
}
/**
 * 名前のバリデーション（純粋関数）
 * @param {State} state
 * @return {State} 結果のstate
 */
Validator.validateName = function(state) {
  return Validator.checkEmpty(state, "名前を入力してください");
}
/**
 * 郵便番号のバリデーション（純粋関数）
 * @param {State} state
 * @return {State} 結果のstate
 */
Validator.validateZip = function(state) {
  const state1 = Validator.checkEmpty(state, "郵便番号を入力してください");
  return Validator.checkPattern(state1, /^\d{3}-\d{4}$/, "000-0000の形式で入力してください");
}
/**
 * 住所のバリデーション（純粋関数）
 * @param {State} state
 * @return {State} 結果のstate
 */
Validator.validateAddress = function(state) {
  return Validator.checkEmpty(state, "住所を入力してください");
}
/**
 * メールアドレスのバリデーション（純粋関数）
 * @param {State} state
 * @return {State} 結果のstate
 */
Validator.validateMail = function(state) {
  const state1 = Validator.checkEmpty(state, "メールアドレスを入力してください");
  return Validator.checkPattern(state1, /^[\w\.]+@[\w\.]+[^\.]$/, "メールアドレスの形式が正しくありません。");
}


// テスト用コード。ブラウザでは実行されない
if (typeof module !== "undefined" && typeof module.exports !== "undefined") {
  module.exports = Validator;
}