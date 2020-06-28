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
        // DBからデータ取得
        var from = LocalDate.of(year, month, 1);
        var to = from.plusMonths(1);
        var schedules = scheduleRepository.findBetween(from, to);

        // 月の1日
        var monthTop = from;
        // 次月の1日
        var nextMonthTop = monthTop.plusMonths(1);
        // ループ用変数：月の1日を含む週の日曜日から開始
        var d = switch (monthTop.getDayOfWeek()) {
            case SUNDAY -> monthTop;
            default -> monthTop.minusDays(monthTop.getDayOfWeek().getValue());
        };
        var dto = new ScheduleCalendarDto();
        while (d.isBefore(nextMonthTop)) {
            var weekRow = new WeekRowDto();
            for (var i = 0; i < 7; i++, d = d.plusDays(1)) { // 日曜～土曜の7日間
                var dayCell = new DayCellDto(d, d.getMonthValue() == month);
                weekRow.addDay(dayCell);
                // スケジュールをセルに設定
                for (var schedule : schedules) {
                    if (schedule.getDate().equals(d)) {
                        dayCell.addSchedule(schedule.getTitle());
                    }
                }
            }
            dto.addWeek(weekRow);
        }
        return dto;
    }
}