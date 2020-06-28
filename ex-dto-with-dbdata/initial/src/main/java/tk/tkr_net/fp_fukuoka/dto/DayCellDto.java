package tk.tkr_net.fp_fukuoka.dto;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

/**
 * 日を表すセル
 */
public class DayCellDto {
    private final ArrayList<String> schedules = new ArrayList<>();
    public final LocalDate date;
    public final boolean inRange;
    
    public DayCellDto(LocalDate date, boolean inRange) {
        this.date = date;
        this.inRange = inRange;
    }

    /**
     * スケジュールを追加
     */
    public void addSchedule(String title) {
        schedules.add(title);
    }

    /**
     * スケジュールのリスト
     */
    public List<String> getSchedules() {
        return schedules;
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