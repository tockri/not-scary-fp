package tk.tkr_net.fp_fukuoka.dto;

import java.util.Collections;
import java.util.List;

/**
 * 一か月分の日曜始まりカレンダーにスケジュールを表示するためのDTO
 * イミュータブル
 */
public class ScheduleCalendarDto {
    public final List<WeekRowDto> weeks;

    public ScheduleCalendarDto(List<WeekRowDto> weeks) {
        this.weeks = Collections.unmodifiableList(weeks);
    }
}