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
 * valueの全角を半角に正規化する
 * @param {State} state
 * @returns {State} 正規化済みState
 */
Validator.normalizeToAscii = function(state) {
  function toAscii(str) {
    return str.replace(/[Ａ-Ｚａ-ｚ０-９＠．]/g, function(s) {
      return String.fromCharCode(s.charCodeAt(0) - 65248);
    }).replace(/[ー−―‐]/, "-");
  }
  return {
    ...state,
    value: toAscii(state.value)
  };
}
/**
 * 郵便番号のハイフン無しをハイフン有りに正規化する
 * @param {State} state
 * @returns {State} 正規化済みState
 */
Validator.normalizeZipFormat = function(state) {
  function normalize(str) {
    const m = str.match(/^(\d{3})(\d{4})$/)
    if (m) {
      return m[1] + "-" + m[2];
    } else {
      return str;
    }
  }
  return {
    ...state,
    value: normalize(state.value)
  };
}
/**
 * 大文字を小文字にに正規化する
 * @param {State} state
 * @returns {State} 正規化済みState
 */
Validator.normalizeToLower = function(state) {
  return {
    ...state,
    value: state.value.toLowerCase()
  };
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
  const state1 = Validator.normalizeToAscii(state);
  const state2 = Validator.normalizeZipFormat(state1);
  const state3 = Validator.checkEmpty(state2, "郵便番号を入力してください");
  return Validator.checkPattern(state3, /^\d{3}-\d{4}$/, "000-0000の形式で入力してください");
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
  const state1 = Validator.normalizeToLower(state);
  const state2 = Validator.checkEmpty(state1, "メールアドレスを入力してください");
  return Validator.checkPattern(state2, /^[\w\.]+@[\w\.]+[^\.]$/, "メールアドレスの形式が正しくありません。");
}


// テスト用コード。ブラウザでは実行されない
if (typeof module !== "undefined" && typeof module.exports !== "undefined") {
  module.exports = Validator;
}