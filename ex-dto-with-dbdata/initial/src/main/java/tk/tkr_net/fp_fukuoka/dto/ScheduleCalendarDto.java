package tk.tkr_net.fp_fukuoka.dto;

import java.util.ArrayList;
import java.util.List;


/**
 * 一か月分の日曜始まりカレンダーにスケジュールを表示するためのDTO
 */
public class ScheduleCalendarDto {
    private final ArrayList<WeekRowDto> weeks = new ArrayList<>();

    /**
     * 週を追加する
     */
    public void addWeek(WeekRowDto week) {
        weeks.add(week);
    }

    /**
     * 週リスト
     */
    public List<WeekRowDto> getWeeks() {
        return weeks;
    }
}