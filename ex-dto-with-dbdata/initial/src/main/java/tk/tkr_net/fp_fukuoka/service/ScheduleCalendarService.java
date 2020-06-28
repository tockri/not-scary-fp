package tk.tkr_net.fp_fukuoka.service;

import java.time.DayOfWeek;
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

        var dto = new ScheduleCalendarDto();
        // 今月1日
        var d1 = LocalDate.of(year, month, 1);
        // 日曜日まで戻る
        var d = d1;
        while (d.getDayOfWeek() != DayOfWeek.SUNDAY) {
            d = d.minusDays(1);
        }
        // 来月になるまでループ
        var guard = d1.plusMonths(1);
        while (d.isBefore(guard)) {
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