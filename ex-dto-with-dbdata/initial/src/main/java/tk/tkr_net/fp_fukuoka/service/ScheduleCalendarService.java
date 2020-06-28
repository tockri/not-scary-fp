package tk.tkr_net.fp_fukuoka.service;

import java.time.LocalDate;

import org.springframework.stereotype.Service;

import tk.tkr_net.fp_fukuoka.dto.DayCellDto;
import tk.tkr_net.fp_fukuoka.dto.ScheduleCalendarDto;
import tk.tkr_net.fp_fukuoka.dto.WeekRowDto;
import tk.tkr_net.fp_fukuoka.model.ScheduleRepository;

@Service
public class ScheduleCalendarService {
    private final ScheduleRepository scheduleRepository;

    public ScheduleCalendarService(ScheduleRepository scheduleRepository) {
        this.scheduleRepository = scheduleRepository;
    }

    /**
     * DBからデータを取得してDTOを構築する
     */
    public ScheduleCalendarDto makeDto(int year, int month) {
        // 月の1日
        var monthTop = LocalDate.of(year, month, 1);
        // 次月の1日
        var nextMonthTop = monthTop.plusMonths(1);
        // 月の1日を含む週の日曜日
        var calendarTop = switch (monthTop.getDayOfWeek()) {
            case SUNDAY -> monthTop;
            default -> monthTop.minusDays(monthTop.getDayOfWeek().getValue());
        };
        // DBからデータ取得
        var schedules = scheduleRepository.findBetween(monthTop, nextMonthTop);
        
        var dto = new ScheduleCalendarDto();
        for (var sunday = calendarTop; sunday.isBefore(nextMonthTop); sunday = sunday.plusDays(7)) {
            var weekRow = new WeekRowDto();
            for (var i = 0; i < 7; i++) { // 日曜～土曜の7日間
                var date = sunday.plusDays(i);
                var dayCell = new DayCellDto(date, date.getMonthValue() == month);
                weekRow.addDay(dayCell);
                // スケジュールをセルに設定
                for (var schedule : schedules) {
                    if (schedule.getDate().equals(date)) {
                        dayCell.addSchedule(schedule.getTitle());
                    }
                }
            }
            dto.addWeek(weekRow);
        }
        return dto;
    }
}