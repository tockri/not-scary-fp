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
        // 月の1日を含む週の日曜日
        final var calendarTop = switch (monthTop.getDayOfWeek()) {
            case SUNDAY -> monthTop;
            default -> monthTop.minusDays(monthTop.getDayOfWeek().getValue());
        };
        var weeks = new ArrayList<WeekRowDto>();
        for (var sunday = calendarTop; sunday.isBefore(nextMonthTop); sunday = sunday.plusDays(7)) {
            var days = new ArrayList<DayCellDto>();
            for (var i = 0; i < 7; i++) { // 日曜～土曜の7日間
                final var date = sunday.plusDays(i);
                var schedulesInDay = schedules.stream()
                        .filter(s -> s.getDate().equals(date))
                        .map(s -> s.getTitle())
                        .collect(Collectors.toList());
                days.add(new DayCellDto(calendarTop, calendarTop.getMonthValue() == month, schedulesInDay));
            }
            weeks.add(new WeekRowDto(days));
        }
        return new ScheduleCalendarDto(weeks);
    }
}