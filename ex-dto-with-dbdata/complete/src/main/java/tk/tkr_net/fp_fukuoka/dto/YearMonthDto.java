package tk.tkr_net.fp_fukuoka.dto;

/**
 * 年月を表す表示用クラス
 * イミュータブル
 */
public class YearMonthDto {
    public final int year;
    public final int month;

    public YearMonthDto(int year, int month) {
        this.year = year;
        this.month = month;
    }

    /**
     * YYYY年M月
     */
    public String getLabel() {
        return year + " 年 " + month + " 月";
    }

    /**
     * リンクURL
     */
    public String getLink() {
        return "/" + year + "/" + month;
    }
}