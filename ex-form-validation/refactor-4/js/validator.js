"use strict"

/*
 * Stateオブジェクトのインターフェイス
 * {
 *  value: string
 *  valid: boolean
 *  message: string
 * }
 */

/**
 * 関数型プログラミングの道具
 */
const FP = {};
/**
 * pipe 結合
 */
FP.pipe = function() {
  const funcs = arguments;
  return function(s) {
    let r = s;
    for (let i = 0; i < funcs.length; i++) {
      r = funcs[i](r);
    }
    return r;
  }
};


// exportしやすいように1つのオブジェクトにまとめちゃう
const Validator = {};

/**
 * valueが空かどうかチェックする
 * @param {State} state
 * @param {string} messageIfError 空の場合のエラーメッセージ
 * @returns {State} 結果のState
 */
Validator.checkEmpty = function(messageIfError) {
  return function(state) {
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
};

/**
 * valueが正規表現に一致しているかチェックする
 * @param {State} state
 * @param {Regex} pattern 正規表現
 * @param {string} messageIfError 一致しない場合のエラーメッセージ
 * @returns {State} 結果のState
 */
Validator.checkPattern = function(pattern, messageIfError) {
  return function(state) {
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
};

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
};

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
};

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
};

/**
 * 名前のバリデーション（純粋関数）
 * @param {State} state
 * @return {State} 結果のstate
 */
Validator.validateName = Validator.checkEmpty("名前を入力してください");

/**
 * 郵便番号のバリデーション（純粋関数）
 * @param {State} state
 * @return {State} 結果のstate
 */
Validator.validateZip = FP.pipe(
  Validator.normalizeToAscii,
  Validator.normalizeZipFormat,
  Validator.checkEmpty("郵便番号を入力してください"),
  Validator.checkPattern(/^\d{3}-\d{4}$/, "000-0000の形式で入力してください")
);

/**
 * 住所のバリデーション（純粋関数）
 * @param {State} state
 * @return {State} 結果のstate
 */
Validator.validateAddress = Validator.checkEmpty("住所を入力してください");

/**
 * メールアドレスのバリデーション（純粋関数）
 * @param {State} state
 * @return {State} 結果のstate
 */
Validator.validateMail = FP.pipe(
  Validator.normalizeToLower,
  Validator.checkEmpty("メールアドレスを入力してください"),
  Validator.checkPattern(/^[\w\.]+@[\w\.]+[^\.]$/, "メールアドレスの形式が正しくありません。")
);



// テスト用コード。ブラウザでは実行されない
if (typeof module !== "undefined" && typeof module.exports !== "undefined") {
  module.exports = Validator;
}