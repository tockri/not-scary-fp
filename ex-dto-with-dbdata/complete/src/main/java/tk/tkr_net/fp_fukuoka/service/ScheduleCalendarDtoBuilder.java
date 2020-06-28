package tk.tkr_net.fp_fukuoka.service;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

import tk.tkr_net.fp_fukuoka.dto.DayCellDto;
import tk.tkr_net.fp_fukuoka.dto.ScheduleCalendarDto;
import tk.tkr_net.fp_fukuoka.dto.WeekRowDto;
import tk.tkr_net.fp_fukuoka.model.Schedule;

public class ScheduleCalendarDtoBuilder {
    /**
     * 画面表示用DTOを構築する
     */
    public static ScheduleCalendarDto build(int year, int month, List<Schedule> schedules) {
        // 月の1日
        var monthTop = LocalDate.of(year, month, 1);
        // 次月の1日
        var nextMonthTop = monthTop.plusMonths(1);
        // ループ用変数：月の1日を含む週の日曜日から開始
        var d = switch (monthTop.getDayOfWeek()) {
            case SUNDAY -> monthTop;
            default -> monthTop.minusDays(monthTop.getDayOfWeek().getValue());
        };
        var weeks = new ArrayList<WeekRowDto>();
        while (d.isBefore(nextMonthTop)) {
            var days = new ArrayList<DayCellDto>();
            for (var i = 0; i < 7; i++, d = d.plusDays(1)) { // 日曜～土曜の7日間
                final var date = d;
                var schedulesInDay = schedules.stream()
                        .filter(s -> s.getDate().equals(date)).map(s -> s.getTitle())
                        .collect(Collectors.toList());
                days.add(new DayCellDto(d, d.getMonthValue() == month, schedulesInDay));
            }
            weeks.add(new WeekRowDto(days));
        }
        return new ScheduleCalendarDto(weeks);
    }
}