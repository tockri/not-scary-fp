package tk.tkr_net.fp_fukuoka.dto;

import java.time.LocalDate;
import java.util.Collections;
import java.util.List;

/**
 * 日を表すセル
 * イミュータブル
 */
public class DayCellDto {
    public final List<String> schedules;
    public final LocalDate date;
    public final boolean inRange;
    
    public DayCellDto(LocalDate date, boolean inRange, List<String> schedules) {
        this.date = date;
        this.inRange = inRange;
        this.schedules = Collections.unmodifiableList(schedules);
    }

    /**
     * 日付
     */
    public int getDayOfMonth() {
        return date.getDayOfMonth();
    }

    /**
     * <td>タグに設定するclass属性
     */
    public String getCssClass() {
        return date.getDayOfWeek().name().toLowerCase()
            + (inRange ? "" : " out-month");
    }
}